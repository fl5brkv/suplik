import {signupSchema} from '~~/server/database/schema/tables/users';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    signupSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusMessage: 'The provided data is invalid',
      data: {message: 'The provided data is invalid'},
    });

  // const {userId, role} = await requireUserSession(event);

  let role: 'admin' | 'technician' = 'admin';

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
      statusMessage: 'The email is invalid or already taken',
      data: {message: 'The email is invalid or already taken'},
    });

  return 'Please check your email to verify your account!';
});
