export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const selected = await useDrizzle().query.offers.findMany({
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
      offerServices: {
        columns: {
          serviceId: true,
          technicianId: true,
          quantity: true,
        },
        with: {
          technician: {
            columns: {
              firstName: true,
              lastName: true,
            },
          },
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
