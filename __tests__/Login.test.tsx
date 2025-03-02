import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Login } from '../src/app/Login';
import { auth } from '../src/config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

jest.mock('firebase/auth');

describe('Login Component', () => {
  it('should register a user', async () => {
    const setUser = jest.fn();
    const { getByPlaceholderText, getByText } = render(<Login setUser={setUser} />);

    fireEvent.changeText(getByPlaceholderText('Endereço de E-mail'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'password123');
    fireEvent.press(getByText('Cadastrar'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
      expect(setUser).toHaveBeenCalled();
    });
  });

  it('should log in a user', async () => {
    const setUser = jest.fn();
    const { getByPlaceholderText, getByText } = render(<Login setUser={setUser} />);

    fireEvent.changeText(getByPlaceholderText('Endereço de E-mail'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
      expect(setUser).toHaveBeenCalled();
    });
  });
});