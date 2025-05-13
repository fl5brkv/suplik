import {z} from 'zod';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const query = await getValidatedQuery(event, (query) =>
    z
      .object({
        type: z.enum(['product', 'service']),
      })
      .safeParse(query)
  );

  if (!query.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided query is invalid',
    });

  const selected = await useDrizzle()
    .select({
      id: tables.categories.id,
      name: tables.categories.name,
    })
    .from(tables.categories)
    .where(eq(tables.categories.type, query.data.type));

  return selected;
});
