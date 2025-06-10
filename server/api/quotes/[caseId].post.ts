import {quoteInsertSchema} from '~~/server/database/schema';
import {render} from '@vue-email/render';
import MyEmailQuote from '~~/app/components/email/Quote.vue';
import {digest} from 'ohash';
import {z} from 'zod';
import {WorkerMailer} from 'worker-mailer';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    quoteInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  const params = await getValidatedRouterParams(event, (params) =>
    z
      .object({
        caseId: z.coerce.number().int().positive(),
      })
      .safeParse(params)
  );

  if (!params.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided param is invalid',
    });

  const insertedQuote = await useDrizzle()
    .insert(tables.quotes)
    .values({
      caseId: params.data.caseId,
      additionalInfo: result.data.additionalInfo,
    })
    .returning({
      id: tables.quotes.id,
      caseId: tables.quotes.caseId,
      additionalInfo: tables.quotes.additionalInfo,
    })
    .get();

  if (result.data.quoteProducts) {
    const insertedQuoteProducts = await useDrizzle()
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
      });

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
  }

  if (result.data.quoteServices) {
    await useDrizzle()
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
      .get();
  }

  const selected = await useDrizzle().query.quotes.findFirst({
    columns: {
      additionalInfo: true,
    },
    with: {
      case: {
        columns: {
          code: true,
        },
        with: {
          client: {
            columns: {
              email: true,
            },
          },
        },
      },
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
    where: (quotes, {eq}) => eq(tables.quotes.id, insertedQuote.id),
  });

  if (!selected)
    throw createError({
      statusCode: 400,
      statusMessage: 'No quote selected!',
    });

  const config = useRuntimeConfig(event);

  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

  const token = digest(
    `${insertedQuote.id}:${insertedQuote.additionalInfo}:${config.salt}`
  );

  // const html = await render(
  //   MyEmailQuote,
  //   {
  //     quote: selected,
  //     response: `${config.public.baseURL}/quotes/${encodeURIComponent(
  //       btoa(`${insertedQuote.id}:${token}:${expiresAt}`)
  //     )}`,
  //   },
  //   {
  //     pretty: true,
  //   }
  // );

    const html = await render(
    MyEmailQuote,
    {
      quote: selected,
      response: `https://suplik.nuxt.dev/quotes/${encodeURIComponent(
        btoa(`${insertedQuote.id}:${token}:${expiresAt}`)
      )}`,
    },
    {
      pretty: true,
    }
  );

  // const {sendMail} = useNodeMailer();

  // await sendMail({
  //   to: selected.case.client.email,
  //   subject: 'New quote',
  //   html,
  // });

  const mailer = await WorkerMailer.connect({
    credentials: {
      username: config.mailerUsername,
      password: config.mailerPassword,
    },
    host: 'smtp.eu.mailgun.org',
    port: 587,
    secure: false,
    authType: 'plain',
  });

  await mailer.send({
    from: {email: 'info@fpvdemo.fun'},
    subject: 'New quote',
    to: selected.case.client.email,
    html,
  });

  return sendNoContent(event);
});
