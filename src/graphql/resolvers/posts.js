const Post = require("../../models/post");

module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find();
        return posts;
      } catch (error) {
        console.log(JSON.stringify(error, null, 2));
        throw new Error(error);
      }
    },
  },
};
