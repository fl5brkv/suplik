import {supplierDeleteSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    supplierDeleteSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid.',
    });

  const deleted = await useDrizzle()
    .delete(tables.suppliers)
    .where(eq(tables.suppliers.id, result.data.id));

  if (!deleted)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error deleting supplier!',
    });

  return sendNoContent(event);
});
