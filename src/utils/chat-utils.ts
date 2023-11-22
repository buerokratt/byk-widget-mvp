import { CHAT_MODES } from "../constants";
import { Message, MessageButton } from "../model/message-model";

export const parseButtons = (message: Message): MessageButton[] => {
  try {
    return JSON.parse(decodeURIComponent(message?.buttons || '[]')) as MessageButton[];
  } catch(e) {
    console.error(e);
    return [];
  }
}

export const getChatModeBasedOnLastMessage = (messages: Message[]): CHAT_MODES => {
  let lastMsgButtonsCount = 0;

  if(messages && messages.length > 0) {
    const lastMsg = messages[messages.length - 1];
    const buttons = parseButtons(lastMsg);
    lastMsgButtonsCount = buttons.length;
  }

  return lastMsgButtonsCount === 0 ? CHAT_MODES.FREE : CHAT_MODES.FLOW;
}
