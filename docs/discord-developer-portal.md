# Discord Developer Portal Setup

> Documentation for Ludicord 3.1.1. See [release status](../releases/README.md).


1. Create a Discord application and enable Activities.
2. Configure the supported platforms for the Activity.
3. In OAuth2, copy the Client ID and Client Secret into server environment variables.
4. Add a Redirect URI suitable for the Embedded App SDK authorization flow.
5. Configure Activity URL Mapping with prefix `/` and your Ludicord server or HTTPS tunnel hostname as the target, without the protocol.
6. For local testing inside Discord, expose `ludicord dev` through an HTTPS tunnel.
7. Launch the unpublished Activity from the Developer Activity Shelf or App Launcher.

The URL Mapping must target the same Ludicord server because the Activity shell, `/_ludicord/auth`, `/api/*`, and `/ws/*` share one origin. Never place the Client Secret or Session Secret in `ludicord.config.mjs` as a literal that client code can import; read server secrets from the environment.
