# Ludicord

A full-stack React framework for building Discord Activities.

Build persistent Activity screens, authenticated HTTP APIs and real-time WebSocket experiences with the official Discord Embedded App SDK.

[Documentation](docs/README.md) · [Release history](CHANGELOG.md) · [Roadmap](ROADMAP.md) · [Support](SUPPORT.md)

## Public documentation repository

This repository contains public documentation, usage snippets, release information and support resources. It does **not** contain the private framework implementation, private applications, credentials, build artifacts or their Git history.

Install Ludicord from npm. Downloading this repository does not install the framework. Documentation snippets show how to use the package; they are not its implementation.

## Get started

Requires Node.js 20.19+ and React/React DOM 18.3 or 19.

```bash
npx create-ludicord-app@latest my-activity
cd my-activity
npm run dev
```

Before testing inside Discord, configure your application's credentials in `.env.local`, an HTTPS tunnel and Activity URL Mapping. Never commit secrets. Follow [Getting started](docs/getting-started.md), [environment setup](docs/environment-variables.md) and [Discord setup](docs/discord-developer-portal.md).

## Release status

Registry status checked on September 4, 2026 (UTC):

| Package | Published latest |
| --- | --- |
| [ludicord](https://www.npmjs.com/package/ludicord) | 2.2.4 |
| [create-ludicord-app](https://www.npmjs.com/package/create-ludicord-app) | 2.2.4 |

The guides in `docs/` describe the published **2.2.4** API. Both packages are aligned at 2.2.4. See the [release notes](releases/2.2.4.md), [upgrade guide](docs/migration.md) and [release delivery](docs/distribution.md).

## Explore

- [Activity root and automatic files](docs/pages.md), [embeds](docs/embeds.md) and [navigation](docs/navigation.md).
- [Discord data and permissions](docs/discord-sdk.md), [participants](docs/participants.md), [voice](docs/voice-events.md) and [mobile layouts](docs/mobile-layout.md).
- [Login](docs/login.md), [API routes](docs/api-routes.md), [WebSockets](docs/websockets.md) and [Activity rooms](docs/activity-rooms.md).
- [Development and diagnostics](docs/development.md), [build](docs/build.md), [deployment](docs/deployment.md) and [security](docs/security.md).
- [Configuration](docs/configuration.md), [CLI](docs/cli.md), [API reference](docs/api-reference.md) and [recipes](docs/recipes.md).

Ludicord uses the official Discord SDK. It is not a Discord Gateway client or bot runtime. Access to Discord data always depends on Discord permissions and your application's configuration. Ludicord is not affiliated with or endorsed by Discord.
