const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

const { JWT_SECRET } = process.env;

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, JWT_SECRET);
        return user;
      } catch (error) {
        console.log(JSON.stringify(error, null, 2));
        throw new AuthenticationError("Invalid/Expired token");
      }
    }

    throw new Error("Authentication token must be 'Bearer [token]'");
  }

  throw new Error("Authorization header must be provided");
};
