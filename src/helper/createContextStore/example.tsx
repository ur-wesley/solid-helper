import { createContextStore } from "../../index.js";

type User = { id: string; email: string } | null;

type AuthStore = {
  user: User;
  isAuthenticated: boolean;
};

type AuthActions = {
  login: (email: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
};

// Initial state
const initialAuthState: AuthStore = {
  user: null,
  isAuthenticated: false,
};

// Create the Auth store
const authStore = createContextStore<AuthStore, AuthActions>(
  initialAuthState,
  (store, setStore) => ({
    login: (email) => {
      const user = { id: "123", email };
      setStore("user", user);
      setStore("isAuthenticated", true);
      console.log("User logged in:", store.user);
    },
    logout: () => {
      setStore("user", null);
      setStore("isAuthenticated", false);
      console.log("User logged out. Authenticated:", store.isAuthenticated);
    },
    checkAuth: () => {
      console.log("Authentication check:", store.isAuthenticated);
      return store.isAuthenticated;
    },
  }),
);

function App() {
  const [$store, actions] = authStore;
  //  or just
  //  const [$store, { logout }] = useAuthStore();

  return (
    <div>
      <h1>User: {$store.user?.email || "Not logged in"}</h1>
      <h2>Authenticated: {$store.isAuthenticated ? "Yes" : "No"}</h2>

      <button onClick={() => actions.login("test@test.com")}>Login</button>
      <button onClick={actions.logout}>Logout</button>
      <button onClick={() => actions.checkAuth()}>Check Authentication</button>
    </div>
  );
}

export default App;
