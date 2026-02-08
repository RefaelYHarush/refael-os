import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LandingView } from './LandingView';
import { ThemeProvider } from '../context/ThemeContext';

function renderWithTheme(ui) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<ThemeProvider>{ui}</ThemeProvider>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('LandingView', () => {
  it('renders brand name REFAEL OS', () => {
    renderWithTheme(<LandingView onSignUp={vi.fn()} onSignIn={vi.fn()} />);
    expect(screen.getByText('REFAEL OS')).toBeInTheDocument();
  });

  it('renders main CTA הרשמה בחינם', () => {
    renderWithTheme(<LandingView onSignUp={vi.fn()} onSignIn={vi.fn()} />);
    const ctas = screen.getAllByRole('button', { name: /הרשמה בחינם/i });
    expect(ctas.length).toBeGreaterThanOrEqual(1);
  });

  it('renders sign-in button כבר יש לך חשבון', () => {
    renderWithTheme(<LandingView onSignUp={vi.fn()} onSignIn={vi.fn()} />);
    expect(screen.getByRole('button', { name: /כבר יש לך חשבון\? התחבר/i })).toBeInTheDocument();
  });

  it('renders מה תקבל section', () => {
    renderWithTheme(<LandingView onSignUp={vi.fn()} onSignIn={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'מה תקבל' })).toBeInTheDocument();
  });
});
