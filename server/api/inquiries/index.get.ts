export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const selected = await useDrizzle()
    .select({
      inquiryId: tables.inquiries.inquiryId,
      clientId: tables.inquiries.clientId,
      status: tables.inquiries.status,
      additionalInfo: tables.inquiries.additionalInfo,
      firstName: tables.clients.firstName,
      lastName: tables.clients.lastName,
      email: tables.clients.email,
      serviceId: tables.inquiryServices.serviceId,
      serviceQuantity: tables.inquiryServices.quantity,
      date: tables.inquiryServices.date,
      productId: tables.inquiryProducts.productId,
      productQuantity: tables.inquiryProducts.quantity,
      serviceName: tables.services.name,
      productName: tables.products.name,
    })
    .from(tables.inquiries)
    .leftJoin(
      tables.clients,
      eq(tables.inquiries.clientId, tables.clients.clientId)
    )
    .leftJoin(
      tables.inquiryServices,
      eq(tables.inquiries.inquiryId, tables.inquiryServices.inquiryId)
    )
    .leftJoin(
      tables.inquiryProducts,
      eq(tables.inquiries.inquiryId, tables.inquiryProducts.inquiryId)
    )
    .leftJoin(
      tables.services,
      eq(tables.inquiryServices.serviceId, tables.services.serviceId)
    )
    .leftJoin(
      tables.products,
      eq(tables.inquiryProducts.productId, tables.products.productId)
    );

  const byInquiryId = new Map();

  for (const row of selected) {
    if (!byInquiryId.has(row.inquiryId)) {
      byInquiryId.set(row.inquiryId, {
        inquiryId: row.inquiryId,
        clientId: row.clientId,
        status: row.status,
        additionalInfo: row.additionalInfo,
        client: {
          firstName: row.firstName,
          lastName: row.lastName,
          email: row.email,
        },
        inquiryService: [],
        inquiryProduct: [],
      });
    }

    const inquiry = byInquiryId.get(row.inquiryId);

    if (
      row.serviceId &&
      !inquiry.inquiryService.some((s: any) => s.serviceId === row.serviceId)
    ) {
      inquiry.inquiryService.push({
        serviceId: row.serviceId,
        serviceQuantity: row.serviceQuantity,
        date: row.date,
        serviceName: row.serviceName,
      });
    }

    if (
      row.productId &&
      !inquiry.inquiryProduct.some((p: any) => p.productId === row.productId)
    ) {
      inquiry.inquiryProduct.push({
        productId: row.productId,
        productQuantity: row.productQuantity,
        productName: row.productName,
      });
    }
  }

  const nestedSelected = Array.from(byInquiryId.values());

  return nestedSelected;
});
