# Discord MCP launcher

Local Node.js launcher for the third-party `@pasympa/discord-mcp` server.
This repository contains the launcher and portable setup instructions.
The Discord MCP server itself is provided by that upstream npm package.

## Setup

1. Install Node.js with npm and npx available on PATH.
2. Copy `.env.example` to `.env` in this directory.
3. Set `DISCORD_TOKEN` to your bot token in the local `.env` file.
4. Optionally set `DISCORD_ALLOWED_GUILDS` to restrict the accessible guilds.
5. Run `node run-discord-mcp.mjs`.

The launcher uses `npx -y @pasympa/discord-mcp`. npm may download the
upstream package on first use. The upstream dependency is not pinned.

For an MCP client, set its command to `node` and pass the absolute path
to `run-discord-mcp.mjs` as its single argument. Use your own local path.

## Credentials and local data

The launcher reads `TOKEN.txt` first, then `.env`, and supplies values to
the child process through its environment. Existing process environment
variables are also supported. No real credentials are included here.
If a populated `TOKEN.txt` exists, update that file or remove it locally
before relying on `.env`, because the first file with values takes precedence.

`.gitignore` excludes everything by default and allows only these reviewed files:

- `.gitignore`
- `.env.example` (empty credential fields)
- `README.md`
- `run-discord-mcp.mjs`

Tokens, populated environment files, Discord account/server/channel IDs,
local client configurations, personal notes, agent memory, logs, backups,
installed dependencies, and downloaded binaries remain local.
New source files must be reviewed and explicitly allowed in `.gitignore`.

Do not force-add local files. Before any push, review both `git diff --cached`
and `git ls-files`; ignore rules do not remove files already committed.
