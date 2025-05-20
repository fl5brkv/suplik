import {productInsertSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    productInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  const inserted = await useDrizzle()
    .insert(tables.products)
    .values(result.data)
    .returning()
    .get();

  if (!inserted)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error when inserting!',
    });

  return sendNoContent(event);
});
