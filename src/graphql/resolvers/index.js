const PostsResolvers = require("./posts");
const UsersResolvers = require("./posts");

module.exports = {
  Query: {
    ...PostsResolvers.Query,
  },
};
