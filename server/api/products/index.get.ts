export default eventHandler(async (event) => {
  const {role} = await getUserSession(event);

  if (role === 'admin') {
    const selected = await useDrizzle()
      .select({
        id: tables.products.id,
        name: tables.products.name,
        group: tables.products.group,
        unitPrice: tables.products.unitPrice,
      })
      .from(tables.products);

    return selected;
  } else {
    const selected = await useDrizzle()
      .select({
        id: tables.products.id,
        name: tables.products.name,
        group: tables.products.group,
      })
      .from(tables.products);

    return formatItems(selected);
  }
});
