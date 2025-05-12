import {demandInsertSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    demandInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  const insertedClient = await useDrizzle()
    .insert(tables.clients)
    .values(result.data.client)
    .returning({id: tables.clients.id})
    .get();

  const insertedDemand = await useDrizzle()
    .insert(tables.demands)
    .values({
      clientId: insertedClient.id,
      additionalInfo: result.data.additionalInfo,
    })
    .returning({id: tables.demands.id})
    .get();

  await useDrizzle()
    .insert(tables.demandItems)
    .values(
      result.data.demandItems.map((demandItem) => ({
        ...demandItem,
        demandId: insertedDemand.id,
      }))
    );

  return sendNoContent(event);
});
