import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('inicio de sesión', () => {
  it('muestra el formulario de acceso', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Inicia sesión' })).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeRequired();
    expect(screen.getByLabelText('Contraseña')).toBeRequired();
  });

  it('muestra al usuario cuando la API valida sus credenciales', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        token: 'token-de-prueba',
        user: { email: 'estudiante@upb.edu', name: 'Estudiante UPB' },
      }),
    });
    render(<App />);

    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'estudiante@upb.edu' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreto' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(await screen.findByText('¡Hola, Estudiante UPB!')).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/auth/login',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('informa cuando las credenciales son incorrectas', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Correo o contraseña incorrectos' }),
    });
    render(<App />);

    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'estudiante@upb.edu' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'incorrecta' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos');
    });
  });
});
