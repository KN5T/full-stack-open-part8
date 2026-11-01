import { useQuery } from "@apollo/client/react"
import { ALL_BOOKS } from "../queries"

const Recommendations = ({ show, currentUser }) => {
  const { data, loading } = useQuery(ALL_BOOKS, {
    variables: {
      genre: currentUser?.favoriteGenre,
    },
    skip: !show || !currentUser,
  })

  if (!show) {
    return null
  }

  if (loading || !currentUser) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{currentUser.favoriteGenre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
