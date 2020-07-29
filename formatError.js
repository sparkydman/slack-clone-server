import _ from "lodash";

export default (e) => {
  if (e !== undefined) {
    const err = e.errors.map((x) => _.pick(x, ["path", "message"]));

    return err;
  }
  return [{ path: "name", message: "Something went wrong" }];
};
