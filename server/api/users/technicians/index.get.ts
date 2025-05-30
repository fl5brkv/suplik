export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const selected = await useDrizzle().query.technicians.findMany({
    columns: {
      id: true,
      firstName: true,
      lastName: true,
    },
    with: {
      user: {
        columns: {
          email: true,
        },
      },
    },
  });

  return selected;
});
