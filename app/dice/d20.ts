import {
  advOrDisadvOptions,
  contentWithPrefix,
  isNatural1,
  isNatural20,
  maxValsForEachPos,
  minValsForEachPos,
  rollDice,
  sendNatural1Msg,
  sendNatural20Msg,
  sum,
} from "dndbot/app/dice/mod.ts";
import { sendMessageWithSource } from "dndbot/app/discord/mod.ts";

export interface CheckCommandOptions {
  modifier: string | undefined;
  advOrDisadv: string | undefined;
  comment: string | undefined;
}

export const handleD20Command = (options: CheckCommandOptions) => {
  const numDice = 1;
  const diceType = 20;
  const roll = rollDice(numDice, diceType);
  const modifier = options.modifier ? parseInt(options.modifier) : 0;
  const rollSum = sum(roll) + modifier;

  if (!options.advOrDisadv) {
    if (isNatural1(roll, diceType)) return sendNatural1Msg();
    else if (isNatural20(roll, diceType)) return sendNatural20Msg();

    return sendMessageWithSource(
      contentWithPrefix(
        `Rolled check with modifier, ${modifier}: ${rollSum}`,
        options.comment,
      ),
    );
  }

  if (
    advOrDisadvOptions.includes(
      options.advOrDisadv,
    )
  ) {
    const secondRoll = rollDice(numDice, diceType);
    const newRolls = options.advOrDisadv === "advantage"
      ? maxValsForEachPos(roll, secondRoll)
      : minValsForEachPos(roll, secondRoll);
    const newSum = sum(newRolls) + modifier;

    if (isNatural1(roll, diceType)) return sendNatural1Msg();
    else if (isNatural20(roll, diceType)) return sendNatural20Msg();

    return sendMessageWithSource(
      contentWithPrefix(
        `Rolled check with modifier, ${modifier}, and ${options.advOrDisadv}: = ${newRolls} + ${modifier} = ${newSum}`,
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
