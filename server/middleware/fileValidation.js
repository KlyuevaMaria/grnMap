const fileValidation = ({ isUpdate = false } = {}) => {
    return (req, res, next) => {
      const { files } = req;
  
      if (isUpdate && (!files || (!files.photo && !files.document))) {
        return next();
      }
  
      if (!files || !files.photo || !files.document) {
        return res.status(400).json({ message: "Файлы не были загружены." });
      }
  
      const { photo, document } = files;
  
      const allowedPhotoTypes = ["image/jpeg", "image/png"];
      const allowedDocTypes = [
        "text/plain",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
  
      if (photo && !allowedPhotoTypes.includes(photo.mimetype)) {
        return res.status(400).json({ message: "Недопустимый тип фото." });
      }
  
      if (photo && photo.size > 5 * 1024 * 1024) {
        return res.status(400).json({ message: "Фото превышает 5MB." });
      }
  
      if (document && !allowedDocTypes.includes(document.mimetype)) {
        return res
          .status(400)
          .json({ message: "Недопустимый тип документа." });
      }
  
      if (document && document.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: "Документ превышает 2MB." });
      }
  
      next();
    };
  };
  
  module.exports = { fileValidation };
  