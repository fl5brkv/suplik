import {digest} from 'ohash';
import {z} from 'zod';
import {offerResponseInsertSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    offerResponseInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  const params = await getValidatedRouterParams(event, (params) =>
    z
      .object({
        response: z.string().min(1),
      })
      .parse(params)
  );

  const decodedResponse = atob(decodeURIComponent(params.response));

  const [id, token, expiresAt] = decodedResponse.split(':');

  if (Date.now() > Number(expiresAt))
    throw createError({
      statusMessage: 'Expired verification response.',
    });

  const selected = await useDrizzle().query.offers.findFirst({
    where: (offers, {eq}) => eq(offers.id, Number(id)),
    columns: {
      additionalInfo: true,
    },
    with: {
      offerServices: {
        columns: {
          serviceId: true,
          technicianId: true,
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
              productId: true,
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
  });

  if (!selected)
    throw createError({
      statusCode: 404,
      statusMessage: 'Offer not found for the provided ID',
    });

  const config = useRuntimeConfig(event);

  if (
    token !== digest(`${Number(id)}:${selected.additionalInfo}:${config.salt}`)
  )
    throw createError({
      statusCode: 400,
      statusMessage: 'The token is invalid!',
    });

  const updated = await useDrizzle()
    .update(tables.offers)
    .set({
      status: result.data.status,
      additionalInfo: result.data.additionalInfo,
    })
    .where(eq(tables.offers.id, Number(id)))
    .returning()
    .get();

  if (!updated)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error updating offer!',
    });

  const insertedOfferAudit = await useDrizzle()
    .insert(tables.offerAudits)
    .values({
      offerId: Number(id),
      snapshot: JSON.stringify(selected),
    });

  if (!insertedOfferAudit)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error inserting offer audit!',
    });

  if (updated.status === 'accepted') {
    const insertedJob = await useDrizzle()
      .insert(tables.jobs)
      .values({
        caseId: updated.caseId,
      })
      .returning({
        id: tables.jobs.id,
      })
      .get();

    for (const offerService of selected.offerServices) {
      const insertedJobService = await useDrizzle()
        .insert(tables.jobServices)
        .values({
          jobId: insertedJob.id,
          serviceId: offerService.serviceId,
          technicianId: offerService.technicianId,
          quantity: offerService.quantity,
        })
        .returning({
          id: tables.jobServices.id,
        })
        .get();

      const offerProducts = offerService.offerProducts || [];
      if (offerProducts.length > 0) {
        await useDrizzle()
          .insert(tables.jobProducts)
          .values(
            offerProducts.map((product) => ({
              productId: product.productId,
              quantity: product.quantity,
              jobServiceId: insertedJobService.id,
              jobId: insertedJob.id,
            }))
          )
          .returning()
          .get();
      }
    }
  }

  return sendNoContent(event);
});

// const insertedJob = await useDrizzle()
//   .insert(tables.jobs)
//   .values({
//     caseId: selected.caseId,
//
//   })
//   .returning({
//
//     caseId: tables.offers.caseId,
//
//   })
//   .get();

// for (const offerService of result.data.offerServices) {
//   const insertedService = await useDrizzle()
//     .insert(tables.offerServices)
//     .values({
//       offerId: insertedOffer.id,
//       serviceId: offerService.serviceId,
//       quantity: offerService.quantity,
//     })
//     .returning({
//       id: tables.offerServices.id,
//     })
//     .get();

//   const products = offerService.offerProducts;
//   if (products && products.length > 0) {
//     await useDrizzle()
//       .insert(tables.offerProducts)
//       .values(
//         products.map((product) => ({
//           productId: product.productId,
//           quantity: product.quantity,
//           offerId: insertedOffer.id,
//           offerServiceId: insertedService.id,
//         }))
//       )
//       .returning()
//       .get();
//   }
// }
