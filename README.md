# DnD Discord Bot

Discord helper bot to help with future DnD sessions on Discord

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

Arguments: (dice-expression) (advantage-or-disadvantage)

Example usage:

```
# The bot uses Discord's built-in slash commands
/dnd dice roll 3d8+2
/dnd dice roll 1d20+8 advantage
/dnd dice roll 8d4+4 disadvantage
```

## Credits

1. [Ethan](https://github.com/EthanThatOneKid) for making a goated Deno library: [discord_app](https://github.com/EthanThatOneKid/discord_app)
