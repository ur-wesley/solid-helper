import { createProvider } from "./createProvider";
import { render } from "solid-js/web";

type AuthStore = {
  user: string | null;
};

type AuthActions = {
  logout: () => void;
};

// Create AuthProvider using createProvider
const { Provider: AuthProvider, useStore: useAuthStore } = createProvider<
  AuthStore,
  AuthActions
>(
  { user: null }, // Initial state
  (store, setStore) => {
    return {
      logout: () => {
        console.log(`Logging out user: ${store.user}`);
        setStore("user", null);
      },
    };
  },
);

function App() {
  const [$store, actions] = useAuthStore();

  return (
    <div>
      <h1>User: {$store.user || "Not logged in"}</h1>
      <button onClick={() => actions.logout()}>Logout</button>
    </div>
  );
}

render(
  () => (
    <AuthProvider>
      <App />
    </AuthProvider>
  ),
  document.getElementById("root")!,
);
