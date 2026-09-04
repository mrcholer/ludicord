# Ludicord 2.2.5

## Project creator

- Choose Tailwind CSS interactively when creating a project.
- Use `--tailwind` or `--no-tailwind` in scripts and automated setup.
- Start from a polished responsive interface with either Tailwind CSS or plain CSS.

## Package and documentation experience

- Added the Ludicord banner and live package badges to both npm package pages.
- Pointed package home, source, issues and release links to the public Ludicord repository.
- Added public package metadata snapshots, an LLM documentation index and agent instructions.
- Added a reusable Ludicord skill that teaches coding agents the framework's conventions, security boundaries and validation workflow.

## Release delivery

- Public npm trusted publishing now runs from the public repository with provenance.
- Private builds hand off only approved compiled tarballs, declarations and public notes; original TypeScript and private application code remain excluded.
- Version changes automatically stage the public payload, publish both packages, verify integrity, update the changelog and package records, and create matching public and maintainer releases.
- Discord announcements now use Components V2 with a role mention, branded container, changelog button and install command.
