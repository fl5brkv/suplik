import {digest} from 'ohash';
import {z} from 'zod';
import {quoteResponseUpdateSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    quoteResponseUpdateSchema.safeParse(body)
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
      statusMessage: 'Invalid or expired verification response.',
    });

  // const selected = await useDrizzle()
  //   .select({
  //     id: tables.quotes.id,
  //     demandId: tables.quotes.demandId,
  //     version: tables.quotes.version,
  //     additionalInfo: tables.quotes.additionalInfo,
  //     quoteItems: {
  //       itemId: tables.quoteItems.itemId,
  //       quantity: tables.quoteItems.quantity,
  //     },
  //   })
  //   .from(tables.quotes)
  //   .leftJoin(
  //     tables.quoteItems,
  //     eq(tables.quotes.id, tables.quoteItems.quoteId)
  //   )
  //   .where(eq(tables.quotes.id, Number(id)))
  //   .get();

  const selected = await useDrizzle().query.quotes.findFirst({
    where: (quotes, {eq}) => eq(quotes.id, Number(id)),
    columns: {
      id: true,
      demandId: true,
      status: true,
      version: true,
      additionalInfo: true,
    },
    with: {
      quoteItems: {
        columns: {
          itemId: true,
          quantity: true,
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

  if (token !== digest(`${selected.id}:${config.salt}`))
    throw createError({
      statusCode: 400,
      statusMessage: 'The token is invalid!',
    });

  const insertedQuote = await useDrizzle()
    .insert(tables.quotes)
    .values({
      demandId: selected.demandId,
      status: result.data.status,
      version: selected.version + 1,
      additionalInfo: result.data.additionalInfo,
    })
    .returning({
      id: tables.quotes.id,
      demandId: tables.quotes.demandId,
      version: tables.quotes.version,
      additionalInfo: tables.quotes.additionalInfo,
    })
    .get();

  if (!insertedQuote)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error inserting quote!',
    });

  const insertedQuoteItems = await useDrizzle()
    .insert(tables.quoteItems)
    .values(
      selected.quoteItems.map((quoteItem) => ({
        ...quoteItem,
        quoteId: insertedQuote.id,
      }))
    )
    .returning({
      id: tables.quoteItems.id,
      itemId: tables.quoteItems.itemId,
      quantity: tables.quoteItems.quantity,
    })
    .all();

  if (!insertedQuoteItems)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error inserting quote items!',
    });

  return sendNoContent(event);
});
