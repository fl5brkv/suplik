export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const selected = await useDrizzle().query.orders.findMany({
    columns: {
      id: true,
      itemId: true,
      status: true,
      quantity: true,
      delivery: true,
    },
    with: {
      item: {
        columns: {
          name: true,
        },
      },
    },
  });

  return selected;
});
