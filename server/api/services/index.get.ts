export default eventHandler(async (event) => {
  const {role} = await getUserSession(event);

  if (role === 'admin') {
    const selected = await useDrizzle()
      .select({
        serviceId: tables.services.serviceId,
        name: tables.services.name,
        details: tables.services.details,
        unitPrice: tables.services.unitPrice,
      })
      .from(tables.services);

    return selected;
  } else {
    const selected = await useDrizzle()
      .select({
        serviceId: tables.services.serviceId,
        name: tables.services.name,
        details: tables.services.details,
      })
      .from(tables.services);

    return formatItems(selected);
  }
});
