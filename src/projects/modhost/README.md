# ModHost

## Overview

ModHost is a self-hosted, dynamic, and secure platform for hosting game mods.
Its backend is written in Rust with axum and tokio, and its frontend is written
with SvelteKit. It features a full-text search, user accounts, administration
utilities, uploading, editing, project descriptions, and full customization of
the UI when the server starts. It is a monolithic binary containing the UI and
all components, and only relies on external services for the database and file
storage, using Postgres and Minio or any other S3-compatable service.

Its UI can be customized when the server starts using a `toml` or `pkl` file,
which have instructions included. Server options and external services options
are also configured there. When the server starts, the UI is recompiled from the
sources embedded in binary if the configuration changed, otherwise a cached
version is used.

## Downloads

https://github.com/RedstoneWizard08/ModHost

## Authorship

All components of ModHost were written by me from scratch, aside from forked or
vendored versions of external libraries that were modified to support my
use-case.

## Future Plans

My future plans for this project include expanding administration tools,
hardening security, improving full-text search, improving upload speeds, and
making the UI more clear in several places, as well as redesigning much of it.
