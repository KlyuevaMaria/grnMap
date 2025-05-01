const { body } = require("express-validator");

const validateCreateTree = ({ isUpdate = false } = {}) => {
  const base = isUpdate
    ? (field) => body(field).optional()
    : (field) => body(field).notEmpty();

  return [
    base("type").withMessage("Тип дерева обязателен").isString(),
    base("status").withMessage("Статус обязателен").isString(),
    body("note").optional().isString(),

    base("latitude")
      .withMessage("Некорректная широта")
      .isFloat({ min: -90, max: 90 }),
    base("longitude")
      .withMessage("Некорректная долгота")
      .isFloat({ min: -180, max: 180 }),

    base("adress").withMessage("Адрес обязателен").isString(),
    base("owner").withMessage("Владелец обязателен").isString(),
    base("year")
      .withMessage("Неверный год")
      .isInt({ min: 1800, max: new Date().getFullYear() }),

    body("height").optional().isFloat({ min: 0.1 }),
    body("diameter").optional().isFloat({ min: 0.1 }),
    body("num_of_bar").optional().isInt({ min: 1 }),
    body("crown_diameter").optional().isFloat({ min: 0.1 }),

    base("env").withMessage("Среда произрастания обязательна").isString(),
    base("condition").withMessage("Состояние обязательно").isString(),
  ];
};

module.exports = { validateCreateTree };
