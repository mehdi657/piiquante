const multer = require("multer");
//  constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
// constante storage , à passer à multer comme configuration, qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
  // "destination" indique à multer d'enregistrer les fichiers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  //   filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores, d'ajouter un timestamp Date.now() et l'extension de fichier appropriée
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});
// méthode single() crée un middleware qui capture les fichiers d'un certain type (passé en argument), et les enregistre au système de fichiers du serveur à l'aide du storage configuré
module.exports = multer({ storage: storage }).single("image");
