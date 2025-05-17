export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const selected = await useDrizzle().query.jobs.findMany({
    columns: {
      id: true,
      demandId: true,
      additionalInfo: true,
    },
    with: {
      jobItems: {
        columns: {
          id: true,
          status: true,
          quantity: true,
          additionalInfo: true,
        },
        with: {
          jobItemDetails: {
            columns: {
              date: true,
              additionalInfo: true,
            },
          },
        },
      },
    },
  });

  return selected;
});
