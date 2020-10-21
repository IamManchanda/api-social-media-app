const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/type-defs");
const resolvers = require("./graphql/resolvers");

const { DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(
    `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@cluster-000.mwnep.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => {
    console.log("Database connection established");
    return server.listen();
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((error) => {
    console.log(JSON.stringify(error, null, 2));
  });
