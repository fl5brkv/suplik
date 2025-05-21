import {offerInsertSchema} from '~~/server/database/schema';
import {render} from '@vue-email/render';
import MyEmailOffer from '~~/app/components/email/Offer.vue';
import {digest} from 'ohash';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    offerInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  const insertedOffer = await useDrizzle()
    .insert(tables.offers)
    .values({
      demandId: result.data.demandId,
      additionalInfo: result.data.additionalInfo,
    })
    .returning({
      id: tables.offers.id,
    })
    .get();

  for (const offerService of result.data.offerServices) {
    const insertedService = await useDrizzle()
      .insert(tables.offerServices)
      .values({
        offerId: insertedOffer.id,
        serviceId: offerService.serviceId,
        quantity: offerService.quantity,
      })
      .returning({
        id: tables.offerServices.id,
      })
      .get();

    if (offerService.offerProducts) {
      await useDrizzle()
        .insert(tables.offerProducts)
        .values(
          offerService.offerProducts.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
            offerId: insertedOffer.id,
            offerServiceId: insertedService.id,
          }))
        )
        .returning()
        .get();
    }
  }

  const selected = await useDrizzle().query.offers.findFirst({
    columns: {
      additionalInfo: true,
    },
    with: {
      offerServices: {
        columns: {
          quantity: true,
        },
        with: {
          service: {
            columns: {
              name: true,
            },
          },
          offerProducts: {
            columns: {
              quantity: true,
            },
            with: {
              product: {
                columns: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    where: (offers, {eq}) => eq(tables.offers.id, insertedOffer.id),
  });

  if (!selected)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error selecting the offer!',
    });

  const config = useRuntimeConfig(event);

  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

  const token = digest(`${insertedOffer.id}:${config.salt}`);

  const html = await render(
    MyEmailOffer,
    {
      client: result.data.client,
      offer: selected,
      response: `${config.public.baseURL}/offers/${encodeURIComponent(
        btoa(`${insertedOffer.id}:${token}:${expiresAt}`)
      )}`,
    },
    {
      pretty: true,
    }
  );

  const {sendMail} = useNodeMailer();

  await sendMail({
    to: result.data.client.email,
    subject: 'New offer',
    html,
  });

  return sendNoContent(event);
});
