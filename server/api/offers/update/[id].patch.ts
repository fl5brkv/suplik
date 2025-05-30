import z from 'zod';
import {offerUpdateSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    offerUpdateSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid.',
    });

  const params = await getValidatedRouterParams(event, (params) =>
    z
      .object({
        id: z.coerce.number().int().positive(),
      })
      .safeParse(params)
  );

  if (!params.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided param is invalid',
    });

  const updated = await useDrizzle()
    .update(tables.offers)
    .set(result.data)
    .where(eq(tables.offers.id, params.data.id));

  if (!updated)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error updating offer!',
    });

  if (result.data.offerServices) {
    await useDrizzle()
      .delete(tables.offerProducts)
      .where(eq(tables.offerProducts.offerId, params.data.id));
    await useDrizzle()
      .delete(tables.offerServices)
      .where(eq(tables.offerServices.offerId, params.data.id));

    for (const offerService of result.data.offerServices) {
      const insertedService = await useDrizzle()
        .insert(tables.offerServices)
        .values({
          offerId: params.data.id,
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
        const insertedProducts = await useDrizzle()
          .insert(tables.offerProducts)
          .values(
            products.map((product) => ({
              productId: product.productId,
              quantity: product.quantity,
              offerId: params.data.id,
              offerServiceId: insertedService.id,
            }))
          )
          .returning({
            productId: tables.offerProducts.productId,
            quantity: tables.offerProducts.quantity,
          });

        for (const qp of insertedProducts) {
          await useDrizzle()
            .update(tables.products)
            .set({reserved: qp.quantity})
            .where(
              and(
                eq(tables.products.id, qp.productId),
                gt(tables.products.stock, qp.quantity)
              )
            );
        }
      }
    }
  }

  return 'The offer has been succesfully updated!';
});
