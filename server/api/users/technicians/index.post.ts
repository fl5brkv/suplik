import {technicianInsertSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    technicianInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  const insertedUser = await useDrizzle()
    .insert(tables.users)
    .values({
      email: result.data.user.email,
      password: await hashPassword(result.data.user.password),
    })
    .onConflictDoNothing()
    .returning({id: tables.users.id})
    .get();

  if (!insertedUser)
    throw createError({
      statusCode: 409,
      statusMessage: 'The email is invalid or already taken',
    });

  const insertedTechnician = await useDrizzle()
    .insert(tables.technicians)
    .values({
      userId: insertedUser.id,
      firstName: result.data.firstName,
      lastName: result.data.lastName,
    })
    .returning({id: tables.technicians.id})
    .get();

  if (!insertedTechnician)
    throw createError({
      statusCode: 409,
      statusMessage: 'The technician could not be inserted!',
    });

  return sendNoContent(event);
});
