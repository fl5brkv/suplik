export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const query = getQuery(event);

  if (query.type !== 'inquiry' && query.type !== 'quotation') {
    throw createError({statusCode: 400, message: 'Invalid type param'});
  }

  const selected = await useDrizzle()
    .select({
      id: tables.orders.id,
      type: tables.orders.type,
      status: tables.orders.status,
      internalNote: tables.orders.internalNote,
      externalNote: tables.orders.externalNote,
      client: {
        firstName: tables.clients.firstName,
        lastName: tables.clients.lastName,
        email: tables.clients.email,
      },
      orderItemId: tables.orderItems.id,
      itemName: tables.items.name,
      quantity: tables.orderItems.quantity,
    })
    .from(tables.orders)
    .where(eq(tables.orders.type, query.type))
    .leftJoin(tables.clients, eq(tables.orders.clientId, tables.clients.id))
    .leftJoin(
      tables.orderItems,
      eq(tables.orders.id, tables.orderItems.orderId)
    )
    .leftJoin(tables.items, eq(tables.orderItems.itemId, tables.items.id));

  const grouped = new Map();

  for (const row of selected) {
    if (!grouped.has(row.id)) {
      grouped.set(row.id, {
        id: row.id,
        type: row.type,
        status: row.status,
        internalNote: row.internalNote,
        externalNote: row.externalNote,
        client: row.client,
        orderItems: [],
      });
    }

    if (row.orderItemId) {
      grouped.get(row.id).orderItems.push({
        id: row.orderItemId,
        name: row.itemName,
        quantity: row.quantity,
      });
    }
  }

  return Array.from(grouped.values());
});
