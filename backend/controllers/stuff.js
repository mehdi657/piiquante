const Sauce = require("../models/sauce");
// Le package fs expose des méthodes pour interagir avec le système de fichiers du serveur.
const fs = require("fs");

exports.createSauces = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject.userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "sauce enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauces = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  delete sauceObject.userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "unauthorized request!" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "sauce modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauces = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé!" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        // La méthode unlink() du package  fs  vous permet de supprimer un fichier du système de fichiers.
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "sauce supprimé !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getOneSauces = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.likeSauces = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (req.body.like === 1 && !sauce.usersLiked.includes(req.body.userId)) {
        console.log("----->req.body", req.body);
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $addToSet: { usersLiked: req.body.userId },
          },
          console.log("----->sauce.usersLiked", sauce.usersLiked)
        )
          .then(() => res.status(201).json("sauce aimer"))
          .catch((error) => res.status(400).json({ error }));
      }
      if (
        req.body.like === -1 &&
        !sauce.usersDisliked.includes(req.body.userId)
      ) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: +1 },
            $addToSet: { usersDisliked: req.body.userId },
          }
        )
          .then(() => res.status(201).json("sauce non aimer"))
          .catch((error) => res.status(400).json({ error }));
      }
      if (req.body.like === 0 && sauce.usersLiked.includes(req.body.userId)) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
        )
          .then(() => res.status(201).json("Avis neutre"))
          .catch((error) => res.status(400).json({ error }));
      }
      if (
        req.body.like === 0 &&
        sauce.usersDisliked.includes(req.body.userId)
      ) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
        )
          .then(() => res.status(201).json("Avis neutre"))
          .catch((error) => res.status(400).json({ error }));
      }
      console.log("----->sauce", sauce);
      console.log("----->like3", req.body);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
