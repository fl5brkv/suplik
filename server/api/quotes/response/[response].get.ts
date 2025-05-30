import {z} from 'zod';

export default eventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (params) =>
    z
      .object({
        response: z.string().min(1),
      })
      .safeParse(params)
  );

  if (!params.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided param is invalid',
    });

  const decodedResponse = atob(decodeURIComponent(params.data.response));

  const [id] = decodedResponse.split(':');

  const selected = await useDrizzle().query.quotes.findFirst({
    where: (quotes, {eq}) => eq(tables.quotes.id, Number(id)),
    columns: {
      additionalInfo: true,
    },
    with: {
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
  });

  return selected;
});
