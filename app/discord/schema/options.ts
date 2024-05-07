// WIP

import { ApplicationCommandOptionType } from "@discord-applications/app";

// Contains all possible options to use for dice rolling
// Note that due to Discord API's naming structure, the
// name for each option must lowercase and have no spaces
// TODO: find where it says this in the docs
// export const cmdOptions: Record<
//   string,
//   { [x: string]: AppChatInputBasicOption<ApplicationCommandOptionType> }
// > = {
//   diceExpression: {
//     "dice-expression": {
//       type: ApplicationCommandOptionType.String,
//       description: "The dice expression to roll",
//       required: true,
//     },
//   },
// };

// const x = cmdOptions["diceExpression"];

// export const diceExpression = {
//   "dice-expression": {
//     type: ApplicationCommandOptionType.String,
//     description: "The dice expression to roll",
//     required: true,
//   },
// };

export const diceCmdsOptions = {
  diceExpression: {
    "dice-expression": {
      type: ApplicationCommandOptionType.String,
      description: "The dice expression to roll",
      required: true,
    },
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
  comment: {
    type: ApplicationCommandOptionType.String,
    description: "A comment to add to the roll",
    required: false,
  },
  modifier: {
    type: ApplicationCommandOptionType.String,
    description: "Add any modifier bonuses to your check.",
    required: false,
  },
};

diceCmdsOptions.diceExpression;
