export default eventHandler(async (event) => {
  //   await requireAdminSession(event);

  //   const selected = await useDrizzle()
  //     .select({
  //       id: tables.demands.id,
  //       status: tables.demands.status,
  //       additionalInfo: tables.demands.additionalInfo,
  //       client: {
  //         firstName: tables.clients.firstName,
  //         lastName: tables.clients.lastName,
  //         email: tables.clients.email,
  //       },
  //       demandItemId: tables.demandItems.id,
  //       itemName: tables.items.name,
  //       quantity: tables.demandItems.quantity,
  //     })
  //     .from(tables.demands)
  //     .leftJoin(tables.clients, eq(tables.demands.clientId, tables.clients.id))
  //     .leftJoin(
  //       tables.demandItems,
  //       eq(tables.demands.id, tables.demandItems.demandId)
  //     )
  //     .leftJoin(tables.items, eq(tables.demandItems.itemId, tables.items.id));

  //   const grouped = new Map();

  //   for (const row of selected) {
  //     if (!grouped.has(row.id)) {
  //       grouped.set(row.id, {
  //         id: row.id,
  //         status: row.status,
  //         additionalInfo: row.additionalInfo,
  //         client: row.client,
  //         demandItems: [],
  //       });
  //     }

  //     if (row.demandItemId) {
  //       grouped.get(row.id).demandItems.push({
  //         id: row.demandItemId,
  //         name: row.itemName,
  //         quantity: row.quantity,
  //       });
  //     }
  //   }

  //   return Array.from(grouped.values());

  const selected = await useDrizzle().query.demands.findMany({
    columns: {
      id: true,
      status: true,
      additionalInfo: true,
    },
    with: {
      client: {
        columns: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      demandItems: {
        columns: {
          itemId: true,
          quantity: true,
        },
        with: {
          item: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return selected;
});
