import { createRoot } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

type StoreType = Record<string, any>;
type ActionsType = Record<string, (...args: any[]) => any>;

/**
 * Utility function to create a SolidJS context store.
 * @param initialState - The initial state for the store.
 * @param createActions - A function to define actions for the store.
 * @returns A tuple of [store, actions] wrapped in createRoot.
 */
export default function createContextStore<
  TStore extends StoreType,
  TActions extends ActionsType,
>(
  initialState: TStore,
  createActions: (
    store: TStore,
    setStore: SetStoreFunction<TStore>,
  ) => TActions,
) {
  const context = () => {
    const [store, setStore] = createStore<TStore>(initialState);
    const actions = createActions(store, setStore);

    return [store, actions] as const;
  };

  return createRoot(context);
}
