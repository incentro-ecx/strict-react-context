import { act, render, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { createStrictSelectableContext } from "./create-strict-selectable-context.js";

describe("createStrictSelectableContext", () => {
  it("should create a context that returns the provided value", () => {
    const [Provider, useContext] = createStrictSelectableContext<number>();

    function WrapperWithProvidedValue({ children }: { children: ReactNode }) {
      return <Provider value={0}>{children}</Provider>;
    }

    const { result } = renderHook(useContext, {
      wrapper: WrapperWithProvidedValue,
    });

    expect(result.current).toBe(0);
  });

  it("should create a hook that throws an error if used without provider", () => {
    // Surpress React / JSDom warnings / errors
    const consoleError = vi.spyOn(console, "error").mockReturnValue();
    const consoleWarn = vi.spyOn(console, "warn").mockReturnValue();

    const [, useContextWithoutDisplayName] = createStrictSelectableContext();

    expect(() => {
      renderHook(useContextWithoutDisplayName);
    }).toThrowErrorMatchingInlineSnapshot(
      `[Error: A useContext hook was called without it being wrapped with a provider.]`,
    );

    const [, useContextWithDisplayName] =
      createStrictSelectableContext("DisplayName");

    expect(() => {
      renderHook(useContextWithDisplayName);
    }).toThrowErrorMatchingInlineSnapshot(
      `[Error: The useDisplayName hook was called without being wrapped around a \`DisplayNameProvider\`.]`,
    );

    consoleError.mockReset();
    consoleWarn.mockReset();
  });

  it("should create a context hook that allows a selector to be passed", () => {
    type State = { nested: number };

    const [Provider, useContext] = createStrictSelectableContext<State>();

    function WrapperWithProvidedValue({ children }: { children: ReactNode }) {
      return <Provider value={{ nested: 0 }}>{children}</Provider>;
    }

    const { result } = renderHook(useContext, {
      initialProps: (context) => context.nested,
      wrapper: WrapperWithProvidedValue,
    });

    expect(result.current).toBe(0);
  });

  it("should create a context hook that triggers a rerender if the value is updated", () => {
    const [Provider, useContext] = createStrictSelectableContext<number>();

    let value: number;
    let setValue: (value: number) => void;

    function WrapperWithProvidedValue({ children }: { children: ReactNode }) {
      [value, setValue] = useState(0);

      return <Provider value={value}>{children}</Provider>;
    }

    const { result } = renderHook(useContext, {
      wrapper: WrapperWithProvidedValue,
    });

    expect(result.current).toBe(0);

    act(() => setValue(1));

    expect(result.current).toBe(1);
  });

  it("should create a context hook that triggers a rerender only if the selected part of the context is updated", () => {
    type State = {
      value1: number;
      value2: number;
    };

    const [Provider, useContext] = createStrictSelectableContext<State>();

    let value: State;
    let setValue: (value: State) => void;

    function WrapperWithProvidedValue({ children }: { children: ReactNode }) {
      [value, setValue] = useState({
        value1: 0,
        value2: 0,
      });

      return <Provider value={value}>{children}</Provider>;
    }

    let renderCount = 0;
    let renderedValue: number;

    function ComponentWithRenderCount() {
      useEffect(() => {
        renderCount += 1;
      });

      renderedValue = useContext((context) => context.value1);

      return <>{renderedValue}</>;
    }

    render(<ComponentWithRenderCount />, {
      wrapper: WrapperWithProvidedValue,
    });

    expect(renderedValue!).toBe(0);
    expect(renderCount).toBe(1);

    // First we update the selected value
    act(() =>
      setValue({
        value1: 1,
        value2: 0,
      }),
    );

    expect(renderedValue!).toBe(1);
    expect(renderCount).toBe(2);

    // Now we update the non-selected value
    act(() =>
      setValue({
        value1: 1,
        value2: -1,
      }),
    );

    expect(renderedValue!).toBe(1);

    // We expect no re-renders
    expect(renderCount).toBe(2);
  });
});
