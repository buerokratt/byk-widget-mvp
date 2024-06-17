import React, { FC, useEffect, useState } from "react";
import { isOfficeHours } from "./utils/office-hours-utils";
import Chat from "./components/chat/chat";
import Profile from "./components/profile/profile";
import useChatSelector from "./hooks/use-chat-selector";
import useInterval from "./hooks/use-interval";
import {
  OFFICE_HOURS_INTERVAL_TIMEOUT,
  SESSION_STORAGE_CHAT_ID_KEY,
} from "./constants";
import {
  getChat,
  getChatMessages,
  resetState,
  setChatId,
  setIsChatOpen,
} from "./slices/chat-slice";
import { useAppDispatch } from "./store";
import useNewMessageNotification from "./hooks/use-new-message-notification";
import useAuthentication from "./hooks/use-authentication";
import useGetNewMessages from "./hooks/use-get-new-messages";
import useGetChat from "./hooks/use-get-chat";
import useReloadChatEndEffect from "./hooks/use-reload-chat-end-effect";
import { getFromLocalStorage } from "./utils/local-storage-utils";

declare global {
  interface Window {
    _env_: {
      RUUTER_API_URL: string;
      TIM_AUTHENTICATION_URL: string;
      NOTIFICATION_NODE_URL: string;
      ORGANIZATION_NAME: string;
      TERMS_AND_CONDITIONS_LINK: string;
      OFFICE_HOURS: {
        ENABLED: boolean;
        TIMEZONE: string;
        BEGIN: number;
        END: number;
        DAYS: number[];
      };
    };
  }
}

const App: FC = () => {
  const dispatch = useAppDispatch();
  const { isChatOpen, messages, chatId } = useChatSelector();
  const [displayWidget, setDisplayWidget] = useState(
    !!getFromLocalStorage(SESSION_STORAGE_CHAT_ID_KEY) || isOfficeHours()
  );

  useInterval(
    () =>
      setDisplayWidget(
        !!getFromLocalStorage(SESSION_STORAGE_CHAT_ID_KEY) || isOfficeHours()
      ),
    OFFICE_HOURS_INTERVAL_TIMEOUT
  );
  useAuthentication();
  useGetChat();
  useGetNewMessages();
  useNewMessageNotification();
  useReloadChatEndEffect();

  useEffect(() => {
    const storageHandler = () => {
      const storedData = getFromLocalStorage(SESSION_STORAGE_CHAT_ID_KEY);
      const previousChatId = getFromLocalStorage('previousChatId');

      if (storedData === null && previousChatId === null) {
        setChatId("");
        dispatch(setChatId(""));
        dispatch(setIsChatOpen(false));
        dispatch(resetState());
      }
    };

    window.addEventListener("storage", storageHandler);

    return () => {
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  useEffect(() => {
    const sessions = localStorage.getItem("sessions");
    if (sessions == null) {
      localStorage.setItem("sessions", "1");
    } else {
      localStorage.setItem("sessions", `${parseInt(sessions) + 1}`);
    }

    window.onunload = function (_) {
      const newSessionsCount = localStorage.getItem("sessions");
      if (newSessionsCount !== null) {
        localStorage.setItem("sessions", `${parseInt(newSessionsCount) - 1}`);
      }
    };
  }, []);

  useEffect(() => {
    const sessionStorageChatId = getFromLocalStorage(
      SESSION_STORAGE_CHAT_ID_KEY
    );
    if (sessionStorageChatId) {
      dispatch(setChatId(sessionStorageChatId));
      dispatch(setIsChatOpen(true));
    }
  }, [dispatch, chatId]);

  useEffect(() => {
    if (chatId && !messages.length) {
      dispatch(getChat());
      dispatch(getChatMessages());
    }
  }, [chatId, dispatch, messages]);

  if (displayWidget) return isChatOpen ? <Chat /> : <Profile />;
  return <></>;
};

export default App;
