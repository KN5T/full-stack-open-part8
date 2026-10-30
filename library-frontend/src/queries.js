import { gql } from "@apollo/client"

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      born
      bookCount
      name
      id
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      author
      genres
      id
      published
      title
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      id
      genres
      author
      title
      published
    }
  }
`

export const UPDATE_BIRTHYEAR = gql`
  mutation updateBirthyear($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      bookCount
      id
      born
      name
    }
  }
`
