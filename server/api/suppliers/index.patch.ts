import {supplierUpdateSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    supplierUpdateSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid.',
    });

  const updated = await useDrizzle()
    .update(tables.suppliers)
    .set(result.data)
    .where(eq(tables.suppliers.id, result.data.id));

  if (!updated)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error updating supplier!',
    });

  return 'The supplier has been succesfully updated!';
});
