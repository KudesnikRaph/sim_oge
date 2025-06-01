// Полифилы для react-router-dom
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../src/components/Header';

// Мокаем react-router-dom
jest.mock('react-router-dom', () => ({
  Link: ({ children }) => <>{children}</>,
}));

// Мокаем изображения
jest.mock('../src/assets/logo.png', () => 'logo.png');
jest.mock('../src/assets/peter.png', () => 'peter.png');
jest.mock('../src/assets/book.png', () => 'book.png');
jest.mock('../src/assets/OrangeProfile.png', () => 'profile.png');

// Мокаем страницы
jest.mock('../src/pages/Login.jsx', () => () => <div data-testid="login-form">Форма входа</div>);
jest.mock('../src/pages/Register.jsx', () => () => <div data-testid="register-form">Форма регистрации</div>);

// Мокаем контекст — объявляем его один раз
jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    stats: {},
  }),
}));

describe('Header Component', () => {
  const renderWithAuth = (authState = { user: null, stats: {} }) => {
    jest.doMock('../src/contexts/AuthContext', () => ({
      useAuth: () => authState,
    }));
    
    // Перезагружаем Header после мока
    jest.isolateModules(() => {
      jest.resetModules();
      const mockHeader = require('../src/components/Header').default;
      render(<mockHeader />);
    });
  };

  test('должен рендерить логотип и подзаголовок', () => {
    render(<Header />);

    const logo = screen.getByAltText('logo');
    const subtitle = screen.getByText('История России');

    expect(logo).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
  });

  test('должен отображать кнопки "Войти" и "Регистрация", если пользователь не авторизован', () => {
    render(<Header />);

    const loginBtn = screen.getByText('Войти');
    const registerBtn = screen.getByText('Регистрация');

    expect(loginBtn).toBeInTheDocument();
    expect(registerBtn).toBeInTheDocument();
  });

  test('должен отображать форму входа при клике на "Войти"', () => {
    render(<Header />);

    const loginBtn = screen.getByText('Войти');
    fireEvent.click(loginBtn);

    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toBeInTheDocument();
  });

  test('должен скрывать одну форму и показывать другую при переключении', () => {
    render(<Header />);

    const registerBtn = screen.getByText('Регистрация');
    fireEvent.click(registerBtn);
    let registerForm = screen.getByTestId('register-form');
    expect(registerForm).toBeInTheDocument();

    const loginBtn = screen.getByText('Войти');
    fireEvent.click(loginBtn);

    registerForm = screen.queryByTestId('register-form');
    const loginForm = screen.getByTestId('login-form');

    expect(loginForm).toBeInTheDocument();
    expect(registerForm).not.toBeInTheDocument();
  });

  test('должен отображать изображения book и peter', () => {
    render(<Header />);

    const bookImg = screen.getByAltText('Книги');
    const peterImg = screen.getByAltText('Пётр Первый');

    expect(bookImg).toBeInTheDocument();
    expect(peterImg).toBeInTheDocument();
  });
});

