import { useState } from "react"
import { useApolloClient, useQuery } from "@apollo/client/react"
import Notify from "./components/Notify"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import Recommendations from "./components/Recommendations"
import { ME } from "./queries"

const App = () => {
  const client = useApolloClient()
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(localStorage.getItem("library-user-token"))
  const [errorMessage, setErrorMessage] = useState(null)
  const userResult = useQuery(ME, {
    skip: !token,
  })

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.clearStore()
    setPage("authors")
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {!token && <button onClick={() => setPage("login")}>login</button>}
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && (
          <button onClick={() => setPage("recommend")}>recommend</button>
        )}
        {token && <button onClick={onLogout}>logout</button>}
      </div>
      <Notify errorMessage={errorMessage} />
      <Authors isLogged={token ? true : false} show={page === "authors"} />

      <Books show={page === "books"} />

      <LoginForm
        setError={notify}
        setPage={setPage}
        setToken={setToken}
        show={page === "login"}
      />

      <NewBook show={page === "add"} />

      <Recommendations
        show={page === "recommend"}
        currentUser={userResult.data?.me}
      />
    </div>
  )
}

export default App
