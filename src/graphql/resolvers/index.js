const PostsResolvers = require("./posts");
const UsersResolvers = require("./users");
const CommentsResolvers = require("./comments");

module.exports = {
  Query: {
    ...PostsResolvers.Query,
  },
  Mutation: {
    ...UsersResolvers.Mutation,
    ...PostsResolvers.Mutation,
    ...CommentsResolvers.Mutation,
  },
};
