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

export interface DeathSavingThrowCommandOptions {
  advOrDisadv: string | undefined;
  modifier: string | undefined;
  comment: string | undefined;
}

export const handleDeathSavingThrowCommand = (
  options: DeathSavingThrowCommandOptions,
) => {
  const numDice = 1;
  const diceType = 20;
  const roll = rollDice(numDice, diceType);
  const modifier = options.modifier ? parseInt(options.modifier) : 0;
  const rollSum = sum(roll) + modifier;

  const deathSaveResult = rollSum >= 10
    ? "1 success is added"
    : "1 failure is added";

  if (!options.advOrDisadv) {
    if (isNatural1(roll, diceType)) {
      return sendNatural1Msg("Natural 1! 2 failures are added.");
    } else if (isNatural20(roll, diceType)) {
      return sendNatural20Msg("Natural 20! Get back up soldier!");
    }

    return sendMessageWithSource(
      contentWithPrefix(
        `Rolled death saving throw with modifier, ${modifier}: ${rollSum} --> ${deathSaveResult}!`,
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

    if (isNatural1(roll, diceType)) {
      return sendNatural1Msg("Natural 1! 2 failures are added.");
    } else if (isNatural20(roll, diceType)) {
      return sendNatural20Msg("Natural 20! Get back up soldier!");
    }

    return sendMessageWithSource(
      contentWithPrefix(
        `Rolled death saving throw with modifier, ${modifier}, and ${options.advOrDisadv}: ${newSum} --> ${deathSaveResult}!`,
        options.comment,
      ),
    );
  }
};
