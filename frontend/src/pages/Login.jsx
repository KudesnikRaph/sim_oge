import { useState } from 'react';
import './Login.css';

const Login = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // тут можно добавить реальный API-запрос
    onSubmit({ email, password });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Войти</button>
    </form>
  );
};

export default Login;
