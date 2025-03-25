import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { WS_URL } from "../config/config";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { data: session } = useSession();
  const [wsError, setWsError] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=${session?.user.accessToken}`);

    ws.onerror = (e: any) => {
      setWsError(e.message);
      return;
    };

    ws.onopen = () => {
      setSocket(ws);
    };

    return () => {
      ws.close();
    };
  }, []);

  return {
    socket,
    wsError,
  };
};
