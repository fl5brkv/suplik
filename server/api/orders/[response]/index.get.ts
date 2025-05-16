import {z} from 'zod';

export default eventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (params) =>
    z.object({response: z.string().min(1)}).parse(params)
  );

  const decodedResponse = atob(decodeURIComponent(params.response));

  const [id] = decodedResponse.split(':');

  const selected = await useDrizzle().query.orders.findFirst({
    where: (orders, {eq}) => eq(tables.orders.id, Number(id)),
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

  return selected;
});
