import { useRef } from "react";
import { HiTrendingUp } from "react-icons/hi";

type Props = {
  userMessage: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSend: () => void;
  isLoading: boolean;
};

const ChatInput = ({
  userMessage,
  handleChange,
  handleKeyDown,
  handleSend,
  isLoading,
}: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`;
    }
  };

  return (
    <div className="w-full flex justify-between items-end max-h-40 bg-white bg-opacity-10 px-3 py-1 overflow-auto ">
      <textarea
        ref={textareaRef}
        placeholder="Message ChatGpt"
        rows={2}
        className="outline-none overflow-hidden border-0 bg-transparent text-white resize-none w-[90%] text-[14px] capitalize"
        onInput={adjustHeight}
        value={userMessage}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      ></textarea>
      <div className="cursor-pointer" onClick={handleSend}>
        <HiTrendingUp color="white" size={"28px"} />
      </div>
    </div>
  );
};

export default ChatInput;
