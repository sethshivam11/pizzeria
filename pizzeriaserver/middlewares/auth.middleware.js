import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is required",
      });
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
  }
};

export default verifyToken;
