import {z} from 'zod';
import {itemUpdateSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    itemUpdateSchema.safeParse(body)
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

  const updated = await useDrizzle()
    .update(tables.items)
    .set({
      name: result.data.name,
      categoryId: result.data.categoryId,
      isPublic: result.data.isPublic,
      type: query.data.type,
    })
    .where(eq(tables.items.id, result.data.id))
    .returning()
    .get();

  if (!updated)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error when updating!',
    });

  if (query.data.type === 'product' && result.data.productDetail)
    await useDrizzle()
      .update(tables.productDetails)
      .set({
        ...result.data.productDetail,
      })
      .where(eq(tables.productDetails.itemId, updated.id));

  return sendNoContent(event);
});
