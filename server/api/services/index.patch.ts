import {serviceUpdateSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    serviceUpdateSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  const updated = await useDrizzle()
    .update(tables.services)
    .set({
      categoryId: result.data.categoryId,
      name: result.data.name,
      isPublic: result.data.isPublic,
    })
    .where(eq(tables.services.id, result.data.id))
    .returning()
    .get();

  if (!updated)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error when updating!',
    });

  return sendNoContent(event);
});
