import {quoteInsertSchema} from '~~/server/database/schema';
import {render} from '@vue-email/render';
import MyEmailQuotation from '~~/app/components/email/Quotation.vue';
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
    .returning({
      id: tables.quoteItems.id,
      itemId: tables.quoteItems.itemId,
      quantity: tables.quoteItems.quantity,
    })
    .all();

  for (const quoteItem of insertedQuoteItems) {
    await useDrizzle()
      .update(tables.productDetails)
      .set({reserved: quoteItem.quantity})
      .where(
        and(
          eq(tables.productDetails.itemId, quoteItem.id),
          gt(tables.productDetails.stock, quoteItem.quantity)
        )
      );
  }

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
