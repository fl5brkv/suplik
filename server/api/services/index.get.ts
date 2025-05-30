export default eventHandler(async (event) => {
  const {user} = await getUserSession(event);

  if (!user?.technician) {
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
      where: (services, {eq}) => eq(tables.services.isPublic, true),
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
