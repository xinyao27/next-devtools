import React from 'react'

export default function Login() {
  const [email, setEmail] = React.useState('')

  return (
    <div>
      <h1>Login</h1>

      <div>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

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
