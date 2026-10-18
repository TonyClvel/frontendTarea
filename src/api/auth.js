const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export async function iniciarSesion(credenciales) {
  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credenciales),
    });
  } catch {
    throw new Error('No pudimos conectar con el servidor. Intenta nuevamente.');
  }

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No fue posible iniciar sesión.');
  }

  return datos;
}
