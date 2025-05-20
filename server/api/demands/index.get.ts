export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const selected = await useDrizzle().query.demands.findMany({
    columns: {
      id: true,
      status: true,
      additionalInfo: true,
    },
    with: {
      client: {
        columns: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      demandProducts: {
        columns: {productId: true, quantity: true},
        with: {
          product: {
            columns: {
              name: true,
              stock: true,
              reserved: true,
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
