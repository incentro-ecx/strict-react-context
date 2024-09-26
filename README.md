<div align="center">
  <h1 align="center">Strict React Context</h1>

  <a href="https://www.npmjs.com/package/strict-react-context">
    <img alt="NPM version" src="https://img.shields.io/npm/v/strict-react-context?logo=npm&style=flat-square">
  </a>
  <a href="https://github.com/incentro-dc/strict-react-context/actions/workflows/build.yml">
    <img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/incentro-dc/strict-react-context/build.yml?label=Builds&logo=github&style=flat-square">
  </a>
  <a href="https://github.com/incentro-dc/strict-react-context/actions/workflows/test.yml">
    <img alt="Test status" src="https://img.shields.io/github/actions/workflow/status/incentro-dc/strict-react-context/test.yml?label=Tests&logo=vitest&style=flat-square">
  </a>
  <a href="https://prettier.io/">
    <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?logo=prettier&style=flat-square">
  </a>
</div>

## 💫 Introduction

Utilities for creating React contexts in which the hook will throw an error if it is called without being wrapped around a provider.

```tsx
import { createStrictContext } from 'strict-react-context';

const [NameProvider, useName] = createStrictContext<string>();

function Name() {
  const name = useName();
  return <div>{name}</div>;
}

// Does not throw an error
<NameProvider value="John Doe">
  <Name />
</NameProvider>

// Throws an error
<Name />
```

## 🪛 Usage

### `createStrictContext`

Creates a provider / hook pair with React context in which the hook will
throw an error if it is called without being wrapped around a provider.
This avoids unnecessary checks for `undefined` after calling the hook.

```tsx
const [NameProvider, useName] = createStrictContext<string>();

function Name() {
  const name = useName();
  return <h1>{name}</h1>;
}

// Does not throw an error
<NameProvider value="John Doe">
  <Name />
</NameProvider>

// Throws an error
<Name />
```

### `createStrictSelectableContext`

We also expose a version of strict context using [`use-context-selector`](https://github.com/dai-shi/use-context-selector), which allows you to pass a selector function to prevent unnecessary rerenders:

```tsx
interface User {
  name: string
};

const [UserProvider, useUser] = createStrictSelectableContext<User>();

function Name() {
  const name = useUser(user => user.name);
  return <h1>{name}</h1>;
}

// Does not throw an error
<UserProvider value={{ name: "John Doe" }}>
  <Name />
</UserProvider>

// Throws an error
<Name />
```

### `createSelectableContext`

A small wrapper around
[`use-context-selector`](https://github.com/dai-shi/use-context-selector)
that returns a provider / hook pair instead of a context object.

```tsx
interface User {
  name: string;
}

const [UserProvider, useUser] = createSelectableContext<User | null>(null);

function Name() {
  // component only rerenders if the user's name changes
  const name = useUser((user) => user.name);
  return <h1>{name}</h1>;
}
```

## 💾 Installation

You can install this plugin with:

```bash
pnpm add strict-react-context
```

## 🪛 Usage

# 🙌 Contributing

This plugin was created and is maintained by [Incentro](https://www.incentro.com/). If you're running into issues, please [open an issue](https://github.com/incentro-dc/strict-react-context/issues/new). If you want to contribute, please read our [contributing guidelines](./CONTRIBUTING.md).
