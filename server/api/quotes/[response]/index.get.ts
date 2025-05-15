import {z} from 'zod';

export default eventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (params) =>
    z.object({response: z.string().min(1)}).parse(params)
  );

  const decodedResponse = atob(decodeURIComponent(params.response));

  const [id] = decodedResponse.split(':');

  const selected = await useDrizzle().query.quotes.findMany({
    where: (quotes, {eq}) => eq(tables.quotes.id, Number(id)),
    columns: {
      additionalInfo: true,
    },
    with: {
      quoteItems: {
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
      },
    },
  });

  return selected[0];
});
