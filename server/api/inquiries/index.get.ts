export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const selected = await useDrizzle()
    .select({
      id: tables.inquiries.id,
      clientId: tables.inquiries.clientId,
      status: tables.inquiries.status,
      additionalInfo: tables.inquiries.additionalInfo,
      client: {
        firstName: tables.clients.firstName,
        lastName: tables.clients.lastName,
        email: tables.clients.email,
      },
      inquiryService: {
        serviceId: tables.inquiryServices.inquiryId,
        quantity: tables.inquiryServices.quantity,
        date: tables.inquiryServices.date,
        name: tables.services.name,
      },
      inquiryProduct: {
        productId: tables.inquiryProducts.productId,
        quantity: tables.inquiryProducts.quantity,
        date: tables.inquiryProducts.date,
        name: tables.products.name,
      },
    })
    .from(tables.inquiries)
    .leftJoin(tables.clients, eq(tables.inquiries.clientId, tables.clients.id))
    .leftJoin(
      tables.inquiryServices,
      eq(tables.inquiries.id, tables.inquiryServices.inquiryId)
    )
    .leftJoin(
      tables.inquiryProducts,
      eq(tables.inquiries.id, tables.inquiryProducts.inquiryId)
    )
    .leftJoin(
      tables.services,
      eq(tables.inquiryServices.serviceId, tables.services.id)
    )
    .leftJoin(
      tables.products,
      eq(tables.inquiryProducts.productId, tables.products.id)
    );

  const inquiriesMap = new Map();

  for (const entry of selected) {
    if (!inquiriesMap.has(entry.id)) {
      inquiriesMap.set(entry.id, {
        id: entry.id,
        clientId: entry.clientId,
        status: entry.status,
        additionalInfo: entry.additionalInfo,
        client: entry.client,
        inquiryServices: [],
        inquiryProducts: [],
      });
    }

    const inquiry = inquiriesMap.get(entry.id);

    if (entry.inquiryService && entry.inquiryService.serviceId !== null) {
      inquiry.inquiryServices.push(entry.inquiryService);
    }

    if (entry.inquiryProduct && entry.inquiryProduct.productId !== null) {
      inquiry.inquiryProducts.push(entry.inquiryProduct);
    }
  }

  const result = Array.from(inquiriesMap.values());

  return result;
});
