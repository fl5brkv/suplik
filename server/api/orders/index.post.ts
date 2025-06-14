import {orderInsertSchema} from '~~/server/database/schema';
import {render} from '@vue-email/render';
import MyEmailOrder from '~~/app/components/email/Order.vue';
import {digest} from 'ohash';
import {WorkerMailer} from 'worker-mailer';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    orderInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  const inserted = await useDrizzle()
    .insert(tables.orders)
    .values(result.data)
    .returning({
      id: tables.orders.id,
      productId: tables.orders.productId,
      quantity: tables.orders.quantity,
    })
    .get();

  const selected = await useDrizzle().query.products.findFirst({
    columns: {
      name: true,
    },
    with: {
      supplier: {
        columns: {
          email: true,
        },
      },
    },
    where: (products, {eq}) => eq(tables.products.id, inserted.productId),
  });

  if (!selected)
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    });

  const config = useRuntimeConfig(event);

  const token = digest(`${inserted.id}:${config.salt}`);

  // const html = await render(
  //   MyEmailOrder,
  //   {
  //     order: {
  //       quantity: inserted.quantity,
  //     },
  //     product: {
  //       name: selected.name,
  //     },
  //     response: `${config.public.baseURL}/orders/${encodeURIComponent(
  //       btoa(`${inserted.id}:${token}`)
  //     )}`,
  //   },
  //   {
  //     pretty: true,
  //   }
  // );

  const html = await render(
    MyEmailOrder,
    {
      order: {
        quantity: inserted.quantity,
      },
      product: {
        name: selected.name,
      },
      response: `https://suplik.nuxt.dev/orders/${encodeURIComponent(
        btoa(`${inserted.id}:${token}`)
      )}`,
    },
    {
      pretty: true,
    }
  );

  // const {sendMail} = useNodeMailer();

  // await sendMail({
  //   to: selected.supplier.email,
  //   subject: 'New order',
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
    subject: 'New order',
    to: selected.supplier.email,
    html,
  });

  return sendNoContent(event);
});
