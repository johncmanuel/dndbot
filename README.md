# DnD Discord Bot

Discord helper bot to help with future DnD sessions on Discord

## TODO

1. Make commands for most commonly used dice rolls (i.e checks, saving throws, attack rolls, etc)
2. Refactor duplicate code
3. Work on processing multiple, comma-separated dice expressions (i.e 3d8+2, 1d20+1, etc.)
4. Create an auto-updating GitHub wiki page for all slash commands using a GitHub action and Discord API

## Setup

1. Install [Devbox](https://github.com/jetify-com/devbox)
2. [Setup your Discord application](https://discord.com/developers/docs/intro)
3. Setup environment variables in a `.env` file

```
DISCORD_APPLICATION_ID=""
DISCORD_PUBLIC_KEY=""
DISCORD_TOKEN=""
```

4. Create an account at [ngrok](https://ngrok.com/), which will be used to expose the local development server to Discord
5. Use `deno task ngrok` and `deno task start` in two separate terminals; one will be for ngrok and another for the server respectively
6. Use the URL given in the `ngrok` terminal under `Forwarding` that points to localhost as the `Interactions Endpoint URL` in your Discord application (change the URL with your production URL when switching to production)
7. Invite the bot to your server at the `/invite` endpoint and you're done :)

## Commands

## /dnd dice roll

Arguments: (dice-expression) (advantage-or-disadvantage) (comment)

Example usage:

```
# The bot uses Discord's built-in slash commands
/dnd dice roll 3d8
/dnd dice roll 1d20+8 advantage
/dnd dice roll 8d4+4 disadvantage
/dnd dice roll 1d20 "wisdom check"
/dnd dice roll 1d20+2 advantage "arcana check on deciphering writing in ancient spellbook"
```

## Credits

1. [Ethan](https://github.com/EthanThatOneKid) for making a goated Deno library: [discord_app](https://github.com/EthanThatOneKid/discord_app)
