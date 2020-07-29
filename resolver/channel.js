import formatError from "../formatError";

export default {
  Query: {},
  Mutation: {
    createChannel: async (parent, args, { models }) => {
      try {
        const channel = await models.channel.create(args);
        return {
          ok: true,
          channel,
        };
      } catch (err) {
        console.log(err);
        return {
          ok: false,
          errors: formatError(err),
        };
      }
    },
  },
};
