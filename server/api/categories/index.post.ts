import {categoryInsertSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    categoryInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid.',
    });

  const inserted = await useDrizzle()
    .insert(tables.categories)
    .values(result.data)
    .returning()
    .get();

  if (!inserted)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error inserting category!',
    });

  return sendNoContent(event);
});
