import {quoteInsertSchema} from '~~/server/database/schema';
import {render} from '@vue-email/render';
import MyEmailQuote from '~~/app/components/email/Quote.vue';
import {digest} from 'ohash';

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
      additionalInfo: result.data.additionalInfo,
    })
    .returning({
      id: tables.quotes.id,
      demandId: tables.quotes.demandId,
      version: tables.quotes.version,
      additionalInfo: tables.quotes.additionalInfo,
    })
    .get();

  let insertedQuoteProducts = [];
  let selectedQuoteProducts = [];
  let insertedQuoteServices = [];
  let selectedQuoteServices = [];

  if (result.data.quoteProducts) {
    insertedQuoteProducts = await useDrizzle()
      .insert(tables.quoteProducts)
      .values(
        result.data.quoteProducts.map((quoteProduct) => ({
          ...quoteProduct,
          quoteId: insertedQuote.id,
        }))
      )
      .returning({
        id: tables.quoteProducts.id,
        productId: tables.quoteProducts.productId,
        quantity: tables.quoteProducts.quantity,
      })
      .all();

    for (const quoteProduct of insertedQuoteProducts) {
      await useDrizzle()
        .update(tables.products)
        .set({reserved: quoteProduct.quantity})
        .where(
          and(
            eq(tables.products.id, quoteProduct.id),
            gt(tables.products.stock, quoteProduct.quantity)
          )
        );
    }

    selectedQuoteProducts = await useDrizzle().query.quoteProducts.findMany({
      where: (quoteProducts, {inArray}) =>
        inArray(
          quoteProducts.id,
          insertedQuoteProducts.map((row) => row.id)
        ),
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
    });
  }

  if (result.data.quoteServices) {
    insertedQuoteServices = await useDrizzle()
      .insert(tables.quoteServices)
      .values(
        result.data.quoteServices.map((quoteProduct) => ({
          ...quoteProduct,
          quoteId: insertedQuote.id,
        }))
      )
      .returning({
        id: tables.quoteServices.id,
        serviceId: tables.quoteServices.serviceId,
        quantity: tables.quoteServices.quantity,
      })
      .all();

    selectedQuoteServices = await useDrizzle().query.quoteServices.findMany({
      where: (quoteServices, {inArray}) =>
        inArray(
          quoteServices.id,
          insertedQuoteServices.map((row) => row.id)
        ),
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
    });
  }

  const config = useRuntimeConfig(event);

  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

  const token = digest(`${insertedQuote.id}:${config.salt}`);

  const html = await render(
    MyEmailQuote,
    {
      additionalInfo: insertedQuote.additionalInfo,
      client: result.data.client,
      quoteProducts: selectedQuoteProducts, 
      quoteServices: selectedQuoteServices, 
      response: `${config.public.baseURL}/quotes/${encodeURIComponent(
        btoa(`${insertedQuote.id}:${token}:${expiresAt}`)
      )}`,
    },
    {
      pretty: true,
    }
  );

  const {sendMail} = useNodeMailer();

  await sendMail({
    to: result.data.client.email,
    subject: 'New quote',
    html,
  });

  return sendNoContent(event);
});
