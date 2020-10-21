const { AuthenticationError } = require("apollo-server");

const Post = require("../../models/post");
const checkAuth = require("../../utils/check-auth");

module.exports = {
  Query: {
    getPosts: async (_parent, _args, _context, _info) => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        console.log(JSON.stringify(error, null, 2));
        throw new Error(error);
      }
    },
    getPost: async (_parent, { postId }, _context, _info) => {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        console.log(JSON.stringify(error, null, 2));
        throw new Error(error);
      }
    },
  },
  Mutation: {
    createPost: async (_parent, { body }, context, _info) => {
      const user = checkAuth(context);

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();
      return post;
    },
    deletePost: async (_parent, { postId }, context, _info) => {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);

        if (user.username === post.username) {
          await post.delete();
          return "Post deleted successfully";
        }

        throw new AuthenticationError("Action not allowed");
      } catch (error) {
        console.log(JSON.stringify(error, null, 2));
        throw new Error(error);
      }
    },
  },
};
