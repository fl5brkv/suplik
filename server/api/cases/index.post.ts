import {caseInsertSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    caseInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid.',
    });

  const inserted = await useDrizzle()
    .insert(tables.cases)
    .values({
      clientId: result.data.clientId,
      code: nanoid(),
    })
    .returning({
        id: tables.cases.id
    })
    .get();

  if (!inserted)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error inserting client!',
    });

  return inserted.id
});
