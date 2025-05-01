const { model } = require("../db");
const { Appeal, Response, User } = require("../models/userModels");
const jwt = require("jsonwebtoken");

// const ApiError = require('../error/ApiError');

class AppealController {
  // получение обращений пользователя
  async getUserAppeals(req, res) {
    const userId = req.user.id; //из middleware токена

    try {
      const appeals = await Appeal.findAll({
        where: { userId },
        include: [
          {
            model: Response,
            include: [{ model: User, attributes: ["id", "name", "surname"] }],
          },
        ],
      });
      // Проверка на наличие обращений
      if (appeals.length === 0) {
        return res.status(404).json({ message: "Обращения не найдены" });
      }
      return res.json(appeals);
    } catch (error) {
      // Обработка ошибок
      console.error("Ошибка при загрузке обращений: ", error);
      return res.status(500).json({ message: "Ошибка при загрузке обращений" });
    }
  }
  //создание обращения
  async createAppeal(req, res) {
    try {
      const { description } = req.body;
      if (!description) {
        return res.status(400).json({ message: "Поле не может быть пустым" });
      }

      // Получение токена из заголовка Authorization
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Токен не предоставлен" });
      }

      const appeal = await Appeal.create({
        userId: req.user.id,
        description,
      });
      return res.status(201).json(appeal);
    } catch (error) {
      console.error(error);

      // Обработка ошибок JWT
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Недействительный токен" });
      }

      return res.status(500).json({ message: "Ошибка при создании обращения" });
    }
  }

  // получение всех обращений
  async getAllAppeals(req, res) {
    try {
      const appeals = await Appeal.findAll({
        include: [
          { model: User, attributes: ["id", "name", "surname"] },
          {
            model: Response,
            include: [{ model: User, attributes: ["id", "name", "surname"] }],
          },
        ],
      });
      return res.json(appeals);
    } catch (error) {
      // Обработка ошибок
      console.error(error);
      return res.status(500).json({ message: "Ошибка при загрузке обращений" });
    }
  }

  //ответ на обращение
  async createResponse(req, res) {
    try {
      const appealId = req.params.appealId;
      const { description } = req.body;
      if (!description) {
        return res.status(400).json({ message: "Поле не может быть пустым" });
      }

      const appeal = await Appeal.findByPk(appealId);
      if (!appeal) {
        return res.status(404).json({ message: "Обращение не найдено" });
      }

      // Получение токена из заголовка Authorization
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Токен не предоставлен" });
      }

      // Сохраняем ответ
      const response = await Response.create({
        userId: req.user.id,
        appealId: appealId,
        description,
      });

          // Обновляем статус обращения на "resolved"
      appeal.status='resolved'
      await appeal.save()

      return res.status(201).json(response);
    } catch (error) {
      console.error(error);

      // Обработка ошибок JWT
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Недействительный токен" });
      }

      return res
        .status(500)
        .json({ message: "Ошибка при отправке ответа на обращение" });
    }
  }

  //получение всех ответов на обращения
  async getAllResponses(req, res) {
    try {
      const responses = await Response.findAll({
        include: [
          { model: User, attributes: ["id", "name", "surname"] },
          { model: Appeal },
        ],
      });
      return res.json(responses);
    } catch (error) {
      // Обработка ошибок
      console.error(error);
      return res.status(500).json({ message: "Ошибка при загрузке ответов" });
    }
  }

  //получение ответа на конкретное обращение
  async getResponseForUser(req, res) {
    const { appealId } = req.body;

    try {
      const response = await Response.findOne({
        include: [
          { model: User, attributes: ["id", "name", "surname"] },
          { model: Appeal },
        ],

        where: { appealId },
      });
      return res.json(response);
    } catch (error) {
      // Обработка ошибок
      console.error(error);
      return res.status(500).json({ message: "Ошибка при загрузке ответа" });
    }
  }
}
module.exports = new AppealController();
