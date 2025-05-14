import {supplierInsertSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    supplierInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid.',
    });

  const inserted = await useDrizzle()
    .insert(tables.suppliers)
    .values(result.data)
    .returning()
    .get();

  if (!inserted)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error inserting supplier!',
    });

  return sendNoContent(event);
});
