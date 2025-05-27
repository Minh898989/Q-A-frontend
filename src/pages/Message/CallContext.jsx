
import { createContext, useContext, useState } from "react";

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [friend, setFriend] = useState(null);

  const startCall = (friendInfo) => {
    setFriend(friendInfo);
    setIsCalling(true);
  };

  const endCall = () => {
    setIsCalling(false);
    setFriend(null);
  };

  return (
    <CallContext.Provider value={{ isCalling, friend, startCall, endCall }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
