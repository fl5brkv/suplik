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

  const selected = await useDrizzle().query.offers.findFirst({
    where: (offers, {eq}) => eq(tables.offers.id, Number(id)),
    columns: {
      additionalInfo: true,
    },
    with: {
      offerServices: {
        columns: {
          quantity: true,
        },
        with: {
          service: {
            columns: {
              name: true,
            },
          },
          offerProducts: {
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
        },
      },
    },
  });

  return selected;
});
