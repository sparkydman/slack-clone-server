const createResolver = (resolver) => {
  const baseResolver = resolver;
  baseResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context) => {
      await resolver(parent, args, context);
      return childResolver(parent, args, context);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

export const requiresAuth = createResolver((parent, args, { user }) => {
  // console.log(user);
  if (!user || !user.id) {
    throw new Error("Not authenticated");
  }
});

// export const requiresAdmin = requiresAuth.createResolver(
//   (parent, args, context) => {
//     if (!context.user.isAdmin) {
//       throw new Error("Requires admin access");
//     }
//   }
// );
