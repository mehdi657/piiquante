const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RONDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    // console.log("---->userId/auth", userId);
    req.auth = {
      userId: userId,
    };
    next();
    // console.log("---->userId/auth", userId);
  } catch (error) {
    console.log("error401midl/auth", error);
    res.status(401).json({ error });
  }
};
