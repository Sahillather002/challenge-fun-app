import { useCallback, useEffect } from "react";
import { useAuthModal, useAuthStore, authKey } from "./store";
import { getItem, saveItem, deleteItem } from "../storage";

export const useAuth = () => {
  const { isReady, auth, setAuth } = useAuthStore();
  const { close, open } = useAuthModal();

  // ✅ Load auth from storage safely
  const initiate = useCallback(async () => {
    const storedAuth = await getItem(authKey);

    useAuthStore.setState({
      auth: storedAuth ? JSON.parse(storedAuth) : null,
      isReady: true,
    });
  }, []);

  // ✅ Call initiate once when app loads
  useEffect(() => {
    initiate();
  }, [initiate]);

  const signIn = useCallback(() => {
    open({ mode: "signin" });
  }, [open]);

  const signUp = useCallback(() => {
    open({ mode: "signup" });
  }, [open]);

  // ✅ Proper logout
  const signOut = useCallback(async () => {
    await deleteItem(authKey);
    setAuth(null);
    close();
  }, [close]);

  return {
    isReady,
    isAuthenticated: isReady ? !!auth : null,
    auth,
    setAuth,
    signIn,
    signUp,
    signOut,
    initiate,
  };
};
