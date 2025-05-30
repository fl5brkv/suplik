export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const selected = await useDrizzle().query.quotes.findMany({
    columns: {
      id: true,
      status: true,
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
              firstName: true,
              lastName: true,
              company: true,
            },
          },
        },
      },
      quoteProducts: {
        columns: {
          productId: true,
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
          serviceId: true,
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
    orderBy: (quotes, {desc}) => [desc(quotes.id)],
  });

  return selected;
});
