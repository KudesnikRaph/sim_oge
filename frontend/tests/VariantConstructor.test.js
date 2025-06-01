import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../src/components/Footer';

jest.mock('../src/components/Footer.css', () => {});
jest.mock('../src/assets/logo.png', () => '');

describe('Footer Component', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  test('должен рендерить логотип с правильным alt-текстом', () => {
    const logo = screen.getByAltText('Логотип');
    expect(logo).toBeInTheDocument();
  });

  test('должен отображать заголовок "О проекте"', () => {
    const title = screen.getByText('О проекте');
    expect(title).toBeInTheDocument();
  });

  test('должен содержать описание проекта', () => {
    const description = screen.getByText(/Этот проект создан для подготовки к ОГЭ по истории России/i);
    expect(description).toBeInTheDocument();
  });

  test('должен отображать ссылки на разработчиков', () => {
    const developer1 = screen.getByRole('link', { name: 'Даниил К.' });
    const developer2 = screen.getByRole('link', { name: 'Иоан П.' });

    expect(developer1).toBeInTheDocument();
    expect(developer2).toBeInTheDocument();

    expect(developer1).toHaveAttribute('href', 'https://github.com/KudesnikRaph');
    expect(developer2).toHaveAttribute('href', 'https://github.com/driveGosling');
  });

  test('должен отображать источники с правильными ссылками', () => {
    const source1 = screen.getByRole('link', { name: 'Учитель' });
    const source2 = screen.getByRole('link', { name: 'Электронная библиотека' });
    const source3 = screen.getByRole('link', { name: 'История государства россии' }); // Точный текст из DOM

    expect(source1).toBeInTheDocument();
    expect(source2).toBeInTheDocument();
    expect(source3).toBeInTheDocument();

    expect(source1).toHaveAttribute('href', 'https://uchitel.pro/история-россии-предмет');
    expect(source2).toHaveAttribute('href', 'https://www.universalinternetlibrary.ru/book/46892/ogl.shtml?ysclid=m9mus68489801928238/');
    expect(source3).toHaveAttribute('href', 'https://www.rusempire.ru/istoriya-rossii-kratko.html/');
  });

  test('должен отображать все три колонки футера', () => {
    const columns = screen.getAllByRole('heading', { level: 3 });
    expect(columns.length).toBe(3);

    const titles = columns.map(col => col.textContent);
    expect(titles).toContain('О проекте');
    expect(titles).toContain('Разработка');
    expect(titles).toContain('Источники');
  });
});