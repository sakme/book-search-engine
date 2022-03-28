const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
      authors: [String]
      description: String!
      bookId: String!
      image: String
      link: String
      title: String!
  }

  type Auth {
      token: ID!
      user: User
  }

  input BookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type Query {
    me: User
    user(username: String): User
    users: [User]
  }

  type Mutation {
      login(email: String!, password: String!): Auth
      addUser(username: String!, email: String!, password: String!): Auth
      addBook(userId: ID!, savedBook: BookInput): User
      removeBook(userId: ID!, bkId: String): User
  }
`;

module.exports = typeDefs;