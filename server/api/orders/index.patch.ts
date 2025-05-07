import {render} from '@vue-email/render';
import {orderUpdateSchema} from '~~/server/database/schema';
import MyEmailQuotation from '~~/app/components/email/Quotation.vue';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    orderUpdateSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  const updated = await useDrizzle()
    .update(tables.orders)
    .set({
      type: result.data.type,
      status: result.data.status,
      internalNote: result.data.internalNote,
      externalNote: result.data.externalNote,
    })
    .returning({id: tables.orders.id})
    .get();

  await useDrizzle()
    .delete(tables.orderItems)
    .where(eq(tables.orderItems.orderId, result.data.id));

  await useDrizzle()
    .insert(tables.orderItems)
    .values(
      result.data.orderItems.map((orderItem) => ({
        ...orderItem,
        orderId: updated.id,
      }))
    );

  const html = await render(
    MyEmailQuotation,
    {
      id: updated.id,
      internalNote: result.data.internalNote,
      client: result.data.client,
      orderItems: result.data.orderItems,
    },
    {
      pretty: true,
    }
  );

  const {sendMail} = useNodeMailer();

  await sendMail({
    to: result.data.client.email,
    subject: `Order #${updated.id} quotation`,
    html,
  });

  return sendNoContent(event);
});
