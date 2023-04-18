import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([])
  const history = useHistory();

  useEffect(() => {
    const userData = localStorage.getItem("userinfo");
    const userInfo = JSON.parse(userData);
    setUser(userInfo);
    const userToken = localStorage.getItem("token");
    setToken(userToken);
    if(!userInfo){
      history.push("/")
    }
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
