import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import botImage from "../public/bot-image-2.png";
import userImage from "../public/avatar-image.svg";

export type Message = {
  id: string;
  type: "user" | "bot";
  text: string | React.ReactNode;
};

interface Chat {
  initialMessages: Message[];
  examples: { text: string; label: string }[];
  answers: Record<string, React.ReactNode>;
  apiKey: string;
  userLanguage: "en" | "es";
  onChangeLanguage: (language: "en" | "es") => void;
}

const Chat = ({
  initialMessages,
  examples,
  answers,
  apiKey,
  userLanguage,
  onChangeLanguage,
}: Chat) => {
  const [messages, setMessages] = useState<Message[]>(() =>
    initialMessages ? initialMessages : [],
  );
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages, userLanguage]);

  const handleAddedMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const [question, setQuestion] = useState("");
  const [weirdTimes, setWeirdTimes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setQuestion("");

    handleAddedMessage({
      id: String(Date.now()),
      type: "user",
      text: question,
    });

    const response = await fetch("https://api.cohere.com/v1/classify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "4f3adf38-082a-44b8-a773-78fdfc42309c-ft",
        inputs: [question],
        examples: examples,
      }),
    });
    const { classifications } = await response.json();
    if (
      classifications?.[0]?.prediction === "unknow" ||
      classifications?.[0]?.prediction === "intro"
    ) {
      setWeirdTimes((prev) => prev + 1);
    }

    let answerToRender =
      answers[classifications?.[0]?.prediction] || answers.unknow;

    if (weirdTimes > 2) {
      setWeirdTimes(0);
      answerToRender =
        userLanguage === "en" ? (
          <>
            <p>
              Ok, this is starting to get a bit awkward, I think it's better to
              tell you a joke:
            </p>
            <br />
            {answers.fun}
          </>
        ) : (
          <>
            <p>
              Ok, esto está empezando a ser un poco incómodo, mejor te cuento un
              chiste:
            </p>
            <br />
            {answers.fun}
          </>
        );
    }

    handleAddedMessage({
      id: String(Date.now()),
      type: "bot",
      text: answerToRender,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    ref.current?.scrollTo(0, ref.current.scrollHeight);
  }, [messages]);

  if (isOpen) {
    return (
      <div className="h-full w-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[800px] grid grid-cols-12">
        {/* <div className="h-full w-full absolute bottom-50 right-0 sm:right-10 max-h-[600px] grid grid-cols-12"> */}
        <section className="relative flex flex-col justify-between bg-slate-800 col-span-full sm:col-span-8 sm:col-start-3 xl:col-span-4 xl:col-start-5 2xl:w-[80%] 2xl:mx-auto m-20 p-20 border border-gray-300 rounded-lg space-y-16">
          {/* <section className="relative bg-slate-800 col-span-full sm:col-span-6 lg:col-span-4 !col-end-13 m-20 p-20 border border-gray-300 rounded-lg space-y-16"> */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute -left-16 -top-12 bg-red-400 text-white rounded-full w-20 md:w-32 lg:w-40 aspect-square p-16"
          >
            <span className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] font-bold text-lg pb-4">
              x
            </span>
          </button>
          <div
            ref={ref}
            className="space-y-16 flex flex-col max-h-[600px] overflow-y-auto pl-24 sm:px-24 pb-16"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-12 max-w-[90%] rounded-3xl flex gap-12 items-center ${
                  message.type === "bot"
                    ? "bg-blue-500 text-left rounded-bl-none self-start"
                    : "bg-green-500 text-right rounded-br-none self-end flex-row-reverse"
                }`}
              >
                <div className="relative rounded-full border-2 border-solid border-white w-32 aspect-square p-16 shrink-0 overflow-hidden">
                  {message.type === "bot" ? (
                    <Image
                      className="object-cover"
                      src={botImage}
                      alt="bot-image"
                      fill
                      sizes="(max-width: 768px) 100%,
                             (max-width: 1200px) 100%,
                             100%"
                    />
                  ) : (
                    <Image
                      className="object-cover"
                      src={userImage}
                      alt="user-image"
                      fill
                      sizes="(max-width: 768px) 100%,
                             (max-width: 1200px) 100%,
                             100%"
                    />
                  )}
                </div>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="w-full flex space-x-10">
            <label className="flex flex-1">
              <input
                type="text"
                value={question}
                placeholder={
                  userLanguage === "en"
                    ? "Ask me a question..."
                    : "Hazme una pregunta..."
                }
                className="w-full border border-gray-400 py-8 px-16 flex-1 rounded-lg rounded-r-none"
                onChange={(e) => setQuestion(e.target.value)}
              />
            </label>
            <button
              disabled={isLoading}
              type="submit"
              className={`py-8 px-16 rounded-lg rounded-l-none ${
                isLoading ? "to-blue-200" : "bg-blue-500"
              }`}
            >
              {userLanguage === "en" ? "Send" : "Enviar"}
            </button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute space-y-20 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <select
          className="w-full py-10 px-12"
          value={userLanguage}
          placeholder="Select language"
          onChange={(e) => onChangeLanguage(e.target.value as "en" | "es")}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
        </select>
        <button
          onClick={() => setIsOpen(true)}
          // className="bg-blue-500 absolute right-16 bottom-12 p-16 rounded-lg"
          className="bg-blue-500 w-full p-16 rounded-lg"
        >
          {userLanguage === "en" ? "Open Chat" : "Abrir Chat"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
