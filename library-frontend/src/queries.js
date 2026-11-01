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
  query AllBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      author {
        born
        name
        bookCount
        id
      }
      genres
      published
      title
      id
    }
  }
`

export const ME = gql`
  query Me {
    me {
      favoriteGenre
      id
      username
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
      author {
        name
        born
        bookCount
        id
      }
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

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
