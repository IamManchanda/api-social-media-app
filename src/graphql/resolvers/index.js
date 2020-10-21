const PostsResolvers = require("./posts");
const UsersResolvers = require("./users");
const CommentsResolvers = require("./comments");

module.exports = {
  Post: {
    commentsCount: ({ comments }, _args, _context, _info) => {
      return comments.length;
    },
    likesCount: ({ likes }, _args, _context, _info) => {
      return likes.length;
    },
  },
  Query: {
    ...PostsResolvers.Query,
  },
  Mutation: {
    ...UsersResolvers.Mutation,
    ...PostsResolvers.Mutation,
    ...CommentsResolvers.Mutation,
  },
  Subscription: {
    ...PostsResolvers.Subscription,
  },
};
