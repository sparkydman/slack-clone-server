export default `
  type Channel {
    id: Int!
    name: String!
    public: Boolean!
    messages: [Message!]!
    users: [User!]!
  }
  type CreateChannelResponse{
    ok: Boolean
    channel: Channel
    errors: [Error!]
  }
  type Query {
    hello: String
  }
  type Mutation{
    createChannel(teamId:Int!,name:String!,public:Boolean=false):CreateChannelResponse!
  }
`;
