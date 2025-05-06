import {clientDeleteSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    clientDeleteSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid.',
    });

  const deleted = await useDrizzle()
    .delete(tables.clients)
    .where(eq(tables.clients.id, result.data.id));

  if (!deleted)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error deleting client!',
    });

  return 'The client has been succesfully deleted!';
});
