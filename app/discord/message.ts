import { InteractionResponseType } from "@discord-applications/app";

export const sendMessageWithSource = (msg: string) => {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: msg,
    },
  };
};
