import { tryLogin } from "../auth";
import formatErrors from "../formatError";

export default {
  Query: {
    getUser: async (parent, { id }, { models }) =>
      await models.user.findOne({ where: { id } }),
    allUsers: async (parent, args, { models }) => await models.user.findAll(),
  },
  Mutation: {
    login: async (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      tryLogin(models, email, password, SECRET, SECRET2),
    register: async (parent, args, { models }) => {
      try {
        const user = await models.user.create(args);
        return {
          ok: true,
          user,
        };
      } catch (err) {
        console.log(err);
        return {
          ok: false,
          errors: formatErrors(err),
        };
      }
    },
  },
};
