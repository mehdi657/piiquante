const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      console.log("user", user);
      user
        .save()
        .then(() => res.status(201).json({ message: "utilisateur créé !" }))
        .catch((err) => {
          console.log("err", err);
          res
            .status(400)
            .send("impossible d'enregistrer dans la base de données !");
        });
    })
    .catch((error) => {
      console.log("error500", error);
      res.status(500).json({ error });
    });
};
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res
          .status(401)
          .json({ message: "paire identifiant/mot de passe incorrecte !" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({
                  message: "paire identifiant/mot de passe incorrecte !",
                });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, `${process.env.SECRET}`, {
                  expiresIn: "24h",
                }),
              });
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};
