export default eventHandler(async (event) => {
  // const { role } = await getUserSession(event);
  const role = 'admin';

  if (role === 'admin') {
    await requireAdminSession(event);

    const selected = await useDrizzle().query.services.findMany({
      columns: {
        id: true,
        categoryId: true,
        name: true,
        isPublic: true,
      },
      with: {
        category: {
          columns: {
            name: true,
          },
        },
      },
    });

    return selected;
  } else {
    const selected = await useDrizzle().query.services.findMany({
      columns: {
        id: true,
        categoryId: true,
        name: true,
        isPublic: true,
      },
    });

    return selected;
  }
});
