# Voice Events

> Preview documentation for the upcoming 2.2.4 release. npm currently provides ludicord 2.2.1 and create-ludicord-app 2.2.3. See [release status](../releases/README.md) before using new features.


Request the `rpc.voice.read` scope, then use:

```tsx
import {
  useIsSpeaking,
  useParticipantVoiceState,
  useSpeakingUsers,
  useVoiceState,
} from "ludicord/discord";
```

Ludicord maintains shared subscriptions for `VOICE_STATE_UPDATE`, `SPEAKING_START`, and `SPEAKING_STOP`. `useSpeakingUsers()` returns speaking user IDs; `useIsSpeaking(id)` is convenient for indicators. `useVoiceState()` returns all known voice states, while `useParticipantVoiceState(id)` selects one participant.

Unsupported events are capability-checked and do not crash the Activity. In development, missing `rpc.voice.read` produces a diagnostic through `useDiscordDiagnostics`. These hooks observe the Embedded App SDK; they do not connect to the Discord Gateway.
