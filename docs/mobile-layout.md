# Mobile and Layout

> Documentation for Ludicord 3.0.0. See [release status](../releases/README.md).


Ludicord installs four CSS custom properties:

```css
--ludicord-safe-top
--ludicord-safe-bottom
--ludicord-safe-left
--ludicord-safe-right
```

They read Discord's `--sait`, `--saib`, `--sail`, and `--sair` values first, then fall back to browser `env(safe-area-inset-*, 0px)`. Use them in your own layout; Ludicord intentionally does not ship a UI component library.

```css
main {
  padding: calc(16px + var(--ludicord-safe-top))
    calc(16px + var(--ludicord-safe-right))
    calc(16px + var(--ludicord-safe-bottom))
    calc(16px + var(--ludicord-safe-left));
}
```

`useLudicordSafeArea()` reads current CSS values. `useActivityLayoutMode()`, `useOrientation()`, and `useThermalState()` expose SDK updates through the shared event store. Use thermal state to reduce expensive effects when appropriate.
