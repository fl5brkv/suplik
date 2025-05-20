export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const selected = await useDrizzle().query.orders.findMany({
    columns: {
      id: true,
      productId: true,
      status: true,
      quantity: true,
      delivery: true,
    },
    with: {
      product: {
        columns: {
          name: true,
        },
      },
    },
  });

  return selected;
});
