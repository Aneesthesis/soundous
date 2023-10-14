import jwt, { decode } from "jsonwebtoken";

export const generateToken = (user) => {
  console.log(user);
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    "AnyThing",
    { expiresIn: "30d" }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, "AnyThing", (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        console.log("token verified");
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};
