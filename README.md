# IT Tools

## Overview

A collective of tiny tools, that may, or may not be of used to developers and goobers around the world.

This project was created as a solution for a Software Design course project, for which the requirements are so:

- There are at least 10 sections of tools.
- Each section consists of at least 3 tools.
- There should be some image-related tools (optional).
- Split permission levels into users, premium users and administrators.
- Implement the system in one of three ways:
  - Worst: Adding/removing tools would require editing existing files and the recompilation of the entire system.
  - Medium: Adding/removing tools would only require recompiling the existing system without any edits.
  - Best: Adding/removing tools doesn't require any recompiling of the existing system.

## Deployment

This is a simple web app, ran on NodeJS, as long as you have a version of Node and NPM installed, this should be easy to configure.

1. Clone this repository or use the source code archive.
2. Install NPM packages using your package manager. (`pnpm i` or `npm install`)
3. Setup environment variables exactly like `.env.example` in an `.env` file.
   - `DB_CONNECTION`: The postgresql connection to your Postgres instance.
   - `PORT`: The port number for the Express server to run.
   - `SESSION_SECRET`: The secret to sign JWTs.
   - `SESSION_SECURE`: Whether to serve secure cookies. If you're running HTTP, this has to be `false`.
   - `SESSION_SAME_SITE`: Same site policy for cookies. Since this is a server-rendered web application, this can be `lax` or `strict`.
4. Run the server with `npm run start`.
