import {productUpdateSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    productUpdateSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  const updated = await useDrizzle()
    .update(tables.products)
    .set({
      categoryId: result.data.categoryId,
      supplierId: result.data.supplierId,
      name: result.data.name,
      stock: result.data.stock,
      reserved: result.data.reserved,
      isPublic: result.data.isPublic,
    })
    .where(eq(tables.products.id, result.data.id))
    .returning()
    .get();

  if (!updated)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error when updating!',
    });

  return sendNoContent(event);
});
