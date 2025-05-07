// import {EmailOptions} from 'worker-mailer';

// const getMailer = async (options: EmailOptions) => {
//   if (import.meta.dev) {
//     const {sendMail} = useNodeMailer();

//     return {
//       send: (options: EmailOptions) =>
//         sendMail({
//           from: options.from,
//           to: options.to,
//           subject: options.subject,
//           text: options.text,
//           html: options.html,
//         }),
//     };
//   } else {
//     const {WorkerMailer} = await import('worker-mailer');

//     const mailer = await WorkerMailer.connect({
//       credentials: {
//         username: 'bob@acme.com',
//         password: 'password',
//       },
//       authType: 'plain',
//       host: 'smtp.acme.com',
//       port: 587,
//       secure: true,
//     });

//     return {
//       send: (options: EmailOptions) =>
//         mailer.send({
//           from: options.from,
//           to: options.to,
//           subject: options.subject,
//           text: options.text,
//           html: options.html,
//         }),
//     };
//   }
// };

// export default getMailer;

// const { sendMail } = useNodeMailer()

//   return sendMail({ subject: 'Nuxt + nodemailer', text: 'Hello from nuxt-nodemailer!', to: 'john@doe.com' })
