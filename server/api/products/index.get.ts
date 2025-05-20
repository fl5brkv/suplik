export default eventHandler(async (event) => {
  // const { role } = await getUserSession(event);
  const role = 'admin';

  if (role === 'admin') {
    await requireAdminSession(event);

    const selected = await useDrizzle().query.products.findMany({
      columns: {
        id: true,
        categoryId: true,
        supplierId: true,
        name: true,
        stock: true,
        reserved: true,
        isPublic: true,
      },
      with: {
        category: {
          columns: {
            name: true,
          },
        },
        supplier: {
          columns: {
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    return selected;
  } else {
    const selected = await useDrizzle().query.products.findMany({
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
