import { ALL_BOOKS } from "../queries"

export const addBookToCache = (cache, bookToAdd) => {
  const updateBooks = (data) => {
    if (!data) return data

    const bookExists = data.allBooks.some((book) => book.id === bookToAdd.id)

    if (bookExists) {
      return { allBooks: data.allBooks }
    }

    return {
      allBooks: data.allBooks.concat(bookToAdd),
    }
  }

  cache.updateQuery({ query: ALL_BOOKS }, updateBooks)

  bookToAdd.genres.forEach((genre) => {
    cache.updateQuery(
      {
        query: ALL_BOOKS,
        variables: { genre },
      },
      updateBooks,
    )
  })

  cache.updateQuery(
    {
      query: ALL_BOOKS,
      variables: { genre: null },
    },
    updateBooks,
  )
}
