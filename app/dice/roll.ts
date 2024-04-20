import {
  maxValsForEachPos,
  minValsForEachPos,
  sum,
} from "dndbot/app/dice/utils.ts";
import { sendMessageWithSource } from "dndbot/app/discord/message.ts";

export interface RollCommandOptions {
  diceExpression: string;
  advOrDisadv: string | undefined;
  comment: string | undefined;
}

export const handleRollCommand = (options: RollCommandOptions) => {
  const evaluatedExp = evaluateDiceExpression(options.diceExpression);

  if (!evaluatedExp) return sendMessageWithSource("Invalid dice expression!");

  const { numDice, diceType, modifier } = evaluatedExp;
  const rolls = rollDice(numDice, diceType);
  const rollsSum = sum(rolls) + modifier;

  if (!options.advOrDisadv) {
    if (isNatural1(rolls, diceType)) return sendNatural1Msg();
    else if (isNatural20(rolls, diceType)) return sendNatural20Msg();

    return sendMessageWithSource(
      contentWithPrefix(
        `Rolled ${numDice}d${diceType} + ${modifier}: [${rolls}] + ${modifier} = ${rollsSum}`,
        options.comment,
      ),
    );
  }

  // If rolling with advantage, roll again and take the higher value(s).
  // If rolling with disadvantage, roll again and take the lower value(s).
  if (
    ["advantage", "disadvantage"].includes(
      options.advOrDisadv,
    )
  ) {
    const secondRolls = rollDice(numDice, diceType);
    const newRolls = options.advOrDisadv === "advantage"
      ? maxValsForEachPos(rolls, secondRolls)
      : minValsForEachPos(rolls, secondRolls);
    const newSum = sum(newRolls) + modifier;

    if (isNatural1(rolls, diceType)) return sendNatural1Msg();
    else if (isNatural20(rolls, diceType)) return sendNatural20Msg();

    return sendMessageWithSource(
      contentWithPrefix(
        `Rolled ${numDice}d${diceType}+${modifier} with ${options.advOrDisadv}: = [${newRolls}] + ${modifier} = ${newSum}`,
        options.comment,
      ),
    );
  }

  // The logic flow shouldn't get to this point, but if it does,
  // the user probably rolled a natural 1 on slash commands checks
  return sendMessageWithSource(
    "Hmm... something went wrong. You probably rolled a natural 1.",
  );
};

// Parses a dice expression and returns an object with
// the number of dice, dice type, and modifier
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

// Rolls a variable amount of dice with corresponding
// dice type and returns an array of the results
export const rollDice = (numDices: number, diceType: number) => {
  const rolls = Array.from(
    { length: numDices },
    () => Math.floor(Math.random() * diceType) + 1,
  );

  return rolls;
};

export const sendNatural1Msg = () => {
  return sendMessageWithSource("Natural 1! Critical failure!");
};

export const sendNatural20Msg = () => {
  return sendMessageWithSource("Natural 20! Critical success!");
};

// Assumes 1d20 when calculating natural 1's or 20's
export const isNatural1 = (rolls: number[], diceType: number) =>
  rolls.length === 1 && rolls[0] === 1 && diceType === 20;

export const isNatural20 = (rolls: number[], diceType: number) =>
  rolls.length === 1 && rolls[0] === 20 && diceType === 20;

// Adds a prefix to the content if it exists
export const contentWithPrefix = (
  content: string,
  prefix: string | undefined,
) => {
  return prefix ? `${prefix}: ${content}` : content;
};
