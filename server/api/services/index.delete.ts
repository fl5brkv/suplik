import {serviceDeleteSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    serviceDeleteSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid.',
    });

  const deleted = await useDrizzle()
    .delete(tables.services)
    .where(eq(tables.services.id, result.data.id));

  if (!deleted)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error when deleting!',
    });

  return sendNoContent(event);
});
