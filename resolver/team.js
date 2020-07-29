import formatError from "../formatError";
import { requiresAuth } from "../permissions";

export default {
  Query: {
    allTeams: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        const res = await models.team.findAll({
          where: { owner: user.id },
          raw: true,
        });
        console.log(res);
        return res;
      }
    ),
    invitedTeams: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        const res = await models.team.findAll({
          include: [
            {
              model: models.user,
              where: { id: user.id },
            },
          ],
          raw: true,
        });
        // console.log(res);
        return res;
      }
    ),
  },
  Mutation: {
    createTeam: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        // console.log("user value:", user.id);
        try {
          const res = await models.sequelize.transaction(async () => {
            const team = await models.team.create({ ...args, owner: user.id });
            await models.channel.create({
              name: "general",
              public: true,
              teamId: team.id,
            });
            return team;
          });
          return {
            ok: true,
            team: res,
          };
        } catch (err) {
          console.log(err);
          return {
            ok: false,
            errors: formatError(err),
          };
        }
      }
    ),
    addTeamMember: requiresAuth.createResolver(
      async (parent, { teamId, email }, { models, user }) => {
        // console.log("user value:", user.id);
        try {
          const teamPromise = models.team.findOne({
            where: { id: teamId },
            raw: true,
          });
          const userToAddPromise = models.user.findOne({
            where: { email },
            raw: true,
          });
          const [team, userToAdd] = await Promise.all([
            teamPromise,
            userToAddPromise,
          ]);
          if (team.owner !== user.id) {
            return {
              ok: false,
              errors: [
                { path: "Your are not authorized to add member to this team" },
              ],
            };
          }

          if (!userToAdd) {
            return {
              ok: false,
              errors: [
                {
                  path: "email",
                  message: "User with the email does not exist",
                },
              ],
            };
          }
          await models.member.create({ teamId, userId: userToAdd.id });
          return {
            ok: true,
          };
        } catch (err) {
          console.log(err);
          return {
            ok: false,
            errors: formatError(err),
          };
        }
      }
    ),
  },
  Team: {
    channels: async ({ id }, args, { models }) =>
      await models.channel.findAll({ where: { teamId: id }, raw: true }),
  },
};
