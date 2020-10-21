const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  input RegisterOptions {
    email: String!
    username: String!
    password: String!
    confirmPassword: String!
  }

  input LoginOptions {
    username: String!
    password: String!
  }

  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }

  type Mutation {
    register(options: RegisterOptions): User!
    login(options: LoginOptions): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
  }
`;
