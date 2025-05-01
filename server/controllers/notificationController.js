const path = require("path");
const uuid = require("uuid");
const { Notification } = require("../models/userModels");
// const ApiError = require('../error/ApiError');
class NotificationController {
  async getAll(req, res) {
    try {
      const notifications = await Notification.findAll();
      return res.json(notifications);
    } catch (error) {
      // Обработка ошибок
      console.error(error);
      return res
        .status(500)
        .json({ message: "Ошибка при получении уведомлений" });
    }
  }
  async createNotification(req, res) {
    try {
      const { title, description, userId } = req.body;
      const img = req.files?.img; //проверка наличия файла

      if (!title || !description) {
        return res
          .status(400)
          .json({ message: "Заголовок и сообщение обязательны" });
      }
      let fileName = null;
      if (img) {
        fileName = uuid.v4() + ".jpg"; //уникальное имя файла
        await img.mv(path.resolve(__dirname, "..", "static/", fileName));
      }
      const notification = await Notification.create({
        title,
        description,
        img: fileName,
        userId,
      });
      return res.json(notification);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Ошибка при создании уведомления" });
    }
  }
}
module.exports = new NotificationController();
