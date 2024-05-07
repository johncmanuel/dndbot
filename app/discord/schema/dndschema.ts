import {
  ApplicationCommandOptionType,
  AppSchema,
} from "@discord-applications/app";

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
