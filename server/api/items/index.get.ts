// export default eventHandler(async (event) => {
//   const {role} = await getUserSession(event);

//   if (role === 'admin') {
//     const selected = await useDrizzle()
//       .select({
//         id: tables.items.id,
//         name: tables.items.name,
//         group: tables.items.group,
//         unitPrice: tables.items.unitPrice,
//       })
//       .from(tables.items);

//     return selected;
//   } else {
//     const selected = await useDrizzle()
//       .select({
//         id: tables.items.id,
//         name: tables.items.name,
//         group: tables.items.group,
//       })
//       .from(tables.items);

//     return formatItems(selected);
//   }
// });

export default eventHandler(async (event) => {
    const {role} = await getUserSession(event);
  
    if (role === 'admin') {
      const selected = await useDrizzle()
        .select({
          id: tables.items.id,
          name: tables.items.name,
          // group: tables.items.group,
          // unitPrice: tables.items.unitPrice,
        })
        .from(tables.items);
  
      return selected;
    } else {
      const selected = await useDrizzle()
        .select({
          id: tables.items.id,
          name: tables.items.name,
          // group: tables.items.group,
        })
        .from(tables.items);
  
      return selected
    }
  });
  