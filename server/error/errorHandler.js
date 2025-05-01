module.exports = (res, error, message = "Произошла ошибка на сервере") => {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Недействительный токен" });
    }
    return res.status(500).json({ message });
  };
  