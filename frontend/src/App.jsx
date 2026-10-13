import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Backend connection failed'));
  }, []);

  return (
    <main>
      <h1>React + Node.js</h1>
      <p>{message}</p>
    </main>
  );
}

export default App;
