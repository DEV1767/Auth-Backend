// import mailgen from "mailgen"
// import nodemailer from "nodemailer"

// const sendEmail = async (option) => {
//     const mailGenerator = new mailgen({
//         theme: "default",
//         product: {
//             name: "Task Manager",
//             link: "https://taskmanagerlink.com"
//         }
//     })

//     const emailTextual = mailGenerator.generatePlaintext(option.mailgenContent)
//     const emailHtml = mailGenerator.generate(option.mailgenContent)

//     const transporter = nodemailer.createTransport({
//         host: process.env.MAILTRAP_SMPT_HOST,
//         port: process.env.MAILTRAP_SMPT_PORT,
//         auth: {
//             user: process.env.MAILTRAP_SMPT_USER,
//             pass: process.env.MAILTRAP_SMPT_PASS
//         }
//     })

//     const mail = {
//         from: "mail.taskmanager@example.com",
//         to: option.email,
//         subject: option.subject,
//         text: emailTextual,
//         html: emailHtml,
//     }

//     try {
//         await transporter.sendMail(mail)
//     } catch (error) {
//         console.error("Email Services Failed.")
//         console.log(error)
//     }
// }

// const emailVerificationmailgenContent = (username, verificationUrl) => {
//     return {
//         body: {
//             name: username,
//             intro: "Welcome to Our App! we are excited to have you on board.",
//             action: {
//                 instruction: "To verify your email please click on the following button",
//                 button: {
//                     color: "#22bc66",
//                     text: "Verify your email",
//                     link: verificationUrl
//                 },
//             },
//             outro: "Need help? Just reply to this email, we'd love to help.",
//         },
//     };
// };

// const forgotPasswordmailgenContent = (username, passwordResetUrl) => {
//     return {
//         body: {
//             name: username,
//             intro: "We got a request to reset the password of your account.",
//             action: {
//                 instruction: "To reset your password click on the button below",
//                 button: {
//                     color: "#22bc66",
//                     text: "Reset Password",
//                     link: passwordResetUrl,
//                 },
//             },
//             outro: "Need help? Just reply to this email, we'd love to help.",
//         },
//     };
// };

// export {
//     emailVerificationmailgenContent, 
//     forgotPasswordmailgenContent, 
//     sendEmail
// }
