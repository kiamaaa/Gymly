import { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (token) loadWorkouts();
  }, [token]);

  async function loadWorkouts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/workouts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Could not load workouts');
      const data = await res.json();
      setWorkouts(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAuth(e) {
    e.preventDefault();
    setError(null);
    try {
      const endpoint = isRegistering ? '/api/register' : '/api/login';
      const body = isRegistering ? { username, email, password } : { email, password };

      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      const data = await res.json();

      localStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setToken(null);
    setWorkouts([]);
  }

  async function handleAddWorkout(e) {
    e.preventDefault();
    await fetch(`${BASE_URL}/api/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, date, exercises: [] }),
    });
    setName('');
    setDate('');
    loadWorkouts();
  }

  if (!token) {
    return (
      <div>
        <h1 className="brand">GYMLY</h1>
        <h2>{isRegistering ? 'Register' : 'Log In'}</h2>
        <form onSubmit={handleAuth}>
          {isRegistering && (
            <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          )}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">{isRegistering ? 'Register' : 'Log In'}</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Have an account? Log in' : 'No account? Register'}
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleLogout}>Log Out</button>

      <h2>Add a Workout</h2>
      <form onSubmit={handleAddWorkout}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <button type="submit">Add</button>
      </form>

      <h2>Your Workouts</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {workouts.map((w) => <li key={w.id}>{w.name} — {w.date}</li>)}
      </ul>
    </div>
  );
}