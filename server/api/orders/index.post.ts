// import {orderInsertSchema} from '~~/server/database/schema';

// export default eventHandler(async (event) => {
//   const result = await readValidatedBody(event, (body) =>
//     orderInsertSchema.safeParse(body)
//   );

//   if (!result.success)
//     throw createError({
//       statusCode: 400,
//       statusMessage: 'The provided data is invalid',
//     });

//   const insertedClient = await useDrizzle()
//     .insert(tables.clients)
//     .values(result.data.client)
//     .returning({id: tables.clients.id})
//     .get();

//   const insertedOrder = await useDrizzle()
//     .insert(tables.orders)
//     .values({
//       clientId: insertedClient.id,
//       externalNote: result.data.externalNote,
//     })
//     .returning({id: tables.orders.id})
//     .get();

//   await useDrizzle()
//     .insert(tables.orderItems)
//     .values(
//       result.data.orderItems.map((orderItem) => ({
//         ...orderItem,
//         orderId: insertedOrder.id, 
//       }))
//     );

//   return sendNoContent(event);
// });
