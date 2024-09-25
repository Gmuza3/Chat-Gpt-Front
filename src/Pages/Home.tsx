import { useState, useEffect, useCallback } from "react";
import ChatBody from "../Components/ChatBody";
import ChatInput from "../Components/ChatInput";
import api from "../Config/axios.api";
import { useMutation } from "react-query";
import ResponseType from "../Types";

type Message = Array<{
  User: string | null;
  Asistent: string | null;
}>;

const Home = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chat, setChat] = useState<Message>([]);
  const [databaseChat, setDatabaseChat] = useState<Message>([]);

  const messageSave = useCallback(async (chat: Message) => {
    const res = await api.put(
      "/saveMessage",
      { chat },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (res.data.updateUser.messages) {
      return setDatabaseChat(res.data.updateUser.messages);
    }
  },[chat]);

  const sendMessage = async (message: string): Promise<ResponseType> => {
    const response = await api.post("api/chat", {
      messages: [{ role: "user", content: message }],
    });
    return response.data as ResponseType;
  };

  const mutation = useMutation(sendMessage, {
    onSuccess: (data) => {
      setChat((prev) =>{
        return [...prev,{User:userMessage,Asistent: data.choices[0].message.content}]
      })
    },
    onError: () => {
      alert("Failed to save message. Please try again.");
    },
  });

  useEffect(() =>{
    if(chat){
      messageSave(chat)
    }
  },[chat,messageSave])


  const handleSend = () => {
    if (userMessage.trim()) {
      mutation.mutate(userMessage.trim());
      setUserMessage("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <main className="h-[80%] flex items-start overflow-auto">
        <ChatBody isLoading={mutation.isLoading} data={databaseChat} />
      </main>
      <footer className="px-6">
        <ChatInput
          handleChange={handleChange}
          handleKeyDown={handleKeyDown}
          userMessage={userMessage}
          handleSend={handleSend}
          isLoading={mutation.isLoading}
        />
      </footer>
    </>
  );
};

export default Home;
