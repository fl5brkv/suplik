export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const selected = await useDrizzle().query.quotes.findMany({
    columns: {
      id: true,
      demandId: true,
      status: true,
      version: true,
      additionalInfo: true,
    },
    with: {
      quoteProducts: {
        columns: {
          productId: true,
          quantity: true,
        },
        with: {
          product: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
      quoteServices: {
        columns: {
          serviceId: true,
          quantity: true,
        },
        with: {
          service: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: (quotes, {desc}) => [desc(quotes.id)],
  });

  return selected;
});
