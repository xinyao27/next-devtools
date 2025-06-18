import React from 'react'

export default function Login() {
  const [email, setEmail] = React.useState('')

  return (
    <div>
      <h1>Login</h1>

      <div>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          value={email}
        />

        <button
          onClick={() => {
            throw new Error('test')
          }}
        >
          throw error
        </button>
      </div>
    </div>
  )
}
