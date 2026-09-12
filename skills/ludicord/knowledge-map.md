# Ludicord Skill Knowledge Map

The Ludicord agent system has one canonical `SKILL.md`. Everything below it is
progressively disclosed reference material, not a competing skill source.

```text
User request
   ↓
Project inspection
   ↓
Intent + product classification
   ↓
Primary product profile
   ↓
Independent capability selection
   ↓
Ludicord subsystem references
   ↓
Implementation contract
   ↓
Smallest complete implementation
   ↓
Product-specific validation
   ↓
Framework/security/build validation
```

## Why this order matters

Ludicord is the implementation framework, not the product design. A request for
a dashboard, collaborative canvas, social experience, media browser, utility,
or website-like Activity must not be forced into game architecture merely
because Ludicord also has realtime, participant, shared-state, or game-loop
capabilities.

Likewise, a game must not be flattened into a generic website with a navbar,
hero, cards, and a small game panel. The product profile owns experience shape;
the framework references own implementation correctness.

## Authority layers

```text
Installed package version
   ↓
Installed declarations
   ↓
Generated route declarations
   ↓
Matching public framework docs
   ↓
Release / compatibility records
   ↓
Canonical Ludicord skill + references
   ↓
Examples
   ↓
General model knowledge
```

If layers disagree, use
[`source-authority.md`](references/intelligence/source-authority.md) instead of
silently choosing one.

## Router entry point

Every non-trivial change starts with
[`skill-router.md`](references/intelligence/skill-router.md). The router selects
one primary product profile and only the capabilities needed by the request.
