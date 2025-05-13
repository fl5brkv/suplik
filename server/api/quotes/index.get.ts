export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const selected = await useDrizzle().query.quotes.findMany({
    columns: {
      id: true,
      demandId: true,
      status: true,
      expiresAt: true,
      version: true,
      additionalInfo: true,
    },
    with: {
      quoteItems: {
        columns: {
          itemId: true,
          quantity: true,
        },
        with: {
          item: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return selected;
});
