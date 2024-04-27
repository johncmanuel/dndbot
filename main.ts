// @ts-nocheck: Remove complex type errors when handling slash commands logic
// If any bugs occur, remove this.

import {
  ApplicationCommandOptionType,
  AppSchema,
  createApp,
} from "@discord-applications/app";
import {
  DISCORD_APPLICATION_ID,
  DISCORD_PUBLIC_KEY,
  DISCORD_TOKEN,
} from "dndbot/envs.ts";
import {
  handleD20Command,
  handleDeathSavingThrowCommand,
  handleRollCommand,
} from "dndbot/app/dice/mod.ts";

export const dndSchema = {
  chatInput: {
    name: "dnd",
    description: "DnD 5e helper commands",
    groups: {
      dice: {
        description: "Dice commands",
        subcommands: {
          roll: {
            description: "Roll a dice of any type",
            options: {
              "dice-expression": {
                type: ApplicationCommandOptionType.String,
                description: "The dice expression to roll",
                required: true,
              },
              "advantage-or-disadvantage": {
                type: ApplicationCommandOptionType.String,
                description: "Whether to roll with advantage or disadvantage",
                required: false,
                choices: {
                  advantage: "advantage",
                  disadvantage: "disadvantage",
                },
              },
              "comment": {
                type: ApplicationCommandOptionType.String,
                description: "A comment to add to the roll",
                required: false,
              },
            },
          },
          d20: {
            description: "Roll a d20",
            options: {
              modifier: {
                type: ApplicationCommandOptionType.String,
                description: "Add any modifier bonuses to your check.",
                required: false,
              },
              "advantage-or-disadvantage": {
                type: ApplicationCommandOptionType.String,
                description: "Whether to roll with advantage or disadvantage",
                required: false,
                choices: {
                  advantage: "advantage",
                  disadvantage: "disadvantage",
                },
              },
              "comment": {
                type: ApplicationCommandOptionType.String,
                description: "A comment to add to the roll",
                required: false,
              },
            },
          },
          death: {
            description: "Roll a death saving throw",
            options: {
              modifier: {
                type: ApplicationCommandOptionType.String,
                description: "Add any modifier bonuses to your check.",
                required: false,
              },
              "advantage-or-disadvantage": {
                type: ApplicationCommandOptionType.String,
                description: "Whether to roll with advantage or disadvantage",
                required: false,
                choices: {
                  advantage: "advantage",
                  disadvantage: "disadvantage",
                },
              },
              "comment": {
                type: ApplicationCommandOptionType.String,
                description: "A comment to add to the roll",
                required: false,
              },
            },
          },
        },
      },
    },
  },
} as const satisfies AppSchema;

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const app = await createApp(
    {
      schema: dndSchema,
      applicationID: DISCORD_APPLICATION_ID,
      publicKey: DISCORD_PUBLIC_KEY,
      token: DISCORD_TOKEN,
      invite: { path: "/invite", scopes: ["applications.commands"] },
      register: true,
    },
    {
      dice: {
        roll(interaction) {
          const diceExpression =
            interaction.data.parsedOptions["dice-expression"];
          const advOrDisadv =
            interaction.data.parsedOptions["advantage-or-disadvantage"];
          const comment = interaction.data.parsedOptions["comment"];
          return handleRollCommand({ diceExpression, advOrDisadv, comment });
        },
        d20(interaction) {
          const modifier = interaction.data.parsedOptions["modifier"];
          const advOrDisadv =
            interaction.data.parsedOptions["advantage-or-disadvantage"];
          const comment = interaction.data.parsedOptions["comment"];
          return handleD20Command({ modifier, advOrDisadv, comment });
        },
        death(interaction) {
          const modifier = interaction.data.parsedOptions["modifier"];
          const advOrDisadv =
            interaction.data.parsedOptions["advantage-or-disadvantage"];
          const comment = interaction.data.parsedOptions["comment"];
          return handleDeathSavingThrowCommand({
            modifier,
            advOrDisadv,
            comment,
          });
        },
      },
    },
  );

  Deno.serve(app);
}
