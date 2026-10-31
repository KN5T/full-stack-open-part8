const Book = require("./models/book")
const Author = require("./models/author")
const User = require("./models/user")
const { GraphQLError } = require("graphql")
const jwt = require("jsonwebtoken")

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate("author")
      } else if (args.author && !args.genre) {
        const author = await Author.findOne({ name: args.author })
        return Book.find({ author: author._id }).populate("author")
      } else if (!args.author && args.genre) {
        return Book.find({ genres: args.genre }).populate("author")
      }

      const author = await Author.findOne({ name: args.author })

      return Book.find({
        author: author._id,
        genres: args.genre,
      }).populate("author")
    },
    allAuthors: async () => Author.find({}),
    me: async (root, args, { currentUser }) => {
      return currentUser
    },
  },
  Author: {
    bookCount: async ({ id }) => Book.countDocuments({ author: id }),
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        try {
          author = new Author({ name: args.author })
          await author.save()
        } catch (error) {
          throw new GraphQLError(`Saving author failed: ${error.message}`, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          })
        }
      }

      const newBook = new Book({
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres,
      })

      try {
        const savedBook = await newBook.save()
        return savedBook.populate("author")
      } catch (error) {
        throw new GraphQLError(`Saving book failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        })
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        })
      }

      const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }

      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError(`Saving author failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.setBornTo,
            error,
          },
        })
      }

      return author
    },
    createUser: async (root, { username, favoriteGenre }) => {
      const user = new User({ username, favoriteGenre })

      try {
        const savedUser = await user.save()
        return savedUser
      } catch (error) {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: username,
            error,
          },
        })
      }
    },
    login: async (root, { username, password }) => {
      const user = await User.findOne({ username })

      if (!user || password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }

      const userForToken = {
        username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError("_resetDatabase is only available in test mode")
      }
      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})
      return true
    },
  },
}

module.exports = resolvers
