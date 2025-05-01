const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport(
  {
    host: "smpt.mail.ru",
    port: "465",
    secure: true,
    auth: {
      user: "test_klyueva_04@mail.ru",
      pass: "edv18Z9jTH0v9YNtUqNG",
    },
  },
  {
    from: "Test App <test_klyueva_04@mail.ru>",
  }
);

sendTestMail = (email, emailToken) => {
  return new Promise((resolve, reject) => {
    transporter
      .sendMail({
        to: email,
        subject: "Подтвердите ваш email",
        text: `Привет, ${email}! Спасибо за регистрацию на нашем сайте.`,
        //   html: `<p>Для завершения регистрации перейдите по ссылке:
        //  <a href="http://localhost:8080/api/user/verify?token=${emailToken}">Подтвердить email</a></p>`,
        html: `<p>Для завершения регистрации перейдите по ссылке:
        <a href="http://localhost:3000/verify-email?token=${emailToken}">Подтвердить email</a></p>`,
      })
      .then(() => {
        console.info("✅Письмо успешно отправлено на адрес: ", email);
        resolve();
      })
      .catch((err) => {
        console.warn("❌Произошла ошибка при отправке сообщения: ", err);
        reject(err);
      });
  });
};

const MailService = {
  sendTestMail: sendTestMail,
};
module.exports = MailService;
