import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const fields = ['name', 'email', 'password']

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData((prev) => ({...prev, [name]: value}))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormErrors(validate(formData))
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitted(true)
    } else {
      setIsSubmitted(false)
    }
    console.log(formData)
  }

  useEffect(() => {
    console.log(formErrors)
    if (Object.keys(formErrors).length === 0 && isSubmitted) {
      console.log(formData)
    }
  }, [formErrors])

  const validate = (data) => {
    const errors = {}
    if (!data.name) {
      errors.name = 'username is required'
    }
    if (!data.email) {
      errors.email = 'email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'email is not in valid format'
    }
    if (!data.password) {
      errors.password = 'password is required'
    } else if (data.password.length < 8) {
      errors.password = 'password must be 8 characters'
    }
    return errors
  }

  return (
    <div
      style={{
        padding: '20px',
        width: '400px',
        margin: '0 auto',
        border: '1px solid grey',
      }}
    >
      {Object.keys(formErrors).length === 0 && isSubmitted ? (
        <div>Signed in Successfully</div>
      ) : (
        <pre>{JSON.stringify(formData, undefined, 2)}</pre>
      )}
      <form onSubmit={handleSubmit}>
        <h1>Login Form</h1>
        {fields.map((f) => (
          <div
            key={f}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            <label htmlFor={f}>{f}</label>
            <input
              id={f}
              name={f}
              type={f === 'password' ? 'password' : 'text'}
              placeholder={f}
              value={formData[f]}
              onChange={handleChange}
              style={{margin: '8px 0'}}
            />
            {formErrors[f] && (
              <span style={{color: 'red'}}>{formErrors[f]}</span>
            )}
          </div>
        ))}
        <button type="submit" style={{marginTop: '20px'}}>
          Submit
        </button>
      </form>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
