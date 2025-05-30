import z from 'zod';
import {quoteUpdateSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    quoteUpdateSchema.safeParse(body)
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
    .update(tables.quotes)
    .set(result.data)
    .where(eq(tables.quotes.id, params.data.id));

  if (!updated)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error updating quote!',
    });

  if (result.data.quoteProducts) {
    await useDrizzle()
      .delete(tables.quoteProducts)
      .where(eq(tables.quoteProducts.quoteId, params.data.id));

    const insertedQuoteProducts = await useDrizzle()
      .insert(tables.quoteProducts)
      .values(
        result.data.quoteProducts.map((qp) => ({
          ...qp,
          quoteId: params.data.id,
        }))
      )
      .returning({
        id: tables.quoteProducts.id,
        productId: tables.quoteProducts.productId,
        quantity: tables.quoteProducts.quantity,
      });

    for (const qp of insertedQuoteProducts) {
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

  if (result.data.quoteServices) {
    await useDrizzle()
      .delete(tables.quoteServices)
      .where(eq(tables.quoteServices.quoteId, params.data.id));

    await useDrizzle()
      .insert(tables.quoteServices)
      .values(
        result.data.quoteServices.map((qs) => ({
          ...qs,
          quoteId: params.data.id,
        }))
      );
  }

  return 'The quote has been succesfully updated!';
});
