## Simple Guide: Using `createProvider` in SolidJS

This guide demonstrates how to use the `createProvider` utility to create a
reusable provider for managing state and actions in SolidJS.

---

### 1. Install Dependencies

Ensure you have SolidJS and solid-helper installed in your project:

```bash
npm install solid-js
npm install @ur-wesley/solid-helper
```

---

### 2. Import the `createProvider` Function

Here is the utility function for creating a **store with actions** and a
provider:

```tsx
import { createProvider } from "@ur-wesley/solid-helper";
```

---

### 3. Create a Specific Store (e.g., AuthProvider)

Use `createProvider` to create a provider for authentication state and actions.

#### **`AuthProvider.tsx`**:

```tsx
import { createProvider } from "@ur-wesley/solid-helper";
import Api from "@/api/index"; // Your API module

// Define types
type User = { id: string; email: string };
type Credentials = { email: string; password: string };

type AuthStore = { user: User | null };
type AuthActions = {
  login: (creds: Credentials) => Promise<User | null>;
  logout: () => void;
  refresh: () => Promise<User | null>;
};

// Create the provider
const { Provider: AuthProvider, useStore: useAuthStore } = createProvider<
  AuthStore,
  AuthActions
>(
  { user: null }, // Initial state
  (store, setStore) => {
    const navigate = useNavigate();

    return {
      login: async (creds) => {
        const user = await Api.Auth.login(creds.email, creds.password);
        if (user) {
          setStore("user", user);
          return user;
        }
        setStore("user", null);
        return null;
      },
      logout: () => {
        Api.Auth.logout();
        setStore("user", null);
      },
      refresh: async () => {
        const user = await Api.Auth.refresh();
        if (user) {
          setStore("user", user);
          return user;
        }
        setStore("user", null);
        return null;
      },
    };
  },
);

export { AuthProvider, useAuthStore };
```

---

### 4. Wrap Your Application with the Provider

Wrap your app or a section of your app with the `AuthProvider` to provide access
to the store and actions.

#### **`main.tsx`**:

```tsx
import { render } from "solid-js/web";
import { AuthProvider } from "./AuthProvider";
import App from "./App";

render(
  () => (
    <AuthProvider>
      <App />
    </AuthProvider>
  ),
  document.getElementById("root")!,
);
```

---

### 5. Use the Store and Actions in Your Components

Access the store and actions using the `useAuthStore` hook.

#### **`App.tsx`**:

```tsx
import { useAuthStore } from "./AuthProvider";

function App() {
  const [store, actions] = useAuthStore();

  return (
    <div>
      <h1>User: {store.user?.email || "Not logged in"}</h1>
      <button
        onClick={() =>
          actions.login({ email: "test@test.com", password: "1234" })
        }
      >
        Login
      </button>
      <button onClick={actions.logout}>Logout</button>
      <button onClick={actions.refresh}>Refresh User</button>
    </div>
  );
}

export default App;
```

### Summary

With this setup:

1. `createProvider` generates a reusable context, store, and actions.
2. The store and actions are strongly typed using TypeScript.
3. You can use the `useAuthStore` hook to access state and actions in
   components.

This approach keeps your state management clean, reusable, and easy to extend.
🚀

---
