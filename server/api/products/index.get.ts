export default eventHandler(async (event) => {
  const {role} = await getUserSession(event);

  if (role === 'admin') {
    const selected = await useDrizzle()
      .select({
        productId: tables.products.productId,
        name: tables.products.name,
        details: tables.products.details,
        unitPrice: tables.products.unitPrice,
      })
      .from(tables.products);

    return selected;
  } else {
    const selected = await useDrizzle()
      .select({
        productId: tables.products.productId,
        name: tables.products.name,
        details: tables.products.details,
      })
      .from(tables.products);

    return formatItems(selected);
  }
});
