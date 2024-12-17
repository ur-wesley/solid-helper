# Simple Guide: Using `createContextStore` in SolidJS

This guide explains how to use the `createContextStore` utility to manage state
and actions with **SolidJS**. Actions have access to both the store and state
updates.

---

## 1. Install SolidJS

Ensure SolidJS is installed in your project:

```bash
npm install solid-js
npm install @ur-wesley/solid-helper
```

---

## 2. Add the `createContextStore` Utility

```ts
import { createContextStore } from "@ur-wesley/solid-helper";
```

---

## 3. Create a Store (Example: Auth Store)

Use the `createContextStore` utility to define a simple **Auth Store**.

### **`authStore.ts`**:

```ts
import { createContextStore } from "@ur-wesley/solid-helper";

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

export default authStore;
```

---

## 4. Use the Store in Your Component

You can now use the `authStore` to access the state and actions in your
components.

### **`App.tsx`**:

```tsx
import authStore from "./authStore";

function App() {
  const [store, actions] = authStore;

  return (
    <div>
      <h1>User: {store.user?.email || "Not logged in"}</h1>
      <h2>Authenticated: {store.isAuthenticated ? "Yes" : "No"}</h2>

      <button onClick={() => actions.login("test@test.com")}>Login</button>
      <button onClick={actions.logout}>Logout</button>
      <button onClick={() => actions.checkAuth()}>Check Authentication</button>
    </div>
  );
}

export default App;
```

---

## How It Works

1. **`createContextStore`**:
   - Dynamically creates a state store with actions.
   - Passes both `store` (current state) and `setStore` (state updater) to the
     actions.
2. **Actions**:
   - Can **read** the current state (`store`) and **update** it using
     `setStore`.
3. **Store Access**:
   - Returns `[store, actions]` as a tuple for easy destructuring.

---

## Example Output

- **Login**: Sets the user and marks the state as authenticated.
- **Logout**: Clears the user and resets authentication.
- **Check Authentication**: Logs and returns the current authentication status.

---

## Benefits of `createContextStore`

- **Reusability**: Use this utility to create different stores easily.
- **Type Safety**: Strong typing ensures actions and state are predictable.
- **Clean API**: Simple `[store, actions]` return structure for components.

---

Now you can use this utility to manage state and actions in your SolidJS
projects efficiently! 🚀
