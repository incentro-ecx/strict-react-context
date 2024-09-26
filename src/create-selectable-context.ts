"use client";

import type { Provider } from "react";
import { createContext, useContextSelector } from "use-context-selector";

export type SelectableContextProvider<Value> = Provider<Value>;

export type SelectableContextHook<Value> = {
  (): Value;
  <Selected>(selector: (value: Value) => Selected): Selected;
};

export type SelectableContext<Value> = [
  Provider: Provider<Value>,
  useContext: SelectableContextHook<Value>,
];

/**
 * A small wrapper around
 * [`use-context-selector`](https://github.com/dai-shi/use-context-selector)
 * that returns a provider / hook pair instead of a context object.
 *
 * @example
 * ```tsx
 * interface User {
 *   name: string;
 * };
 *
 * const [UserProvider, useUser] = createSelectableContext<User | null>(null);
 *
 * function Name() {
 *   // component only rerenders if the user's name changes
 *   const name = useUser((user) => user.name);
 *   return <h1>{name}</h1>;
 * }
 * ```
 */
export function createSelectableContext<Value = unknown>(
  defaultValue: Value,
  displayName?: string,
): SelectableContext<Value> {
  const Context = createContext(defaultValue);

  if (displayName !== undefined) {
    Context.displayName = displayName;
  }

  function useContext<Selected = unknown>(
    selector?: (value: Value) => Selected,
  ): Selected {
    // Our function overloading will make sure the return type is correct
    const defaultSelector = (value: Value) => value as unknown as Selected;
    const defaultedSelector = selector ?? defaultSelector;

    return useContextSelector<Value, Selected>(Context, defaultedSelector);
  }

  return [Context.Provider as Provider<Value>, useContext];
}
