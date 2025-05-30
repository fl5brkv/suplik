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

  const insertedCase = await useDrizzle()
    .insert(tables.cases)
    .values({
      clientId: insertedClient.id,
      code: nanoid(),
    })
    .returning({
      id: tables.cases.id,
    })
    .get();

  const insertedDemand = await useDrizzle()
    .insert(tables.demands)
    .values({
      caseId: insertedCase.id,
      additionalInfo: result.data.additionalInfo,
    })
    .returning({id: tables.demands.id})
    .get();

  if (result.data.demandProducts)
    await useDrizzle()
      .insert(tables.demandProducts)
      .values(
        result.data.demandProducts.map((demandProduct) => ({
          ...demandProduct,
          demandId: insertedDemand.id,
        }))
      );

  if (result.data.demandServices)
    await useDrizzle()
      .insert(tables.demandServices)
      .values(
        result.data.demandServices.map((demandService) => ({
          ...demandService,
          demandId: insertedDemand.id,
        }))
      );

  return sendNoContent(event);
});
