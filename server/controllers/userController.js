const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../db");
const { User } = require("../models/userModels");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
// const nodemailer = require("nodemailer");
const MailService = require("./mail/mailer.service");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async signup(req, res, next) {
    await Promise.all([
      body("surname").isString().isLength({ min: 3 }).run(req),
      body("name").isString().isLength({ min: 3 }).run(req),
      body("email").isEmail().normalizeEmail().run(req),
      body("password").isString().isLength({ min: 6 }).run(req),
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { surname, name, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Некорректный пароль или почта" });
    }

    const t = await sequelize.transaction();

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email уже зарегистрирован" });
      }

      const saltRounds = 12;
      const hashPassword = await bcrypt.hash(password, saltRounds);

      // Создаем токен для подтверждения email
      const emailToken = crypto.randomBytes(32).toString("hex");

      const user = await User.create(
        {
          surname,
          name,
          email,
          password: hashPassword,
          role,
          emailVerified: false,
          emailToken,
        },
        { transaction: t }
      );

      try {
        await MailService.sendTestMail(user.email, emailToken);
      } catch (mailError) {
        await t.rollback();
        console.error("Ошибка при отправке письма:", mailError);
        return res.status(500).json({ message: "Ошибка при отправке письма" });
      }

      await t.commit();

      return res.json({
        message: "Письмо с подтверждением отправлено на ваш email",
      });

      // const token = generateJwt(user.id, user.email, user.role);
      // return res.json({ message: "Письмо с подтверждением отправлено" , token});

      // return res.json({ token });
    } catch (e) {
      await t.rollback();
      console.error(e);
      return res.status(400).json({ message: "Ошибка при регистрации " });
    }
  }

  async verifyEmail(req, res) {
    const { token } = req.query;

    const user = await User.findOne({ where: { emailToken: token } });

    if (!user) {
      return res.status(400).json({ message: "Неверный токен" });
    }

    user.emailVerified = true;
    user.emailToken = null;
    await user.save();

    return res.status(200).json({ message: "Email успешно подтвержден!" });
  }

  async signin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        console.log("Пользователь не найден");
        return res.status(404).json({ message: "Пользователь не найден" });
      }
      console.log("Найденный пользователь:", user);
      if (!user.emailVerified) {
        return res.status(403).json({ message: "Подтвердите email для входа" });
      }
      if (!user.password) {
        return res.status(500).json({ message: "Ошибка: пароль отсутствует" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Неверный пароль" });
      }
      const token = generateJwt(user.id, user.email, user.role);
      return res.json({ token });
    } catch (e) {
      console.error("Ошибка авторизации: ", e);
      return res.status(400).json({ errors: e.message });
    }
  }

  async getUser(req, res) {
    const authHeader = req.headers.authorization;
    // Проверка наличия заголовка авторизации
    if (!authHeader) {
      return res.status(401).json({ message: "Нет токена авторизации" });
    }

    const tokenParts = authHeader.split(" ");
    const token = tokenParts[1];
    let decoded;

    decoded = jwt.verify(token, process.env.SECRET_KEY);

    try {
      const user = await User.findOne({ where: { id: decoded.id } });
      if (!user)
        return res.status(404).json({ message: "Пользователь не найден" });
      res.json({
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
}

module.exports = new UserController();
