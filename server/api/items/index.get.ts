import {z} from 'zod';

export default eventHandler(async (event) => {
  // const {role} = await getUserSession(event);

  const role = 'admin';

  if (role === 'admin') {
    const query = await getValidatedQuery(event, (query) =>
      z
        .object({
          type: z.enum(['product', 'service']),
        })
        .safeParse(query)
    );

    if (!query.success)
      throw createError({
        statusCode: 400,
        statusMessage: 'The provided query is invalid',
      });

    // const selected = await useDrizzle()
    //   .select({
    //     id: tables.items.id,
    //     categoryId: tables.items.categoryId,
    //     name: tables.items.name,
    //     isPublic: tables.items.isPublic,
    //     category: {
    //       name: tables.categories.name,
    //     },
    //     productDetail: {
    //       stock: tables.productDetails.stock,
    //       reserved: tables.productDetails.reserved,
    //     },
    //   })
    //   .from(tables.items)
    //   .leftJoin(
    //     tables.categories,
    //     eq(tables.items.categoryId, tables.categories.id)
    //   )
    //   .leftJoin(
    //     tables.productDetails,
    //     eq(tables.items.id, tables.productDetails.itemId)
    //   )

    //   .where(eq(tables.items.type, query.data.type));

    // return selected;

    const selected = await useDrizzle().query.items.findMany({
      columns: {
        id: true,
        categoryId: true,
        name: true,
        isPublic: true,
      },
      with: {
        category: {
          columns: {
            name: true,
          },
        },
        productDetail: {
          columns: {
            supplierId: true,
            stock: true,
            reserved: true,
          },
          with: {
            supplier: {
              columns: {
                name: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
      },
      where: (items, {eq}) => eq(tables.items.type, query.data.type),
    });

    return selected;
  } else {
    const selected = await useDrizzle().query.items.findMany({
      columns: {
        id: true,
        name: true,
      },
      with: {
        productDetail: {
          columns: {
            stock: true,
            reserved: true,
          },
        },
      },
    });

    return selected;
  }
});
