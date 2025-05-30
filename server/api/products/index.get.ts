export default eventHandler(async (event) => {
  const {user} = await getUserSession(event);

  if (!user?.technician) {
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
      where: (products, {eq}) => eq(tables.products.isPublic, true),
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
