import { renderHook } from "@testing-library/react";
import { type PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";
import { createStrictContext } from "./create-strict-context.js";

describe("createStrictContext", () => {
  it("returns a provider/hook pair where the hook returns the value when provided", () => {
    const [Provider, useContext] = createStrictContext<string>();

    function ProviderWithValue({ children }: PropsWithChildren): JSX.Element {
      return <Provider value="test">{children}</Provider>;
    }

    const { result } = renderHook(() => useContext(), {
      wrapper: ProviderWithValue,
    });

    expect(result.current).toBe("test");
  });

  it("returns a provider/hook pair where the hook throws an error when no value is provided", () => {
    // Surpress React / JSDom warnings / errors
    const consoleError = vi.spyOn(console, "error").mockReturnValue();
    const consoleWarn = vi.spyOn(console, "warn").mockReturnValue();

    const [, useContext] = createStrictContext<string>();

    expect(() =>
      renderHook(() => useContext()),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: A useContext hook was called without it being wrapped with a provider.]`,
    );

    consoleError.mockReset();
    consoleWarn.mockReset();
  });

  it("returns a provider/hook pair where the provider allows providing `undefined` and `null` values", () => {
    const [Provider, useContext] = createStrictContext<
      string | null | undefined
    >();

    function ProviderWithNull({ children }: PropsWithChildren): JSX.Element {
      return <Provider value={null}>{children}</Provider>;
    }

    const { result: resultNull } = renderHook(() => useContext(), {
      wrapper: ProviderWithNull,
    });

    expect(resultNull.current).toBeNull();

    function ProviderWithUndefined({
      children,
    }: PropsWithChildren): JSX.Element {
      return <Provider value={undefined}>{children}</Provider>;
    }

    const { result: resultUndefined } = renderHook(() => useContext(), {
      wrapper: ProviderWithUndefined,
    });

    expect(resultUndefined.current).toBeUndefined();
  });
});
