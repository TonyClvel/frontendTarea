import { useState } from 'react';
import { iniciarSesion } from './api/auth';

const STORAGE_KEY = 'upb-session';

function leerSesion() {
  try {
    const sesionGuardada = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!sesionGuardada?.token || !sesionGuardada?.user || sesionGuardada.expiresAt <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return sesionGuardada;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (event) => {
    event.preventDefault();
    setError('');
    setCargando(true);

    try {
      const sesion = await iniciarSesion({ email, password });
      onLogin(sesion);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form className="login-form" onSubmit={enviar}>
      <div className="field">
        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nombre@upb.edu"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={cargando}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="password">Contraseña</label>
        <div className="password-field">
          <input
            id="password"
            name="password"
            type={mostrarPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={cargando}
            required
          />
          <button
            className="toggle-password"
            type="button"
            onClick={() => setMostrarPassword((visible) => !visible)}
            aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {mostrarPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </div>

      {error && <p className="error-message" role="alert">{error}</p>}

      <button className="submit-button" type="submit" disabled={cargando}>
        {cargando ? <><span className="spinner" />Ingresando...</> : 'Iniciar sesión'}
      </button>
    </form>
  );
}

function App() {
  const [sesion, setSesion] = useState(leerSesion);

  const guardarSesion = (nuevaSesion) => {
    const sesionConExpiracion = {
      ...nuevaSesion,
      expiresAt: Date.now() + (nuevaSesion.expiresIn || 3600) * 1000,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sesionConExpiracion));
    setSesion(sesionConExpiracion);
  };

  const cerrarSesion = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSesion(null);
  };

  if (sesion) {
    return (
      <main className="app-shell">
        <section className="welcome-card">
          <div className="success-icon" aria-hidden="true">✓</div>
          <p className="eyebrow">Sesión iniciada</p>
          <h1>¡Hola, {sesion.user.name}!</h1>
          <p className="welcome-copy">
            El frontend se conectó correctamente con la API y tu acceso fue validado.
          </p>
          <div className="user-summary">
            <span>Cuenta activa</span>
            <strong>{sesion.user.email}</strong>
          </div>
          <button className="secondary-button" type="button" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="login-card">
        <aside className="brand-panel">
          <div className="brand-mark">UPB</div>
          <div>
            <p className="eyebrow light">Portal académico</p>
            <h1>Todo listo para continuar.</h1>
            <p>Accede de forma segura a tu espacio de trabajo.</p>
          </div>
          <small>Proyecto de certificación · 2026</small>
        </aside>

        <div className="form-panel">
          <div className="mobile-brand">UPB</div>
          <p className="eyebrow">Bienvenido</p>
          <h2>Inicia sesión</h2>
          <p className="form-intro">Usa las credenciales configuradas por el administrador.</p>
          <LoginForm onLogin={guardarSesion} />
          <p className="security-note"><span>●</span> Conexión protegida con token de acceso</p>
        </div>
      </section>
    </main>
  );
}

export default App;
