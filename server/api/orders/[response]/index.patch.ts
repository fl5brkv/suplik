import {digest} from 'ohash';
import {z} from 'zod';
import {orderResponseUpdateSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    orderResponseUpdateSchema.safeParse(body)
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

  const [id, token] = decodedResponse.split(':');

  const selected = await useDrizzle().query.orders.findFirst({
    where: (orders, {eq}) => eq(tables.orders.id, Number(id)),
    columns: {
      id: true,
    },
    with: {
      product: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!selected)
    throw createError({
      statusCode: 404,
      statusMessage: 'Order not found for the provided ID',
    });

  const config = useRuntimeConfig(event);

  if (token !== digest(`${selected.id}:${config.salt}`))
    throw createError({
      statusCode: 400,
      statusMessage: 'The token is invalid!',
    });

  const updated = await useDrizzle()
    .update(tables.orders)
    .set({
      status: result.data.status,
      delivery: result.data.delivery,
    })
    .where(eq(tables.orders.id, Number(id)))
    .returning()
    .get();

  if (!updated)
    throw createError({
      statusCode: 400,
      statusMessage: 'There was an error updating order!',
    });

  return sendNoContent(event);
});
