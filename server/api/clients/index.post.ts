import {clientInsertSchema} from '~~/server/database/schema/tables/clients';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    clientInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid.',
    });

  const inserted = await useDrizzle()
    .insert(tables.clients)
    .values(result.data)
    .get();

  if (!inserted)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error inserting client!',
    });

  return 'The client has been succesfully inserted!';
});
