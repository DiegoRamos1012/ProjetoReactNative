import "react-native-gesture-handler/jestSetup";
import "@testing-library/jest-native/extend-expect";

// Mock para o Firebase Auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: { uid: "test-uid", email: "test@example.com" },
  }),
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: { uid: "test-uid", email: "test@example.com" },
  }),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
}));

// Mock para react-native components
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// Silencia warnings específicos
jest.spyOn(console, "warn").mockImplementation((message) => {
  if (message.includes("Warning:")) return;
  console.warn(message);
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);
