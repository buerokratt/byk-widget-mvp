import reducer, {
  addMessage,
  addMessagesToDisplay,
  clearMessageQueue,
  endChat,
  getChat,
  getChatMessages,
  getEstimatedWaitingTime,
  getGreeting,
  initChat,
  queueMessage,
  resetNewMessagesAmount,
  sendChatNpmRating,
  sendFeedbackMessage,
  setChat,
  setChatId,
  setIsChatOpen,
  setIsFeedbackConfirmationShown,
  updateMessage,
} from "./chat-slice";
import { Message } from "../model/message-model";
import { RATING_TYPES, CHAT_STATUS, ERROR_MESSAGE } from "../constants";
import {
  initialChatState,
  mockChat,
  mockMessage,
  mockMessage2,
} from "../test-initial-states";

jest.mock("../services/chat-service");

describe("Chat slice", () => {
  describe("chat", () => {
    it("should set chat id", () => {
      const previousState = { ...initialChatState, chatId: null };
      expect(reducer(previousState, setChatId("100"))).toEqual({
        ...initialChatState,
        chatId: "100",
      });
    });

    it("should set rating", () => {
      const authorTimestamp = new Date().toString();
      const message: Message = {
        id: "1",
        content: "Hello world",
        rating: "",
        chatId: "123",
        authorTimestamp,
      };
      const resultMessage: Message = {
        id: "1",
        content: "Hello world",
        rating: RATING_TYPES.LIKED,
        chatId: "123",
        authorTimestamp,
      };
      const messages = [];
      messages.push(message);
      const previousState = { ...initialChatState, messages };
      expect(reducer(previousState, updateMessage(resultMessage))).toEqual({
        ...initialChatState,
        messages: [
          {
            id: "1",
            content: "Hello world",
            rating: RATING_TYPES.LIKED,
            chatId: "123",
            authorTimestamp,
          },
        ],
      });
    });

    it("should set chat status and customer support id", () => {
      expect(reducer(initialChatState, setChat(mockChat))).toEqual({
        ...initialChatState,
        chatStatus: mockChat.status,
        customerSupportId: mockChat.customerSupportId,
      });
    });
  });

  describe("messages", () => {
    it("should add a new message to an empty message list", () => {
      const previousState = { ...initialChatState, messages: [] };
      expect(reducer(previousState, addMessage(mockMessage))).toEqual({
        ...initialChatState,
        messages: [mockMessage],
      });
    });

    it("should add a new message to an existing message list", () => {
      const previousState = { ...initialChatState, messages: [mockMessage] };
      expect(reducer(previousState, addMessage(mockMessage2))).toEqual({
        ...initialChatState,
        messages: [mockMessage, mockMessage2],
      });
    });

    it("should add multiple new messages to an empty message list", async () => {
      jest
        .spyOn(Date.prototype, "toISOString")
        .mockReturnValue("2000-01-01T00:00:00.000Z");

      const messages = [mockMessage, mockMessage2];
      const previousState = { ...initialChatState, messages: [] };

      expect(reducer(previousState, addMessagesToDisplay(messages))).toEqual({
        ...initialChatState,
        lastReadMessageTimestamp: new Date().toISOString(),
        newMessagesAmount: 2,
        messages,
      });
    });

    it("should add message to messageQueue", () => {
      expect(reducer(initialChatState, queueMessage(mockMessage))).toEqual({
        ...initialChatState,
        messageQueue: [mockMessage],
      });
    });

    it("should clear message queue", () => {
      const previousState = {
        ...initialChatState,
        messageQueue: [mockMessage],
      };
      expect(reducer(previousState, clearMessageQueue())).toEqual({
        ...initialChatState,
      });
    });
  });

  describe("is chat open", () => {
    it("should set isChatOpen to true", () => {
      const previousState = { ...initialChatState };
      expect(reducer(previousState, setIsChatOpen(true))).toEqual({
        ...initialChatState,
        isChatOpen: true,
      });
    });

    it("should set newMessagesAmount value to zero", () => {
      const previousState = { ...initialChatState, newMessagesAmount: 2 };
      expect(reducer(previousState, setIsChatOpen(false))).toEqual({
        ...initialChatState,
        newMessagesAmount: 0,
      });
    });
  });

  describe("extra reducers", () => {
    it("should set loading true when initChat is pending", () => {
      const action = { type: initChat.pending.type };
      const state = reducer({ ...initialChatState, loading: false }, action);
      expect(state).toEqual({
        ...initialChatState,
        loading: true,
        lastReadMessageTimestamp: state.lastReadMessageTimestamp,
      });
    });

    it("should set chat id and chat status open when initChat is fulfilled", () => {
      const action = { type: initChat.fulfilled.type, payload: { id: 1 } };
      const state = reducer(initialChatState, action);
      expect(state).toEqual({
        ...initialChatState,
        chatId: 1,
        chatStatus: CHAT_STATUS.OPEN,
      });
    });

    it("should set customerSupportId and chat status when getChat is fulfilled", () => {
      const action = {
        type: getChat.fulfilled.type,
        payload: { status: CHAT_STATUS.ENDED, customerSupportId: 1 },
      };
      const state = reducer(
        { ...initialChatState, chatStatus: CHAT_STATUS.OPEN },
        action
      );
      expect(state).toEqual({
        ...initialChatState,
        chatStatus: CHAT_STATUS.ENDED,
        customerSupportId: 1,
      });
    });

    it("should get chat messages when getChatMessages is fulfilled", () => {
      const action = {
        type: getChatMessages.fulfilled.type,
        payload: {
          content: "hey",
          authorTimestamp: new Date().toString(),
          chatId: "123",
        },
      };
      const state = reducer(initialChatState, action);
      expect(state).toEqual({
        ...initialChatState,
        lastReadMessageTimestamp: state.lastReadMessageTimestamp,
        messages: {
          content: "hey",
          authorTimestamp: new Date().toString(),
          chatId: "123",
        },
      });
    });

    it("should add greeting message to messageList, when greeting is gotten", () => {
      const action = {
        type: getGreeting.fulfilled.type,
        payload: { isActive: true, est: "tere", eng: "hello" },
      };
      const state = reducer(initialChatState, action);
      expect(state).toEqual({
        ...initialChatState,
        messages: [
          {
            authorTimestamp: state.messages[0].authorTimestamp,
            chatId: null,
            content: "tere",
            event: "greeting",
          },
        ],
      });
    });

    it("should set chat status ended when endChat is fulfilled", () => {
      const feedback = {
        isFeedbackConfirmationShown: false,
        isFeedbackMessageGiven: false,
        isFeedbackRatingGiven: false,
        showFeedbackWarning: false,
      };
      const action = { type: endChat.fulfilled.type };
      const state = reducer(
        { ...initialChatState, chatStatus: CHAT_STATUS.OPEN },
        action
      );
      expect(state).toEqual({
        ...initialChatState,
        chatStatus: CHAT_STATUS.ENDED,
        feedback,
      });
    });

    it("should set errorMessage when sendChatNpmRating is rejected", () => {
      const action = { type: sendChatNpmRating.rejected.type };
      const state = reducer(initialChatState, action);
      expect(state).toEqual({
        ...initialChatState,
        errorMessage: ERROR_MESSAGE,
      });
    });

    it("should set errorMessage when sendFeedbackMessage is rejected", () => {
      const action = { type: sendFeedbackMessage.rejected.type };
      const state = reducer(initialChatState, action);
      expect(state).toEqual({
        ...initialChatState,
        errorMessage: ERROR_MESSAGE,
      });
    });

    it("should set estimatedWaitingTime when getEstimatedWaitingTime is fulfilled", () => {
      const action = {
        type: getEstimatedWaitingTime.fulfilled.type,
        payload: { isActive: true, time: 37 },
      };
      const state = reducer(initialChatState, action);
      expect(state).toEqual({
        ...initialChatState,
        estimatedWaiting: { isActive: true, time: 37 },
      });
    });
  });

  it("should reset new messages amount", () => {
    const previousState = { ...initialChatState, newMessagesAmount: 2 };
    expect(reducer(previousState, resetNewMessagesAmount())).toEqual({
      ...initialChatState,
      newMessagesAmount: 0,
    });
  });

  it("should set is feedback confirmation shown", () => {
    expect(
      reducer(
        {
          ...initialChatState,
          feedback: {
            ...initialChatState.feedback,
            isFeedbackConfirmationShown: false,
          },
        },
        setIsFeedbackConfirmationShown(true)
      )
    ).toEqual({
      ...initialChatState,
      feedback: {
        ...initialChatState.feedback,
        isFeedbackConfirmationShown: true,
      },
    });
  });
});
