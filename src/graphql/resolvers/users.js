const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { validateRegisterOptions } = require("../../utils/validators");
const User = require("../../models/user");
const { JWT_SECRET } = process.env;

module.exports = {
  Mutation: {
    register: async (_parent, { options }, _context, _info) => {
      const { email, username, password, confirmPassword } = options;

      const { valid, errors } = validateRegisterOptions(
        email,
        username,
        password,
        confirmPassword,
      );
      if (!valid) {
        throw new UserInputError("Validation Errors", { errors });
      }

      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is already taken", {
          errors: {
            username: "This username is already taken",
          },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await new User({
        email,
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      });

      const result = await newUser.save();
      const token = await jwt.sign(
        {
          id: result.id,
          email: result.email,
          username: result.username,
        },
        JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );

      return {
        ...result._doc,
        id: result._id,
        token,
      };
    },
  },
};
