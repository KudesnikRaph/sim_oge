import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // для матчеров типа .toBeInTheDocument()
import CreateVariantForm from '../src/components/CreateVariantForm';
import { act } from 'react';

global.fetch = jest.fn();
global.alert = jest.fn();

describe('CreateVariantForm', () => {
  const mockQuestions = [
    {
      id: 1,
      text: "Сколько будет 2+2?",
      body: "Пример тела вопроса",
      topic: { name: "Математика" },
    },
    {
      id: 2,
      text: "Какой элемент обозначается как H?",
      body: "Пример тела вопроса о водороде",
      topic: { name: "Химия" },
    }
  ];

  const mockTopics = [
    { id: 1, name: "Математика" },
    { id: 2, name: "Химия" },
  ];

  beforeEach(() => {
    fetch.mockClear();
    window.alert.mockClear();

    fetch.mockImplementation((url) => {
      if (url === '/api/questions') {
        return Promise.resolve({ json: () => Promise.resolve(mockQuestions) });
      }

      if (url === '/api/topics') {
        return Promise.resolve({ json: () => Promise.resolve(mockTopics) });
      }

      if (url === '/api/variants') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }

      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });
  });

  test('рендерит заголовок формы', async () => {
    await act(async () => {
      render(<CreateVariantForm />);
    });

    expect(screen.getByText(/Создать новый вариант/i)).toBeInTheDocument();
  });

  test('рендерит поля формы', async () => {
    await act(async () => {
      render(<CreateVariantForm />);
    });

    expect(screen.getByTestId('variant-name')).toBeInTheDocument();
    expect(screen.getByTestId('topic-filter')).toBeInTheDocument();
    expect(screen.getByTestId('search-term')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  test('рендерит список вопросов после загрузки данных', async () => {
    await act(async () => {
      render(<CreateVariantForm />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('question-checkbox-1')).toBeInTheDocument();
      expect(screen.getByTestId('question-checkbox-2')).toBeInTheDocument();
    });
  });

  test('выбор темы фильтрует вопросы', async () => {
    await act(async () => {
      render(<CreateVariantForm />);
    });

    const topicSelect = screen.getByTestId('topic-filter');
    fireEvent.change(topicSelect, { target: { value: 'Математика' } });

    await waitFor(() => {
      expect(screen.getByTestId('question-checkbox-1')).toBeInTheDocument();
      expect(screen.queryByTestId('question-checkbox-2')).not.toBeInTheDocument();
    });
  });

  test('поиск по тексту фильтрует вопросы', async () => {
    await act(async () => {
      render(<CreateVariantForm />);
    });

    const searchInput = screen.getByTestId('search-term');
    fireEvent.change(searchInput, { target: { value: '2+2' } });

    await waitFor(() => {
      expect(screen.getByTestId('question-checkbox-1')).toBeInTheDocument();
      expect(screen.queryByTestId('question-checkbox-2')).not.toBeInTheDocument();
    });
  });

  test('выбор вопроса добавляет его в selectedQuestions', async () => {
    await act(async () => {
      render(<CreateVariantForm />);
    });

    const checkbox = screen.getByTestId('question-checkbox-1');
    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

});