import {z} from 'zod';
import {categoryInsertSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    categoryInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid.',
    });

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

  const inserted = await useDrizzle()
    .insert(tables.categories)
    .values({...result.data, type: query.data.type})
    .returning()
    .get();

  if (!inserted)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error inserting category!',
    });

  return sendNoContent(event);
});
