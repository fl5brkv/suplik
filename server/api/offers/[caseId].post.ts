import {offerInsertSchema} from '~~/server/database/schema';
import {render} from '@vue-email/render';
import MyEmailOffer from '~~/app/components/email/Offer.vue';
import {digest} from 'ohash';
import {z} from 'zod';
import {WorkerMailer} from 'worker-mailer';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    offerInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  const params = await getValidatedRouterParams(event, (params) =>
    z
      .object({
        caseId: z.coerce.number().int().positive(),
      })
      .safeParse(params)
  );

  if (!params.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided param is invalid',
    });

  const insertedOffer = await useDrizzle()
    .insert(tables.offers)
    .values({
      caseId: params.data.caseId,
      additionalInfo: result.data.additionalInfo,
    })
    .returning({
      id: tables.offers.id,
      caseId: tables.offers.caseId,
      additionalInfo: tables.offers.additionalInfo,
    })
    .get();

  for (const offerService of result.data.offerServices) {
    const insertedService = await useDrizzle()
      .insert(tables.offerServices)
      .values({
        offerId: insertedOffer.id,
        serviceId: offerService.serviceId,
        technicianId: offerService.technicianId,
        quantity: offerService.quantity,
      })
      .returning({
        id: tables.offerServices.id,
      })
      .get();

    const products = offerService.offerProducts;
    if (products && products.length > 0) {
      await useDrizzle()
        .insert(tables.offerProducts)
        .values(
          products.map((product) => ({
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
      case: {
        columns: {
          code: true,
        },
        with: {
          client: {
            columns: {
              email: true,
            },
          },
        },
      },

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
      statusMessage: 'No offer selected!',
    });

  const config = useRuntimeConfig(event);

  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

  const token = digest(
    `${insertedOffer.id}:${insertedOffer.additionalInfo}:${config.salt}`
  );

  // const html = await render(
  //   MyEmailOffer,
  //   {
  //     offer: selected,
  //     response: `${config.public.baseURL}/offers/${encodeURIComponent(
  //       btoa(`${insertedOffer.id}:${token}:${expiresAt}`)
  //     )}`,
  //   },
  //   {
  //     pretty: true,
  //   }
  // );

    const html = await render(
    MyEmailOffer,
    {
      offer: selected,
      response: `https://suplik.nuxt.dev/offers/${encodeURIComponent(
        btoa(`${insertedOffer.id}:${token}:${expiresAt}`)
      )}`,
    },
    {
      pretty: true,
    }
  );


  // const {sendMail} = useNodeMailer();

  // await sendMail({
  //   to: selected.case.client.email,
  //   subject: 'New offer',
  //   html,
  // });

  const mailer = await WorkerMailer.connect({
    credentials: {
      username: config.mailerUsername,
      password: config.mailerPassword,
    },
    host: 'smtp.eu.mailgun.org',
    port: 587,
    secure: false,
    authType: 'plain',
  });

  await mailer.send({
    from: {email: 'info@fpvdemo.fun'},
    subject: 'New offer',
    to: selected.case.client.email,
    html,
  });

  return sendNoContent(event);
});
