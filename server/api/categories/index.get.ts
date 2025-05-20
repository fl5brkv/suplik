export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const selected = await useDrizzle()
    .select({
      id: tables.categories.id,
      name: tables.categories.name,
    })
    .from(tables.categories);

  return selected;
});
