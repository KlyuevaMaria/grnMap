const {
  Document,
  Photo,
  Tree,
  Status,
  Special_note,
  Environment,
  Condition,
} = require("../models/treeModels");
const uuid = require("uuid");
const path = require("path");
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModels");
const ApiError = require("../error/ApiError");
const { log } = require("console");
const { decode } = require("punycode");
const { where } = require("sequelize");
const sequelize = require("../db");

class TreeController {
  async createTree(req, res, next) {
    try {
      const {
        type,
        statusId,
        specialNoteId,
        latitude,
        longitude,
        adress,
        owner,
        envId,
        year,
        height,
        diameter,
        number_of_barrels,
        crown_diameter,
        conditionId,
      } = req.body;

      // ✅ Проверка ID справочных сущностей
      const [isStatus, isNote, isEnv, isCondition] = await Promise.all([
        Status.findByPk(statusId),
        Special_note.findByPk(specialNoteId),
        Environment.findByPk(envId),
        Condition.findByPk(conditionId),
      ]);

      if (!isStatus || !isNote || !isEnv || !isCondition) {
        return res
          .status(400)
          .json({ message: "Некорректные справочные значения" });
      }
      const user = req.user.id;
      if (!user) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }
      // ✅ Создание дерева
      const tree = await Tree.create({
        type,
        statusId,
        specialNoteId,
        latitude,
        longitude,
        adress,
        owner,
        environmentId: envId,
        year_of_planting: year,
        height,
        diameter,
        number_of_barrels,
        crown_diameter,
        conditionId,
        userId: user,
      });

      // ✅ Загрузка фото (одного или нескольких)
      if (req.files?.photo) {
        const photoFiles = Array.isArray(req.files.photo)
          ? req.files.photo
          : [req.files.photo];

        for (const file of photoFiles) {
          const allowedTypes = ["image/jpeg", "image/png"];
          const maxSize = 5 * 1024 * 1024;

          if (!allowedTypes.includes(file.mimetype)) continue;
          if (file.size > maxSize) continue;

          const fileName = uuid.v4() + path.extname(file.name);
          const savePath = path.resolve(
            __dirname,
            "..",
            "static",
            "photo",
            fileName
          );
          await file.mv(savePath);

          await Photo.create({ name: fileName, treeId: tree.id });
        }
      }

      // ✅ Загрузка документов (одного или нескольких)
      if (req.files?.document) {
        const docFiles = Array.isArray(req.files.document)
          ? req.files.document
          : [req.files.document];

        for (const file of docFiles) {
          const allowedTypes = [
            "text/plain",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ];
          const maxSize = 2 * 1024 * 1024;

          if (!allowedTypes.includes(file.mimetype)) continue;
          if (file.size > maxSize) continue;

          const fileName = uuid.v4() + path.extname(file.name);
          const savePath = path.resolve(
            __dirname,
            "..",
            "static",
            "documents",
            fileName
          );
          await file.mv(savePath);

          await Document.create({ name: fileName, treeId: tree.id });
        }
      }

      return res
        .status(201)
        .json({ message: "Дерево успешно создано", treeId: tree.id });
    } catch (error) {
      console.error("Ошибка при создании дерева:", error);
      next(error);
    }
  }

  //Редактирование дерева
  async updateTreeById(req, res, next) {
    const { id } = req.params;
    try {
      const {
        type,
        status,
        note,
        latitude,
        longitude,
        adress,
        owner,
        env,
        year,
        height,
        diameter,
        num_of_bar,
        crown_diameter,
        condition,
      } = req.body;

      const tree = await Tree.findByPk(id);
      if (!tree) {
        return res.status(404).json({ message: "Дерево не найдено" });
      }

      const updates = {};

      if (type !== undefined) updates.type = type;
      if (latitude !== undefined) updates.latitude = latitude;
      if (longitude !== undefined) updates.longitude = longitude;
      if (adress !== undefined) updates.adress = adress;
      if (owner !== undefined) updates.owner = owner;
      if (year !== undefined) updates.year_of_planting = year;
      if (height !== undefined) updates.height = height;
      if (diameter !== undefined) updates.diameter = diameter;
      if (num_of_bar !== undefined) updates.number_of_barrels = num_of_bar;
      if (crown_diameter !== undefined) updates.crown_diameter = crown_diameter;

      // асинхронный поиск связанных моделей, если переданы
      if (status) {
        const statusObj = await Status.findOne({
          where: { status_name: status },
        });
        if (!statusObj)
          return res.status(400).json({ message: "Неверный статус" });
        updates.statusId = statusObj.id;
      }

      if (note) {
        const noteObj = await Special_note.findOne({ where: { note } });
        if (!noteObj)
          return res.status(400).json({ message: "Неверная пометка" });
        updates.specialNoteId = noteObj.id;
      }

      if (env) {
        const envObj = await Environment.findOne({ where: { name: env } });
        if (!envObj)
          return res.status(400).json({ message: "Неверная среда обитания" });
        updates.environmentId = envObj.id;
      }

      if (condition) {
        const conditionObj = await Condition.findOne({
          where: { name: condition },
        });
        if (!conditionObj)
          return res.status(400).json({ message: "Неверное состояние" });
        updates.conditionId = conditionObj.id;
      }

      //Фото
      if (req.files?.photo) {
        const photoFile = Array.isArray(req.files.photo)
          ? req.files.photo[0]
          : req.files.photo;
        const fileName = uuid.v4() + path.extname(photoFile.name);
        const filePath = path.resolve(
          __dirname,
          "..",
          "static",
          "photo",
          fileName
        );

        // удалить старое фото
        if (tree.photo?.name) {
          const oldPath = path.resolve(
            __dirname,
            "..",
            "static",
            "photo",
            tree.photo.name
          );
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        await photoFile.mv(filePath);

        if (tree.photoId) {
          // обновляем существующее фото
          await Photo.update(
            { name: fileName },
            { where: { id: tree.photoId } }
          );
        } else {
          // создаём новое фото, если его ещё не было
          const newPhoto = await Photo.create({ name: fileName });
          updates.photoId = newPhoto.id;
        }
      }

      // Документ
      if (req.files?.document) {
        const docFile = Array.isArray(req.files.document)
          ? req.files.document[0]
          : req.files.document;
        const docName = uuid.v4() + path.extname(docFile.name);
        const docPath = path.resolve(
          __dirname,
          "..",
          "static",
          "documents",
          docName
        );

        // удалить старый файл
        if (tree.document?.name) {
          const oldDocPath = path.resolve(
            __dirname,
            "..",
            "static",
            "documents",
            tree.document.name
          );
          if (fs.existsSync(oldDocPath)) {
            fs.unlinkSync(oldDocPath);
          }
        }
        await docFile.mv(docPath);

        if (tree.documentId) {
          await Document.update(
            { name: docName },
            { where: { id: tree.documentId } }
          );
        } else {
          const newDoc = await Document.create({ name: docName });
          updates.documentId = newDoc.id;
        }
      }

      await tree.update(updates);

      return res.json({ message: "Дерево успешно обновлено", tree });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  //Получение всех деревьев с полной информацией
  async getAllTrees(req, res, next) {
    try {
      const trees = await Tree.findAll({
        include: [
          { model: Photo, attributes: ["name"] },
          { model: Document, attributes: ["name"] },
          { model: Status, attributes: ["status_name"] },
          { model: Special_note, attributes: ["note"] },
          { model: Environment, attributes: ["name"] },
          { model: Condition, attributes: ["name"] },
          { model: User, attributes: ["email", "name"] }, // если нужно видеть, кто добавил дерево
        ],
      });
      return res.json(trees);
    } catch (e) {
      console.error(e.message);
      return next(e);
    }
  }

  // Получение дерева с полной информацией
  async getTreeById(req, res, next) {
    const id = req.params.id;
    try {
      const tree = await Tree.findOne({
        where: { id: id },
        include: [
          { model: Photo, attributes: ["name"] },
          { model: Document, attributes: ["name"] },
          { model: Status, attributes: ["status_name"] },
          { model: Special_note, attributes: ["note"] },
          { model: Environment, attributes: ["name"] },
          { model: Condition, attributes: ["name"] },
          { model: User, attributes: ["email", "name"] }, // если нужно видеть, кто добавил дерево
        ],
      });

      if (!tree) {
        return res.status(404).json({ message: "Дерево не найдено" });
      }

      return res.json(tree);
    } catch (e) {
      console.error(e.message);
      return next(e);
    }
  }

  //Удаление дерева с причиной
  async deleteTree(req, res, next) {
    try {
      const id = req.params.id;
      const { reason } = req.body;

      const tree = await Tree.findByPk(id);
      if (!tree) {
        return res.status(404).json({ message: "Дерево не найдено" });
      }
      if (!reason) {
        return res.status(404).json({ message: "Введите причину удаления" });
      }

      // Можно логировать причину удаления в отдельную таблицу, если нужно
      await tree.destroy();

      return res.json({ message: `Дерево удалено. Причина: ${reason}` });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async createStatus(req, res, next) {
    try {
      const { status_name } = req.body;
      if (!status_name) {
        return res.status(400).json({ message: "Отсутствует статус" });
      }
      const thisStatus = await Status.findOne({
        where: { status_name },
      });
      if (thisStatus) {
        return res
          .status(400)
          .json({ message: `Статус "${status_name}" уже существует` });
      }
      const status = await Status.create({
        status_name,
      });
      console.log("-------------", status_name);
      return res.json({ message: `Добавлен статус - ${status_name}` });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async createSpecialNote(req, res, next) {
    try {
      const { note } = req.body;
      if (!note) {
        return res.status(400).json({ message: "Отсутствует пометка" });
      }
      const thisNote = await Special_note.findOne({
        where: { note },
      });
      if (thisNote) {
        return res
          .status(400)
          .json({ message: `Пометка "${note}" уже существует` });
      }
      const addedNote = await Special_note.create({
        note,
      });
      console.log("-------------", note);
      return res.json({ message: `Добавлена особая пометка - ${note}` });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async createEnv(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Отсутствует название" });
      }
      const thisName = await Environment.findOne({
        where: { name: name },
      });
      if (thisName) {
        return res
          .status(400)
          .json({ message: `Среда "${name}" уже существует` });
      }
      const env = await Environment.create({
        name,
      });
      console.log("-------------", name);
      return res.json({ message: `Добавлена среда произрастания - ${name}` });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async createCondition(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Отсутствует название" });
      }
      const thisCondition = await Condition.findOne({
        where: { name },
      });
      if (thisCondition) {
        return res
          .status(400)
          .json({ message: `Состояние "${name}" уже существует` });
      }
      const condition = await Condition.create({
        name,
      });
      console.log("-------------", name);
      return res.json({ message: `Добавлено новое состояние - ${name}` });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getStatus(req, res, next) {
    try {
      const statuses = await Status.findAll();
      return res.json(statuses);
    } catch (e) {
      next(ApiError.notFound(e.message));
    }
  }

  async getEnvs(req, res, next) {
    try {
      const envs = await Environment.findAll();
      return res.json(envs);
    } catch (e) {
      next(ApiError.notFound(e.message));
    }
  }

  async getConditions(req, res, next) {
    try {
      const conditions = await Condition.findAll();
      return res.json(conditions);
    } catch (e) {
      next(ApiError.notFound(e.message));
    }
  }

  async getEnvs(req, res, next) {
    try {
      const envs = await Environment.findAll();
      return res.json(envs);
    } catch (e) {
      next(ApiError.notFound(e.message));
    }
  }

  async getNotes(req, res, next) {
    try {
      const conditions = await Special_note.findAll();
      return res.json(conditions);
    } catch (e) {
      next(ApiError.notFound(e.message));
    }
  }

  async deleteStatus(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Status.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).json({ message: "Статус не найден" });
      }
      return res.json({ message: "Статус успешно удалён" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async deleteSpecialNote(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Special_note.destroy({ where: { id } });
      console.log("STATUS---------", deleted);

      if (!deleted) {
        return res.status(404).json({ message: "Пометка не найдена" });
      }
      return res.json({ message: "Пометка успешно удалёна" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async deleteEnv(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Environment.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).json({ message: "Среда не найдена" });
      }

      return res.json({ message: "Среда произрастания удалена" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async deleteCondition(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Condition.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).json({ message: "Состояние не найдено" });
      }

      return res.json({ message: "Состояние дерева удалено" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Название обязательно" });
      }

      const status = await Status.findByPk(id);
      if (!status) {
        return res.status(404).json({ message: "Статус не найден" });
      }

      await status.update({ status_name: name });

      return res.json({ message: `Статус обновлён: ${name}` });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async updateSpecialNote(req, res, next) {
    try {
      const { id } = req.params;
      const { note } = req.body;

      if (!note) {
        return res.status(400).json({ message: "Название обязательно" });
      }

      const findedNote = await Special_note.findByPk(id);
      if (!findedNote) {
        return res.status(404).json({ message: "Пометка не найдена" });
      }

      await findedNote.update({ note: note });

      return res.json({ message: `Пометка обновлена: ${note}` });
    } catch (e) {
      console.error("Ошибка при создании :", e);

      next(ApiError.badRequest(e.message));
    }
  }

  async updateEnv(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Название обязательно" });
      }

      const findedEnv = await Environment.findByPk(id);
      if (!findedEnv) {
        return res.status(404).json({ message: "Среда не найдена" });
      }

      await findedEnv.update({ name: name });

      return res.json({ message: `Среда обновлена: ${name}` });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async updateCondition(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!id) {
        return res.status(404).json({ message: "Не указано состояние" });
      }
      console.log("LOG----", id);

      if (!name) {
        return res.status(400).json({ message: "Название обязательно" });
      }

      const findedCond = await Condition.findByPk(id);
      console.log("LOG----", findedCond);

      if (!findedCond) {
        return res.status(404).json({ message: "Состояние не найдено" });
      }

      await findedCond.update({ name });

      return res.json({ message: `Состояние обновлено: ${findedCond.name}` });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  //получение деревьев пользователя
  async getUserTrees(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res
          .status(401)
          .json({ message: "Authorization header is missing" });
      }

      const tokenParts = authHeader.split(" ");
      if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res
          .status(401)
          .json({ message: "Invalid authorization format" });
      }
      const token = tokenParts[1];

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.SECRET_KEY);
      } catch (error) {
        return res
          .status(401)
          .json({ message: "Invalid token", error: error.message });
      }

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userTrees = await Tree.findAll({
        where: { userId: decoded.id },
        include: [
          { model: Photo, attributes: ["name"] },
          { model: Document, attributes: ["name"] },
          { model: Status, attributes: ["status_name"] },
          { model: Special_note, attributes: ["note"] },
          { model: Environment, attributes: ["name"] },
          { model: Condition, attributes: ["name"] },
        ],
      });
      return res.json(userTrees);
    } catch (e) {
      console.error(e.message);
      return next(e);
    }
  }
}

module.exports = new TreeController();
