const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
} = graphql;

const books = require('../books.json');
const authors = require('../authors.json');

const _ = require('lodash');

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent);
        return _.find(authors, { id: parent.id });
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLString },
    books: {
      type: GraphQLList(BookType),
      resolve(parent, agrs) {
        return _.filter(books, { authorId: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Root of the graph',
  fields: {
    book: {
      type: BookType,
      description: 'A single book',
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //code to get data from db and other sources
        return _.find(books, { id: args.id });
      },
    },
    author: {
      type: AuthorType,
      description: 'Name of an Author',
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //code to get data from db and other sources
        return _.find(authors, { id: args.id });
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
