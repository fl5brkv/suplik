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

  const {client, additionalInfo, inquiryServices, inquiryProducts} =
    result.data;

  try {
    const selected = await useDrizzle()
      .select({id: tables.clients.id})
      .from(tables.clients)
      .where(
        and(
          eq(tables.clients.email, client.email),
          eq(tables.clients.phoneNumber, client.phoneNumber)
        )
      )
      .get();

    const clientId =
      selected?.id ??
      (
        await useDrizzle()
          .insert(tables.clients)
          .values(client)
          .returning({id: tables.clients.id})
          .get()
      )?.id;

    const inserted = await useDrizzle()
      .insert(tables.inquiries)
      .values({additionalInfo, clientId})
      .returning({id: tables.inquiries.id})
      .get();

    if (inquiryServices?.length) {
      await useDrizzle()
        .insert(tables.inquiryServices)
        .values(
          inquiryServices.map((s) => ({
            ...s,
            inquiryId: inserted.id,
          }))
        );
    }

    if (inquiryProducts?.length) {
      await useDrizzle()
            .insert(tables.inquiryProducts)
            .values(
              inquiryProducts.map((p) => ({
                ...p,
                inquiryId: inserted.id,
              }))
            )
    }

    // doesnt work
    // await useDrizzle().batch([
    //   inquiryServices?.length
    //     ? await useDrizzle()
    //         .insert(tables.inquiryServices)
    //         .values(
    //           inquiryServices.map((s) => ({
    //             ...s,
    //             inquiryId: inserted.id,
    //           }))
    //         )
    //     : null,

    //   inquiryProducts?.length
    //     ? await useDrizzle()
    //         .insert(tables.inquiryProducts)
    //         .values(
    //           inquiryProducts.map((p) => ({
    //             ...p,
    //             inquiryId: inserted.id,
    //           }))
    //         )
    //     : null,
    // ]);

    return sendNoContent(event);
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong while saving the inquiry.',
    });
  }
});
