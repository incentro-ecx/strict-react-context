import { act, render, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { describe, expect, it } from "vitest";
import { createSelectableContext } from "./create-selectable-context.js";

describe("createSelectableContext", () => {
  it("should create a context hook that uses the default if no value is provided", () => {
    const [, useContext] = createSelectableContext(0);
    const { result } = renderHook(useContext);
    expect(result.current).toBe(0);
  });

  it("should create a context hook that returns the provided value", () => {
    const [Provider, useContext] = createSelectableContext(0);

    function WrapperWithProvidedValue({ children }: { children: ReactNode }) {
      return <Provider value={1}>{children}</Provider>;
    }

    const { result } = renderHook(useContext, {
      wrapper: WrapperWithProvidedValue,
    });

    expect(result.current).toBe(1);
  });

  it("should create a context hook that allows a selector to be passed", () => {
    const [, useContext] = createSelectableContext({ nested: 0 });

    const { result } = renderHook(useContext, {
      initialProps: (context) => context.nested,
    });

    expect(result.current).toBe(0);
  });

  it("should create a context hook that allows the selector to be updated", () => {
    const [, useContext] = createSelectableContext({ value1: 0, value2: 1 });

    const { result, rerender } = renderHook(useContext, {
      initialProps: (context) => context.value1,
    });

    expect(result.current).toBe(0);

    rerender((context) => context.value2);

    expect(result.current).toBe(1);
  });

  it("should create a context hook that triggers a rerender if the value is updated", () => {
    const [Provider, useContext] = createSelectableContext(0);

    let value: number;
    let setValue: (value: number) => void;

    function WrapperWithProvidedValue({ children }: { children: ReactNode }) {
      [value, setValue] = useState(1);

      return <Provider value={value}>{children}</Provider>;
    }

    const { result } = renderHook(useContext, {
      wrapper: WrapperWithProvidedValue,
    });

    expect(result.current).toBe(1);

    act(() => setValue(2));

    expect(result.current).toBe(2);
  });

  it("should create a context hook that triggers a rerender only if the selected part of the context is updated", () => {
    type State = {
      value1: number;
      value2: number;
    };

    const [Provider, useContext] = createSelectableContext<State>({
      value1: 0,
      value2: 0,
    });

    let value: State;
    let setValue: (value: State) => void;

    function WrapperWithProvidedValue({ children }: { children: ReactNode }) {
      [value, setValue] = useState({
        value1: 1,
        value2: -1,
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

    expect(renderedValue!).toBe(1);
    expect(renderCount).toBe(1);

    // First we update the selected value
    act(() =>
      setValue({
        value1: 2,
        value2: -1,
      }),
    );

    expect(renderedValue!).toBe(2);
    expect(renderCount).toBe(2);

    // Now we update the non-selected value
    act(() =>
      setValue({
        value1: 2,
        value2: -2,
      }),
    );

    expect(renderedValue!).toBe(2);

    // We expect no re-renders
    expect(renderCount).toBe(2);
  });
});
