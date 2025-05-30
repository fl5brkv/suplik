export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const selected = await useDrizzle().query.demands.findMany({
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
      demandProducts: {
        columns: {productId: true, quantity: true},
        with: {
          product: {
            columns: {
              name: true,
            },
          },
        },
      },
      demandServices: {
        columns: {serviceId: true, quantity: true},
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
