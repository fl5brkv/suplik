import {productDeleteSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    productDeleteSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid.',
    });

  const deleted = await useDrizzle()
    .delete(tables.products)
    .where(eq(tables.products.id, result.data.id));

  if (!deleted)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error when deleting!',
    });

  return sendNoContent(event);
});
