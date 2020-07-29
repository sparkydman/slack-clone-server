import jwt from "jsonwebtoken";
import _ from "lodash";
import bcrypt from "bcrypt";

export const createTokens = async (user, secret, secret2) => {
  const createAccessToken = jwt.sign(
    {
      user: _.pick(user, ["id", "username"]),
    },
    secret,
    {
      expiresIn: "1h",
    }
  );
  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, ["id", "username"]),
    },
    secret2,
    {
      expiresIn: "7d",
    }
  );
  return [createAccessToken, createRefreshToken];
};

export const createRefreshToken = async (
  refreshToken,
  models,
  secret,
  secret2
) => {
  let userId = 0;
  try {
    const {
      user: { id },
    } = jwt.decode(refreshToken);
    userId = id;
  } catch (err) {
    return {};
  }

  if (!userId) {
    return {};
  }
  const user = await models.user.findOne({ where: { id: userId } });
  if (!user) {
    return {};
  }
  const refreshSecret = user.password + secret2;
  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }
  const [newToken, newRefreshToken] = await createTokens(
    user,
    secret,
    refreshSecret
  );
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const tryLogin = async (models, email, password, secret, secret2) => {
  try {
    const user = await models.user.findOne({ where: { email }, raw: true });
    if (!user) {
      return {
        ok: false,
        errors: [{ path: "email", message: "Invalid Credentials" }],
      };
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return {
        ok: false,
        errors: [{ path: "password", message: "Invalid Credentials" }],
      };
    }

    const refreshSecret = user.password + secret2;

    const [createAccessToken, createRefreshToken] = await createTokens(
      user,
      secret,
      refreshSecret
    );
    return {
      ok: true,
      token: createAccessToken,
      refreshToken: createRefreshToken,
    };
  } catch (err) {
    console.log(err);
    return {
      ok: false,
      errros: [{ path: "name", message: "Something went wrong" }],
    };
  }
};
