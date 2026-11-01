import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { UPDATE_BIRTHYEAR } from "../queries"

const BirthyearForm = ({ authors }) => {
  const [name, setName] = useState(authors[0]?.name || "")
  const [born, setBorn] = useState("")

  const [updateBirthyear] = useMutation(UPDATE_BIRTHYEAR)

  const submit = (event) => {
    event.preventDefault()

    updateBirthyear({ variables: { name, born: Number(born) } })

    setBorn("")
  }

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <select
            value={name}
            name="name"
            onChange={({ target }) => setName(target.value)}
          >
            {authors.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="born">born</label>
          <input
            id="born"
            name="born"
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default BirthyearForm
