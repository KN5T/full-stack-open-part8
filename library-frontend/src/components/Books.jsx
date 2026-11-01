import { useQuery } from "@apollo/client/react"
import { ALL_BOOKS } from "../queries"
import { useState } from "react"

const Books = ({ show }) => {
  const [genre, setGenre] = useState("all genres")
  const allBooksResult = useQuery(ALL_BOOKS)
  const filteredBooksResult = useQuery(ALL_BOOKS, {
    variables: {
      genre: genre === "all genres" ? null : genre,
    },
  })

  if (!show) {
    return null
  }

  if (allBooksResult.loading || filteredBooksResult.loading) {
    return <div>loading...</div>
  }

  const books = filteredBooksResult.data.allBooks

  const genres = allBooksResult.data.allBooks
    .reduce((acc, current) => {
      current.genres.forEach((g) => {
        if (!acc.includes(g)) {
          acc.push(g)
        }
      })

      return acc
    }, [])
    .concat("all genres")

  return (
    <div>
      <h2>books</h2>
      <p>
        in genre <b>{genre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex" }}>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setGenre(genre)}>
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books
