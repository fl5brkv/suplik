import {quoteInsertSchema} from '~~/server/database/schema';
import {render} from '@vue-email/render';
import MyEmailQuotation from '~~/app/components/email/Quotation.vue';
import {inArray} from 'drizzle-orm';
export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    quoteInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  await useDrizzle()
    .update(tables.demands)
    .set({
      status: 'quoted' as const,
    })
    .where(eq(tables.demands.id, result.data.demandId));

  const insertedQuote = await useDrizzle()
    .insert(tables.quotes)
    .values({
      demandId: result.data.demandId,
      expiresAt: result.data.expiresAt,
      additionalInfo: result.data.additionalInfo,
    })
    .returning({
      id: tables.quotes.id,
      demandId: tables.quotes.demandId,
      expiresAt: tables.quotes.expiresAt,
      additionalInfo: tables.quotes.additionalInfo,
    })
    .get();

  const insertedQuoteItems = await useDrizzle()
    .insert(tables.quoteItems)
    .values(
      result.data.quoteItems.map((quoteItem) => ({
        ...quoteItem,
        quoteId: insertedQuote.id,
      }))
    )
    .returning({id: tables.quoteItems.id})
    .all();

  const selected = await useDrizzle().query.quoteItems.findMany({
    where: (quoteItems, {inArray}) =>
      inArray(
        quoteItems.id,
        insertedQuoteItems.map((row) => row.id)
      ),
    columns: {
      quantity: true,
    },
    with: {
      item: {
        columns: {
          name: true,
        },
      },
    },
  });
  // const selected = useDrizzle()
  //   .select({
  //     id: tables.quoteItems.id,
  //     quantity: tables.quoteItems.quantity,
  //     itemName: items.name,
  //   })
  //   .from(quoteItems)
  //   .leftJoin(items, eq(quoteItems.itemId, items.id))
  //   .where(inArray(quoteItems.id, insertedQuoteItemIds))
  //   .all();
  // const selected = await useDrizzle()
  //   .select({
  //     id: tables.items.id,
  //     name: tables.items.name,
  //   })
  //   .from(tables.items)
  //   .where(
  //     inArray(
  //       tables.items.id,
  //       insertedQuoteItems.map((item) => item.itemId)
  //     )
  //   )
  //   .all();

  // const mergedQuoteItems = insertedQuoteItems.map((item) => {
  //   const matched = selected.find((s) => s.id === item.itemId);
  //   if (!matched)
  //     throw createError({statusCode: 500, statusMessage: 'Item not found'});
  //   return {
  //     ...item,
  //     name: matched.name,
  //   };
  // });

  const html = await render(
    MyEmailQuotation,
    {
      id: insertedQuote.id,
      expiresAt: insertedQuote.expiresAt,
      additionalInfo: insertedQuote.additionalInfo,
      client: result.data.client,
      quotationItems: selected,
    },
    {
      pretty: true,
    }
  );

  const {sendMail} = useNodeMailer();

  await sendMail({
    to: result.data.client.email,
    subject: `Order #${insertedQuote.id} quotation`,
    html,
  });

  return sendNoContent(event);
});
