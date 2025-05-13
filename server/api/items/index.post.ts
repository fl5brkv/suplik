import {z} from 'zod';
import {itemInsertSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    itemInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
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
    .insert(tables.items)
    .values({
      name: result.data.name,
      categoryId: result.data.categoryId,
      isPublic: result.data.isPublic,
      type: query.data.type,
    })
    .onConflictDoNothing()
    .returning()
    .get();

  if (!inserted)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error when inserting!',
    });

  if (query.data.type === 'product' && result.data.productDetail)
    await useDrizzle()
      .insert(tables.productDetails)
      .values({
        ...result.data.productDetail,
        itemId: inserted.id,
      });

  return sendNoContent(event);
});
