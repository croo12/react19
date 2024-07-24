import { useState } from 'react';
import './App.css'

export const App = () => {

  const [count, setCount] = useState(0);

  return (
    <>
      <h1>React19RC Research</h1>
      <button onClick={() => setCount(prev => prev + 1)}>{count}</button>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
