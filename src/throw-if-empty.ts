import { EMPTY } from "./empty.symbol.js";

export function throwIfEmpty<Value>(
  value: Value | typeof EMPTY,
  displayName?: string,
): asserts value is Value {
  if (value !== EMPTY) return;

  const hasDisplayName =
    typeof displayName === "string" && displayName.length > 0;

  const message = hasDisplayName
    ? `The use${displayName} hook was called without being wrapped around a \`${displayName}Provider\`.`
    : `A useContext hook was called without it being wrapped with a provider.`;

  throw new Error(message);
}
