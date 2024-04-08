import { useEffect } from "react";
import { useAppDispatch } from "../store";
import { addChatToTerminationQueue, removeChatFromTerminationQueue } from "../slices/chat-slice";
import useChatSelector from "./use-chat-selector";
import { isRedirectPathEmpty } from "../utils/auth-utils";
import { isLastSession } from "../utils/browser-utils";

const useReloadChatEndEffect = () => {
  const { chatId } = useChatSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(removeChatFromTerminationQueue());
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (chatId && isRedirectPathEmpty() && isLastSession()) {
        localStorage.setItem("sessions", "1");
        dispatch(addChatToTerminationQueue());
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
