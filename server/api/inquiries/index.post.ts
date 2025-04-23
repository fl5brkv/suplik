import {inquiryInsertSchema} from '~~/server/database/schema/tables/inquiries';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    inquiryInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  const {client, additionalInfo, inquiryService, inquiryProduct} = result.data;

  try {
    const existingClient = await useDrizzle()
      .select({clientId: tables.clients.clientId})
      .from(tables.clients)
      .where(
        and(
          eq(tables.clients.email, client.email),
          eq(tables.clients.phoneNumber, client.phoneNumber)
        )
      )
      .limit(1);

    const clientId =
      existingClient[0]?.clientId ??
      (
        await useDrizzle()
          .insert(tables.clients)
          .values(client)
          .returning({clientId: tables.clients.clientId})
      )[0].clientId;

    const [insertedInquiry] = await useDrizzle()
      .insert(tables.inquiries)
      .values({additionalInfo, clientId})
      .returning({inquiryId: tables.inquiries.inquiryId});

    if (inquiryService?.length)
      await useDrizzle()
        .insert(tables.inquiryServices)
        .values(
          inquiryService.map((s) => ({
            ...s,
            inquiryId: insertedInquiry.inquiryId,
          }))
        );

    if (inquiryProduct?.length)
      await useDrizzle()
        .insert(tables.inquiryProducts)
        .values(
          inquiryProduct.map((p) => ({
            ...p,
            inquiryId: insertedInquiry.inquiryId,
          }))
        );

    return sendNoContent(event);
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong while saving the inquiry.',
    });
  }
});
