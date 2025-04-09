import { useEffect, useState } from 'react'
import './App.css'
import {ping} from "@/services/api";

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    ping()
    .then((res) => setMessage(res.data.message))
    .catch(() => setMessage("Failed to connect to backend"))
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "4rem"}}>
      <h1>DiaGuard (Vite + React)</h1>
      <p>Backend says: <strong>{message}</strong></p>
    </div>
  )
}

export default App
