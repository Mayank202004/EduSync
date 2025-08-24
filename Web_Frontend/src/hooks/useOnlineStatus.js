import { useSocket } from "@/context/SocketContext";
import { useMemo } from "react";

const useOnlineStatus = (userId) => {
  const { globalOnlineUsers } = useSocket();

  return useMemo(() => {
    return globalOnlineUsers.includes(userId);
  }, [globalOnlineUsers, userId]);
};

export default useOnlineStatus;
