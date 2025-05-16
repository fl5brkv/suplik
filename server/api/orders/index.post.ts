import {orderInsertSchema} from '~~/server/database/schema';
import {render} from '@vue-email/render';
import MyEmailOrder from '~~/app/components/email/Order.vue';
import {digest} from 'ohash';

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
      itemId: tables.orders.itemId,
      quantity: tables.orders.quantity,
    })
    .get();

  const selected = await useDrizzle().query.items.findFirst({
    columns: {
      name: true,
    },
    with: {
      productDetail: {
        columns: {},
        with: {
          supplier: {
            columns: {
              email: true,
            },
          },
        },
      },
    },
    where: (items, {eq}) => eq(tables.items.id, inserted.itemId),
  });

  if (!selected)
    throw createError({
      statusCode: 404,
      statusMessage: 'Item not found',
    });

  const config = useRuntimeConfig(event);

  const token = digest(`${inserted.id}:${config.salt}`);

  const html = await render(
    MyEmailOrder,
    {
      order: {
        quantity: inserted.quantity,
      },
      item: {
        name: selected.name,
      },
      response: `${config.public.baseURL}/orders/${encodeURIComponent(
        btoa(`${inserted.id}:${token}`)
      )}`,
    },
    {
      pretty: true,
    }
  );

  const {sendMail} = useNodeMailer();

  await sendMail({
    to: selected.productDetail.supplier.email,
    subject: 'New order',
    html,
  });

  return sendNoContent(event);
});
