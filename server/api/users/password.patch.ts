import {passwordSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    passwordSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusMessage: 'The provided data is invalid',
      data: {message: 'The provided data is invalid'},
    });

  const {user} = await requireUserSession(event);

  const selected = await useDrizzle()
    .select({
      password: tables.users.password,
    })
    .from(tables.users)
    .where(eq(tables.users.id, user.id))
    .get();

  if (
    !selected ||
    !(await verifyPassword(selected.password, result.data.password))
  )
    throw createError({
      statusCode: 400,
      statusMessage: 'Incorrect password',
    });

  const updated = await useDrizzle()
    .update(tables.users)
    .set({
      password: await hashPassword(result.data.newPassword),
    })
    .where(eq(tables.users.email, user.email))
    .returning();

  if (!updated)
    throw createError({
      statusCode: 400,
      statusMessage: 'The password could not be updated',
    });

  return sendNoContent(event);
});
