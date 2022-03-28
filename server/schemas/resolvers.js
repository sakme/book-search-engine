const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context ) => {
      if (context.user) {
          const userData = await User.findOne({ _id: context.user._id })
              .select('-__v -password')
              .populate('thoughts')
              .populate('friends');

          return userData;
      }
      throw new AuthenticationError('Not logged in');
  },

    users: async () => {
      return User.find();
    },

    user: async (parent, { username }) => {
        return User.findOne({ username });
    }
    
  },

  Mutation: {
    addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
    },

    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });

        if (!user) {
            throw new AuthenticationError('Incorrect credentials');
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
            throw new AuthenticationError('Incorrect credentials');
        }
        const token = signToken(user);
        return { token, user };
    },

    addBook: async (parent,{ userId, savedBook }, context) => {
      if (context.user) {
        const updatedBook = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { savedBooks: savedBook } },
          { new: true, runValidators: true }
        );
    
        return updatedBook;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },

    removeBook: async (parent,{ userId, bkId }, context) => {
      if (context.user) {
        const removeBook = await User.findOneAndUpdate(
          { _id: userId },
          { $pull: { savedBooks: { bookId: bkId } } },
          { new: true }
        );
    
        return removeBook;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    }
  }

};
  
  module.exports = resolvers;