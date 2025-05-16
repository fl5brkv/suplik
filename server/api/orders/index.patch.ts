import {orderUpdateSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    orderUpdateSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  const updated = await useDrizzle()
    .update(tables.orders)
    .set(result.data)
    .where(eq(tables.orders.id, result.data.id))
    .returning({
      itemId: tables.orders.itemId,
      status: tables.orders.status,
      quantity: tables.orders.quantity,
    })
    .get();

  if (!updated)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error updating order!',
    });

  if (updated.status == 'delivered')
    await useDrizzle()
      .update(tables.productDetails)
      .set({stock: sql`${tables.productDetails.stock} + ${updated.quantity}`})
      .where(eq(tables.productDetails.itemId, updated.itemId));

  return sendNoContent(event);
});
