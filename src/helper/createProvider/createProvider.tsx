import { createContext, JSXElement, useContext } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

type StoreType = Record<string, any>;
type ActionsType = Record<string, (...args: any[]) => any>;

/**
 * Creates a SolidJS context provider with a store and actions.
 *
 * @template TStore - Type of the store state.
 * @template TActions - Type of the actions object.
 *
 * @param {TStore} initialState - The initial state for the store.
 * @param {(store: TStore, setStore: SetStoreFunction<TStore>) => TActions} createActions
 *        A function that defines actions with access to the store and state updater.
 *
 * @returns {{ Provider: (props: { children: JSXElement }) => JSX.Element, useStore: () => [TStore, TActions] }}
 *          An object containing the `Provider` component and the `useStore` hook.
 */
export default function createProvider<
  TStore extends StoreType,
  TActions extends ActionsType,
>(
  initialState: TStore,
  createActions: (
    store: TStore,
    setStore: SetStoreFunction<TStore>,
  ) => TActions,
) {
  const StoreContext = createContext<[TStore, TActions] | null>(null);

  const Provider = (props: { children: JSXElement }) => {
    const [store, setStore] = createStore<TStore>(initialState);
    const actions = createActions(store, setStore);

    return (
      <StoreContext.Provider value={[store, actions]}>
        {props.children}
      </StoreContext.Provider>
    );
  };

  const useStore = (): [TStore, TActions] => {
    const context = useContext(StoreContext);
    if (!context) {
      throw new Error("useStore must be used within a Provider");
    }
    return context;
  };

  return { Provider, useStore };
}
