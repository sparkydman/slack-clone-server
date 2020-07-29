export default {
  Query: {},
  Mutation: {
    createMessage: async (parent, args, { models, user }) => {
      try {
        await models.message.create({ ...args, userId: user.id });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
