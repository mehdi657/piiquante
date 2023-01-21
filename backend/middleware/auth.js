const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, `${process.env.SECRET}`);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    console.log("error401midl/auth", error);
    res.status(401).json({ error });
  }
};
