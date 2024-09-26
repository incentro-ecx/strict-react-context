"use client";

import type { Provider } from "react";
import type { SelectableContext } from "./create-selectable-context.js";
import { createSelectableContext } from "./create-selectable-context.js";
import { EMPTY } from "./empty.symbol.js";
import { throwIfEmpty } from "./throw-if-empty.js";

/**
 * Creates a provider / hook pair with React context in which the hook will
 * throw an error if it is called without being wrapped around a provider. It
 * uses {@link createSelectableContext} under the hood, so the hook accepts a
 * selector function to listen to a slice of the context.
 *
 * @param displayName - The display name of the context when shown within React
 * DevTools.
 *
 * @returns An array where the first element is the provider and the second
 * element is the hook that accepts an optional selector.
 *
 * @example
 * ```tsx
 * interface User {
 *   name: string
 * };
 *
 * const [UserProvider, useUser] = createStrictSelectableContext<User>();
 *
 * function Name() {
 *   const name = useUser(user => user.name);
 *   return <h1>{name}</h1>;
 * }
 *
 * // Does not throw an error
 * <UserProvider value={{ name: "John Doe" }}>
 *   <Name />
 * </UserProvider>
 *
 * // Throws an error
 * <Name />
 * ```
 */
export function createStrictSelectableContext<Value = unknown>(
  displayName?: string,
): SelectableContext<Value> {
  const [ContextProvider, useContext] = createSelectableContext<
    Value | typeof EMPTY
  >(EMPTY, displayName);

  function useStrictSelectableContext<Selected = unknown>(
    selector?: (value: Value) => Selected,
  ): Selected {
    // Our function overloading will make sure the return type is correct
    const value = useContext(
      selector as (value: typeof EMPTY | Value) => Selected,
    );

    throwIfEmpty(value, displayName);

    return value;
  }

  return [ContextProvider as Provider<Value>, useStrictSelectableContext];
}
