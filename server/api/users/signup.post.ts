import {signupSchema} from '~~/server/database/schema/tables/users';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    signupSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400, 
      statusMessage: 'The provided data is invalid',
    });

  const {role} = await requireUserSession(event);

  // @ts-ignore
  if (role !== 'admin')
    throw createError({
      statusMessage: 'Only admins are allowed to perform this action',
      data: {message: 'Only admins are allowed to perform this action'},
    });

  const {email, password} = result.data;

  const inserted = await useDrizzle()
    .insert(tables.users)
    .values({
      email,
      password: await hashPassword(password),
    })
    .onConflictDoNothing()
    .returning({userId: tables.users.userId, email: tables.users.email})
    .get();

  if (!inserted)
    throw createError({
      statusCode: 409,
      statusMessage: 'The email is invalid or already taken',
    });

  return sendNoContent(event);
});
