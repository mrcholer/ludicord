# General Activity Product Profile

Use this as the safe default for a Ludicord app that does not clearly belong to
a narrower profile.

Examples include website-like embedded experiences, documentation/help apps,
forms, informational tools, simple CRUD flows, onboarding experiences, content
browsers, profile/settings surfaces, and mixed apps without a dominant special
interaction model.

## Product rules

- Design around the user's task or content hierarchy, not around the framework.
- A normal Activity does not need game mechanics, dashboard chrome, realtime,
  persistence, or participant lists by default.
- Use multiple embeds only when navigation actually improves the product.
- Prefer the simplest state lifetime that works.
- Add Discord context only where it improves or enables the requested feature.
- Avoid marketing-site conventions such as hero/pricing/testimonial/footer
  sections unless the user is actually building that kind of experience.

## UI composition

Choose composition from content:

```text
focused task → focused surface
document/content → readable content hierarchy
settings → grouped controls
multi-screen app → persistent shell only if useful
```

Do not convert the product into a dashboard solely to look "professional".
Professional means clear hierarchy, consistent interaction, responsive layout,
loading/error behavior, accessibility, and correct framework integration.
