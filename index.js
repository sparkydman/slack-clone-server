import express from "express";
import { ApolloServer } from "apollo-server-express";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import cors from "cors";
import path from "path";
import models from "./models";
import jwt from "jsonwebtoken";
import { createRefreshToken } from "./auth";

const PORT = process.env.PORT || 4000;

const SECRET = "DGDGkmgoein3450o06klmkel342dmdkg";
const SECRET2 = "JKLDKFJGFDewoiope0943kljerwv4iwdf3423ef2323";

const app = express();
app.use(cors("*"));

const addUser = async (req, res, next) => {
  const token = req.headers["x-token"];
  if (token) {
    try {
      const user = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const newRefreshToken = req.headers["x-token-refresh"];
      const newTokens = await createRefreshToken(
        newRefreshToken,
        models,
        SECRET,
        SECRET2
      );
      if (newTokens.token && newTokens.refreshToken) {
        res.set("Access-Control-Expose-Headers", "x-token,x-token-refresh");
        res.set("x-token", newTokens.token);
        res.set("x-token-refresh", newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

app.use(addUser);

const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, "./schema")));
const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, "./resolver"))
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    models,
    user: req.user.user,
    SECRET,
    SECRET2,
  }),
});
server.applyMiddleware({ app });

models.sequelize
  .sync({})
  .then(() => {
    app.listen({ port: PORT }, () =>
      console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
      )
    );
  })
  .catch((err) => console.error(err));
