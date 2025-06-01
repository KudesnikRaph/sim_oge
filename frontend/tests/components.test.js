import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateQuestionForm from '../src/components/CreateQuestionForm';
import { act } from 'react';

// Мокаем fetch и alert
global.fetch = jest.fn();
window.alert = jest.fn();

describe('CreateQuestionForm', () => {
  beforeEach(() => {
    fetch.mockClear();
    window.alert.mockClear();

    // Мокаем успешный ответ от /api/topics
    fetch.mockResolvedValueOnce({
      json: async () => [
        { id: '1', name: 'Математика' },
        { id: '2', name: 'Физика' },
      ],
    });
  });

  test('рендерит заголовок формы', async () => {
    await act(async () => {
      render(<CreateQuestionForm />);
    });

    expect(screen.getByText(/Создать новый вопрос/i)).toBeInTheDocument();
  });

  test('рендерит все поля формы', async () => {
    await act(async () => {
      render(<CreateQuestionForm />);
    });

    expect(screen.getByLabelText(/текст вопроса/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/содержание/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/загрузить изображение/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/правильный ответ/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/тип ответа/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/тема/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /создать вопрос/i })).toBeInTheDocument();
  });

  test('выбор темы из выпадающего списка', async () => {
    await act(async () => {
      render(<CreateQuestionForm />);
    });

    const topicSelect = screen.getByLabelText(/тема/i);
    expect(topicSelect).toHaveValue('');
    fireEvent.change(topicSelect, { target: { value: '1' } });
    expect(topicSelect.value).toBe('1');
  });

  test('обновляет поле "text" при вводе текста', async () => {
    await act(async () => {
      render(<CreateQuestionForm />);
    });

    const textInput = screen.getByLabelText(/текст вопроса/i);
    fireEvent.change(textInput, { target: { value: 'Новый вопрос' } });
    expect(textInput).toHaveValue('Новый вопрос');
  });

  test('отправляет форму с данными', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ success: true }),
    });

    await act(async () => {
      render(<CreateQuestionForm />);
    });

    const textInput = screen.getByLabelText(/текст вопроса/i);
    const answerInput = screen.getByLabelText(/правильный ответ/i);
    const topicSelect = screen.getByLabelText(/тема/i);
    const submitButton = screen.getByRole('button', { name: /создать вопрос/i });

    fireEvent.change(textInput, { target: { value: 'Пример текста' } });
    fireEvent.change(answerInput, { target: { value: 'Пример ответа' } });
    fireEvent.change(topicSelect, { target: { value: '1' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/questions', expect.objectContaining({
        method: 'POST',
      }));
    });

    expect(window.alert).toHaveBeenCalledWith('Question created successfully!');

    // Проверяем, что поля очищены
    await waitFor(() => {
      expect(textInput).toHaveValue('');
      expect(answerInput).toHaveValue('');
      expect(topicSelect).toHaveValue('');
    });
  });

  test('не отправляет форму, если тема не выбрана', async () => {
    await act(async () => {
      render(<CreateQuestionForm />);
    });

    const textInput = screen.getByLabelText(/текст вопроса/i);
    const answerInput = screen.getByLabelText(/правильный ответ/i);
    const topicSelect = screen.getByLabelText(/тема/i);
    const submitButton = screen.getByRole('button', { name: /создать вопрос/i });

    fireEvent.change(textInput, { target: { value: 'Пример текста' } });
    fireEvent.change(answerInput, { target: { value: 'Пример ответа' } });
    fireEvent.change(topicSelect, { target: { value: '' } }); // Тема не выбрана
    fireEvent.click(submitButton);

    // Проверяем, что fetch НЕ был вызван с '/api/questions'
    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalledWith('/api/questions', expect.objectContaining({
        method: 'POST',
      }));
    });

    expect(window.alert).not.toHaveBeenCalled();
  });
});