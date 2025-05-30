import {digest} from 'ohash';
import {z} from 'zod';
import {quoteResponseInsertSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    quoteResponseInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  const params = await getValidatedRouterParams(event, (params) =>
    z
      .object({
        response: z.string().min(1),
      })
      .parse(params)
  );

  const decodedResponse = atob(decodeURIComponent(params.response));

  const [id, token, expiresAt] = decodedResponse.split(':');

  if (Date.now() > Number(expiresAt))
    throw createError({
      statusMessage: 'Expired verification response.',
    });

  const selected = await useDrizzle().query.quotes.findFirst({
    where: (quotes, {eq}) => eq(quotes.id, Number(id)),
    columns: {
      additionalInfo: true,
    },
    with: {
      quoteProducts: {
        columns: {
          quantity: true,
        },
        with: {
          product: {
            columns: {
              name: true,
            },
          },
        },
      },
      quoteServices: {
        columns: {
          quantity: true,
        },
        with: {
          service: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!selected)
    throw createError({
      statusCode: 404,
      statusMessage: 'Quote not found for the provided ID',
    });

  const config = useRuntimeConfig(event);

  if (
    token !== digest(`${Number(id)}:${selected.additionalInfo}:${config.salt}`)
  )
    throw createError({
      statusCode: 400,
      statusMessage: 'The token is invalid!',
    });

  const updated = await useDrizzle()
    .update(tables.quotes)
    .set({
      status: result.data.status,
      additionalInfo: result.data.additionalInfo,
    })
    .where(eq(tables.quotes.id, Number(id)))
    .returning();

  if (!updated)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error updating quote!',
    });

  const inserted = await useDrizzle()
    .insert(tables.quoteAudits)
    .values({
      quoteId: Number(id),
      snapshot: JSON.stringify(selected),
    });

  if (!inserted)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error inserting quote audit!',
    });

  return sendNoContent(event);
});
