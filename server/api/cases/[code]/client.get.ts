import z from 'zod';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const params = await getValidatedRouterParams(event, (params) =>
    z
      .object({
        code: z.string().length(8),
      })
      .safeParse(params)
  );

  if (!params.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided ID is invalid!',
    });

  const selected = await useDrizzle().query.cases.findFirst({
    columns: {
      id: true,
    },
    with: {
      client: {
        columns: {
          firstName: true,
          lastName: true,
          email: true,
          company: true,
        },
      },
    },
    where: (cases, {eq}) => eq(tables.cases.code, params.data.code),
  });

  if (!selected)
    throw createError({
      statusCode: 400,
      statusMessage: 'The case with provided ID doesnt exist!',
    });

  return selected;
});
