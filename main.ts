import {
  ApplicationCommandOptionType,
  AppSchema,
  createApp,
  InteractionResponseType,
} from "@discord-applications/app";
import {
  DISCORD_APPLICATION_ID,
  DISCORD_PUBLIC_KEY,
  DISCORD_TOKEN,
} from "dndbot/envs.ts";

export const dndSchema = {
  chatInput: {
    name: "dnd",
    description: "DnD 5e helper commands",
    groups: {
      dice: {
        description: "Dice commands",
        subcommands: {
          roll: {
            description: "Roll a dice",
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
          const evaluatedExp = evaluateDiceExpression(diceExpression);

          if (!evaluatedExp) {
            return {
              type: InteractionResponseType.ChannelMessageWithSource,
              data: {
                content: "Invalid dice expression!",
              },
            };
          }

          const { numDice, diceType, modifier } = evaluatedExp;
          const rolls = rollDice(numDice, diceType);
          const rollsSum = sum(rolls) + modifier;

          if (!advOrDisadv) {
            if (isNatural1(rolls, diceType)) {
              return sendNatural1Msg();
            } else if (
              isNatural20(rolls, diceType)
            ) {
              return sendNatural20Msg();
            }

            return {
              type: InteractionResponseType.ChannelMessageWithSource,
              data: {
                content:
                  `Rolled ${numDice}d${diceType}+${modifier}: [${rolls}]+${modifier} = ${rollsSum}`,
              },
            };
          }

          // If rolling with advantage, roll again and take the higher value(s).
          // If rolling with disadvantage, roll again and take the lower value(s).
          if (
            ["advantage", "disadvantage"].includes(
              advOrDisadv,
            )
          ) {
            const secondRolls = rollDice(numDice, diceType);
            const newRolls = advOrDisadv === "advantage"
              ? maxValsForEachPos(rolls, secondRolls)
              : minValsForEachPos(rolls, secondRolls);
            const newSum = sum(newRolls) + modifier;

            if (isNatural1(newRolls, diceType)) {
              return sendNatural1Msg();
            } else if (
              isNatural20(newRolls, diceType)
            ) {
              return sendNatural20Msg();
            }

            return {
              type: InteractionResponseType.ChannelMessageWithSource,
              data: {
                content:
                  `Rolled ${numDice}d${diceType}+${modifier} with ${advOrDisadv}: = [${newRolls}] + ${modifier} = ${newSum}`,
              },
            };
          }

          return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              content:
                "Hmm... something went wrong. You probably rolled a natural 1.",
            },
          };
        },
      },
    },
  );

  Deno.serve(app);
}

export const evaluateDiceExpression = (expression: string) => {
  // Source for regex:
  // https://www.reddit.com/r/regex/comments/q5kwnk/yet_another_dnd_dice_roller/hg6fhhf/

  const regex = new RegExp(
    "(^| )((\\d*)d(\\d+|F)((?:\\+|-)(\\d+))?)(,|$)",
    "gm",
  );
  const matches = regex.exec(expression);

  /*
    Example output from regex:
    [
      "3d8+4",
      "",
      "3d8+4",
      "3",
      "8",
      "+4",
      "4",
      "",
      index: 0,
      input: "3d8+4",
      groups: undefined
    ]
  */

  if (!matches) return null;

  const numDice = matches[3];
  const diceType = matches[4];
  const modifier = matches[5];

  return {
    numDice: numDice ? parseInt(numDice) : 1,
    diceType: parseInt(diceType),
    modifier: modifier ? parseInt(modifier) : 0,
  };
};

export const rollDice = (numDices: number, diceType: number) => {
  const rolls = Array.from(
    { length: numDices },
    () => Math.floor(Math.random() * diceType) + 1,
  );

  return rolls;
};

export const sum = (arr: number[]) => arr.reduce((acc, curr) => acc + curr, 0);

export const maxValsForEachPos = (arr1: number[], arr2: number[]): number[] => {
  return arr1.map((val, i) => Math.max(val, arr2[i]));
};

export const minValsForEachPos = (arr1: number[], arr2: number[]): number[] => {
  return arr1.map((val, i) => Math.min(val, arr2[i]));
};

export const sendNatural1Msg = () => {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: "Natural 1! Critical failure!",
    },
  };
};

export const sendNatural20Msg = () => {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: "Natural 20! Critical success!",
    },
  };
};

// Assumes 1d20 when calculating natural 1's or 20's
export const isNatural1 = (rolls: number[], diceType: number) =>
  rolls.length === 1 && rolls[0] === 1 && diceType === 20;

export const isNatural20 = (rolls: number[], diceType: number) =>
  rolls.length === 1 && rolls[0] === 20 && diceType === 20;
