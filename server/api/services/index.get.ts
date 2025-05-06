export default eventHandler(async (event) => {
  const {role} = await getUserSession(event);

  if (role === 'admin') {
    const selected = await useDrizzle()
      .select({
        id: tables.services.id,
        name: tables.services.name,
        group: tables.services.group,
        unitPrice: tables.services.unitPrice,
      })
      .from(tables.services);

    return selected;
  } else {
    const selected = await useDrizzle()
      .select({
        id: tables.services.id,
        name: tables.services.name,
        group: tables.services.group,
      })
      .from(tables.services);

    return formatItems(selected);
  }
});
