export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const selected = await useDrizzle().query.offers.findMany({
    columns: {
      id: true,
      demandId: true,
      status: true,
      version: true,
      additionalInfo: true,
    },
    with: {
      offerServices: {
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
          offerProducts: {
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
        },
      },
    },
  });

  return selected;
});
