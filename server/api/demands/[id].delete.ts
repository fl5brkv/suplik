import z from 'zod';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const params = await getValidatedRouterParams(event, (params) =>
    z
      .object({
        id: z.coerce.number().int().positive(),
      })
      .safeParse(params)
  );

  if (!params.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided param is invalid',
    });

  const deleted = await useDrizzle()
    .delete(tables.demands)
    .where(eq(tables.demands.id, params.data.id));

  if (!deleted)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error deleting demand!',
    });

  return 'The demand has been succesfully deleted!';
});
