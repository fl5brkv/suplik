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

  const selected = await useDrizzle().query.users.findFirst({
    where: (users, {eq}) => eq(tables.users.id, params.data.id),
    columns: {
      email: true,
    },
    with: {
      technician: {
        columns: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return selected;
});
