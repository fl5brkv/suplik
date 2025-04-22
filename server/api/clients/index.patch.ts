import {clientUpdateSchema} from '~~/server/database/schema/tables/clients';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    clientUpdateSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid.',
    });

  const updated = await useDrizzle()
    .update(tables.clients)
    .set(result.data)
    .where(eq(tables.clients.clientId, result.data.clientId));

  if (!updated)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error updating client!',
    });

  return 'The client has been succesfully updated!';
});
