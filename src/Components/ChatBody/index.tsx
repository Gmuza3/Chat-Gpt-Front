import { CSSProperties, useEffect, useRef } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import img from '../../assets/Images/ChatGPT-Logo.png'

type Props = {
  isLoading: boolean;
  data: { User: string | null; Asistent: string | null }[];
};

const ChatBody = ({ isLoading, data }: Props) => {
  const chatBodyRef = useRef<HTMLUListElement>(null);

  const override: CSSProperties = {
    display: "block",
    margin: "0px 48px",
    borderColor: "black",
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [data]);

  if (isLoading) {
    return (
      <div>
        <ClipLoader
          color={"#000"}
          loading={isLoading}
          cssOverride={override}
          size={30}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <ul
      ref={chatBodyRef}
      className="w-full flex flex-col gap-10 2xl:gap-16 lg:gap-12 h-full overflow-y-auto"
    >
      {data.length > 0 && 
        data.map((item, index) => (
          <li key={index} className="flex flex-col gap-7 px-12 ssm:px-6 lg:gap-8 2xl:gap-10">
            <div className="max-w-[70%] self-end break-words border-[1px] border-white rounded-md py-1 px-3">
              <pre>
                <span className="bg-transparent text-md text-white whitespace-pre-wrap">
                  {item.User ? item.User : null}
                </span>
              </pre>
            </div>
            <div className="max-w-[100%] self-start break-words">
              <pre className="flex items-center justify-start">
                <div className="w-[70px] bg-transparent self-start z-50">
                  <img src={img} alt="" className="w-full"/>
                </div>
                <span className="max-w-[80%] text-md text-white whitespace-pre-wrap border-[1px] rounded-md py-1 px-3 mt-3 bg-gray-400 border-transparent">
                  {item.Asistent}
                </span>
              </pre>
            </div>
          </li>
        ))
      }
      {data.length<0 && 
        <div>
          ...loading
        </div>
      }
    </ul>
  );
};

export default ChatBody;
