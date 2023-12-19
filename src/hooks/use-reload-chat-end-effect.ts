import { useEffect } from "react";
import { useAppDispatch } from "../store";
import { endChat } from "../slices/chat-slice";
import useChatSelector from "./use-chat-selector";

const useReloadChatEndEffect = () => {
  const { chatId } = useChatSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (chatId) dispatch(endChat());
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
