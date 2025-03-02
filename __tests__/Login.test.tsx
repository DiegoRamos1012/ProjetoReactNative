import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Login } from "../src/app/Login";
import { auth } from "../src/config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Mock Firebase auth explicitamente
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: { uid: "test-uid", email: "test@example.com" },
  }),
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: { uid: "test-uid", email: "test@example.com" },
  }),
}));

// Mock de firebaseConfig para fornecer o objeto auth
jest.mock("../src/config/firebaseConfig", () => ({
  auth: {},
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a user", async () => {
    const mockSetUser = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <Login setUser={mockSetUser} />
    );

    fireEvent.changeText(
      getByPlaceholderText("Endereço de E-mail"),
      "test@example.com"
    );
    fireEvent.changeText(getByPlaceholderText("Senha"), "password123");

    fireEvent.press(getByText("Cadastrar"));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "test@example.com",
        "password123"
      );
      expect(mockSetUser).toHaveBeenCalled();
    });
  });

  it("should validate email format", async () => {
    const mockSetUser = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <Login setUser={mockSetUser} />
    );

    // Test with invalid email
    fireEvent.changeText(
      getByPlaceholderText("Endereço de E-mail"),
      "invalid-email"
    );
    fireEvent.changeText(getByPlaceholderText("Senha"), "password123");

    // Mock alert function to verify it's called
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    fireEvent.press(getByText("Cadastrar"));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("E-mail inválido");
      expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
    });
  });

  it("should log in a user", async () => {
    const setUser = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <Login setUser={setUser} />
    );

    fireEvent.changeText(
      getByPlaceholderText("Endereço de E-mail"),
      "test@example.com"
    );
    fireEvent.changeText(getByPlaceholderText("Senha"), "password123");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "test@example.com",
        "password123"
      );
      expect(setUser).toHaveBeenCalled();
    });
  });
});
