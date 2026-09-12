# Implementation Contract

Before a non-trivial edit, create this internal contract. It prevents the agent
from coding first and discovering architecture afterward.

```yaml
request:
  outcome:
  explicit_requirements: []
  non_goals: []

product:
  primary_profile:
  secondary_profile: null
  reason:

project:
  existing: true | false
  ludicord_version:
  package_manager:
  styling:
  conventions_to_preserve: []

capabilities:
  realtime: false
  persistence: false
  server_authority: false
  discord_context: []
  api_routes: false
  ws_routes: false
  auth_changes: false

state:
  local:
  shared:
  durable:
  trusted_authority:

files:
  inspect: []
  modify: []
  create: []
  forbidden:
    - .ludicord/**
    - ludicord.generated.d.ts

validation:
  route_check: false
  hooks_lint: false
  typecheck: false
  build: true
  browser: false
  discord_frame: false
  product_specific: []
```

## Rules

- Every `true` capability needs a reason from the requested experience.
- Every file in `modify` or `create` must have a role in the implementation.
- Generated files stay forbidden.
- Framework API details in the plan must be verified before use.
- The contract can evolve when evidence changes, but update the reasoning before
  broadening implementation.
