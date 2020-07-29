export default `
  
  type Message {
    id: Int!
    text: String!
    user: User!
    channel: Channel!
  }
  
  type Query {
    hello: String
  }
  type Mutation{
      createMessage(channelId:Int!,text:String!): Boolean!
  }
`;
