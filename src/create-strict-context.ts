"use client";

import { createContext, useContext, type Provider } from "react";
import { EMPTY } from "./empty.symbol.js";
import { throwIfEmpty } from "./throw-if-empty.js";

/**
 * Creates a provider / hook pair with React context in which the hook will
 * throw an error if it is called without being wrapped around a provider.
 *
 * This avoids unnecessary checks for `undefined` after calling the hook.
 *
 * @param displayName - The display name of the context when shown within React
 * DevTools.
 *
 * @returns An array where the first element is the provider and the second
 * element is the hook.
 *
 * @example
 * ```tsx
 * const [NameProvider, useName] = createStrictContext<string>();
 *
 * function Name() {
 *   const name = useName();
 *   return <h1>{name}</h1>;
 * }
 *
 * // Does not throw an error
 * <NameProvider value="John Doe">
 *   <Name />
 * </NameProvider>
 *
 * // Throws an error
 * <Name />
 * ```
 */
export function createStrictContext<Value>(
  displayName?: string,
): [provider: Provider<Value>, hook: () => Value] {
  const Context = createContext<typeof EMPTY | Value>(EMPTY);

  if (displayName !== undefined) {
    Context.displayName = displayName;
  }

  function useStrictContext(): Value {
    const value = useContext(Context);

    throwIfEmpty(value, displayName);

    return value;
  }

  return [Context.Provider as Provider<Value>, useStrictContext];
}
