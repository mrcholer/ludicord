# Participants

> Documentation for Ludicord 3.1.0. See [release status](../releases/README.md).


```tsx
import { useParticipants } from "ludicord/discord";

const participants = useParticipants();
```

Ludicord initially calls the SDK participant command when available, then keeps one shared participant store synchronized with `ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE`. Multiple components reuse the same store and do not create duplicate SDK subscriptions.

Participants expose safe display fields such as ID, username, display name, and avatar when Discord supplies them. The participant list is SDK state, not proof of an authenticated server request. API and WebSocket authorization continues to use the encrypted Ludicord session.
