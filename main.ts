// @ts-nocheck: Remove complex type errors when handling slash commands logic
// If any bugs occur, remove this.

import { createApp } from "@discord-applications/app";
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
import { dndSchema } from "dndbot/app/discord/mod.ts";

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
