import { useEffect } from "react";
import { useAppDispatch } from "../store";
import { endChat } from "../slices/chat-slice";
import useChatSelector from "./use-chat-selector";
import { isRedirectPathEmpty } from "../utils/auth-utils";
import { getFromLocalStorage, setToLocalStorage } from "../utils/local-storage-utils";

const useReloadChatEndEffect = () => {
  const { chatId } = useChatSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessions = getFromLocalStorage("sessions");
      if (chatId && isRedirectPathEmpty() && sessions && parseInt(sessions) === 1) {
        setToLocalStorage("sessions", "1");
        dispatch(endChat());
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
        handleBeforeUnload();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [chatId]);
}

export default useReloadChatEndEffect;
