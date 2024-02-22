import { useEffect } from "react";
import {
  getFromSessionStorage,
  setToSessionStorage,
} from "../utils/session-storage-utils";

const temp = "session-timestamp-temp";
const trigger = "session-timestamp";

const useMemoryStorage = (
  storageKey: string,
  data: string | null,
  callback: (data: any) => any
) => {
  useEffect(() => {
    window.localStorage.setItem(trigger, Date.now().toString());

    const storageHandler = ({ key, newValue }: StorageEvent) => {
      if (key === trigger) {
        const storedData = getFromSessionStorage(storageKey);

        if (storedData != null) {
          window.localStorage.setItem(temp, storedData);
        }

        window.localStorage.removeItem(temp);
      } else if (key === temp && newValue != null) {
        setToSessionStorage(storageKey, newValue);
        callback(newValue);
      }
    };

    window.addEventListener("storage", storageHandler);

    return () => {
      window.removeEventListener("storage", storageHandler);
    };
  }, [storageKey, callback]);

  useEffect(() => {
    if (data != null) {
      window.localStorage.setItem(temp, data);
      window.localStorage.removeItem(temp);
    }
  }, [data]);
};

export { useMemoryStorage, useMemoryStorage as default };
