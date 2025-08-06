import { useEffect, useRef, useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "안녕하세요! 무엇에 대해 이야기하고 싶으신가요?" },
  ]);
  const [input, setInput] = useState("");
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // 메시지 전송 함수
  const sendMessage = () => {
    if (input.trim() === "") return;

    // 사용자 메시지 추가
    setMessages([...messages, { sender: "user", text: input }]);

    // 임시 봇 응답 (LLM API로 대체 가능)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `"${input}"에 대한 응답입니다!` },
      ]);
    }, 500);

    setInput("");
  };

  // Enter 키로 메시지 전송
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // 스크롤 최하단으로 이동
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex items-center h-full">
      <div className="w-full max-w-md h-full flex flex-col">
        <div className="p-4 border-b border-gray-300 text-center font-bold text-lg">
          Lorem ipsum dolor sit amet consecteturest impedit assumenda
          perferendis, soluta ab!
        </div>

        {/* 대화 영역 */}
        <div
          ref={chatBodyRef}
          className="flex-1 py-3 overflow-y-auto flex flex-col gap-3 grow"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[70%] mx-4 p-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-black self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* 입력창 */}
        <div className="p-4 flex relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="w-full p-2 pr-12 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="absolute right-6 bottom-6 text-blue-500 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transform rotate-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
