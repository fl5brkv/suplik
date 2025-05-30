import z from 'zod';
import {productUpdateSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    productUpdateSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

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

  const updated = await useDrizzle()
    .update(tables.products)
    .set(result.data)
    .where(eq(tables.products.id, params.data.id))
    .returning()

  if (!updated)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error when updating!',
    });

  return sendNoContent(event);
});
