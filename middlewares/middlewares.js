const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  authNeeded: async (req, res, next) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (!token)
        return res.status(400).json({
          errors: [
            {
              title: "Auth failed!",
              detail: "Authentication token not found!"
            }
          ]
        });
      const verifyToken = jwt.verify(token, "MySecretToken");
      if (!verifyToken)
        return res.status(400).json({
          errors: [
            {
              title: "Auth failed!",
              detail: "Authentication token not found!"
            }
          ]
        });
      const isUserExist = await User.findById(verifyToken.userId);
      if (!isUserExist)
        return res.status(400).json({
          errors: [
            {
              title: "Auth failed!",
              detail: "User not found!"
            }
          ]
        });
      req.user = isUserExist;
      next();
    } else {
      return res.status(400).json({
        errors: [
          {
            title: "Auth failed!",
            detail: "Authentication token not found!!"
          }
        ]
      });
    }
  }
};
