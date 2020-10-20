const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
  validateRegisterOptions,
  validateLoginOptions,
} = require("../../utils/validators");
const User = require("../../models/user");
const { JWT_SECRET } = process.env;

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );
}

module.exports = {
  Mutation: {
    login: async (_parent, { options }, _context, _info) => {
      const { username, password } = options;

      const { valid, errors } = validateLoginOptions(username, password);
      if (!valid) {
        throw new UserInputError("Validation Errors", { errors });
      }

      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong Credentials";
        throw new UserInputError("Wrong Credentials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
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
      const token = generateToken(result);

      return {
        ...result._doc,
        id: result._id,
        token,
      };
    },
  },
};
