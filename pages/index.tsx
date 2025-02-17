import { useEffect, useState } from "react";
import Chat, { Message } from "../components/Chat";

const EXAMPLES = [
  { text: "Hello", label: "intro" },
  { text: "How are you?\n", label: "intro" },
  { text: "How you doing?\n", label: "intro" },
  { text: "How can I contact you?\n", label: "contact" },
  { text: "What's your linkedin?\n", label: "contact" },
  { text: "What's your github?\n", label: "contact" },
  { text: "What technologies do you use?\n", label: "stack" },
  { text: "What technologies do you have experience with?", label: "stack" },
  { text: "Where do you work?\n", label: "work" },
  { text: "Are you working?\n", label: "work" },
  { text: "How many years of experience do you have?\n", label: "work" },
  { text: "Do you know english?", label: "english" },
  { text: "What's your english level?", label: "english" },
  { text: "english level\n", label: "english" },
  { text: "What's your portfolio?\n", label: "contact" },
  { text: "Tell me a joke\n", label: "fun" },
  { text: "What's your salary expectation?\n", label: "work" },
  { text: "Tell me something weird\n", label: "fun" },
  { text: "What's your twitter account?\n", label: "contact" },
  {
    text: "How many years of experience do you have with react?\n",
    label: "stack",
  },
  {
    text: "How many years of experience do you have with next?",
    label: "stack",
  },
  {
    text: "How many years of experience do you have with tailwind?",
    label: "stack",
  },
  { text: "who are you?\n", label: "intro" },
];

const API_KEY = process.env.NEXT_PUBLIC_COHERE_API_KEY;
const ANSWERS = {
  intro: (
    <p>
      Hey, this is JVBOT. I'm a chatbot generated with IA that can answer
      questions about Javier Vargas.
    </p>
  ),
  contact: (
    <p>
      You can contact me at{" "}
      <a
        href="mailto:hola@javierd.com"
        target="_blank"
        rel="noreferer noopener"
        className="underline"
      >
        hola@javierd.com
      </a>{" "}
      Or add me to{" "}
      <a
        href="https://www.linkedin.com/in/javier-vargas-d/"
        target="_blank"
        rel="noreferer noopener"
        className="underline"
      >
        Linkedin
      </a>{" "}
      or{" "}
      <a
        href="https://github.com/javierdebug"
        target="_blank"
        rel="noreferer noopener"
        className="underline"
      >
        Github
      </a>
      .
    </p>
  ),
  stack: (
    <p>
      I'm proficient with TypeScript, Next.js, and TailwindCSS; I've developed
      projects for more than three years as a freelance developer in multiple
      projects. For the past three years, I've been working as a Frontend
      Developer in a development agency on different projects for international
      businesses.
    </p>
  ),
  work: (
    <p>
      I'm currently working as a Frontend Developer at{" "}
      <a
        href="https://wondercraft.co/"
        target="_blank"
        rel="noreferer noopener"
        className="underline"
      >
        WonderCraft
      </a>
      .
    </p>
  ),
  english: (
    <p>
      I'm proficient with English, I've been working as a freelancer for three
      years and I've had the opportunity to work with clients from different
      countries. I obtained a C2 level (78/100) in the EFSET exam; you can check
      my EFSET certification in the following link:{" "}
      <a
        href="https://bit.ly/EFSET-certiticate"
        target="_blank"
        rel="noreferer noopener"
        className="underline"
      >
        EFSET-certificate
      </a>
      .
    </p>
  ),
  unknow: (
    <p>
      I'm sorry, I don't know the answer to that question. Please try again.
    </p>
  ),
  fun: (
    <p>
      <b>Why do programmers prefer dark mode?</b> <br />
      <i>Because light attracts bugs!</i>{" "}
    </p>
  ),
};

const SPANISH_ANSWERS = {
  intro: (
    <p>
      Hey, este es JVBOT. Soy un chatbot generado con IA que puede responder
      preguntas sobre Javier Vargas.
    </p>
  ),
  contact: (
    <p>
      Puedes contactarme a través del correo{" "}
      <a
        href="mailto:hola@javierd.com"
        target="_blank"
        rel="noreferer noopener"
        className="underline"
      >
        hola@javierd.com
      </a>{" "}
      O agregame a{" "}
      <a
        href="https://www.linkedin.com/in/javier-vargas-d/"
        target="_blank"
        rel="noreferer noopener"
        className="underline"
      >
        Linkedin
      </a>{" "}
      o{" "}
      <a
        href="https://github.com/javierdebug"
        target="_blank"
        rel="noreferer noopener"
        className="underline"
      >
        Github
      </a>
      .
    </p>
  ),
  stack: (
    <p>
      Soy experto en TypeScript, Next.js y TailwindCSS; he desarrollado
      proyectos durante más de tres años como desarrollador freelance en varios
      proyectos. Durante los últimos tres años, he trabajado como desarrollador
      frontend en una agencia de desarrollo en diferentes proyectos para
      empresas internacionales.
    </p>
  ),
  work: (
    <p>
      Actualmente trabajo como Desarrollador Frontend en{" "}
      <a
        href="https://wondercraft.co/"
        target="_blank"
        rel="noreferer noopener"
        className="underline"
      >
        WonderCraft
      </a>
      .
    </p>
  ),
  english: (
    <p>
      Manejo un inglés profesional avanzado, he trabajado como freelancer
      durante tres años y he tenido la oportunidad de trabajar con clientes de
      diferentes países. Obtuve un nivel C2 (78/100) en el examen EFSET; puedes
      revisar mi certificación EFSET en el siguiente enlace:{" "}
      <a
        href="https://bit.ly/EFSET-certiticate"
        target="_blank"
        rel="noreferer noopener"
        className="underline"
      >
        certificación EFSET
      </a>
      .
    </p>
  ),
  unknow: (
    <p>
      Lo siento, no conozco la respuesta a esa pregunta. Por favor, intenta de
      nuevo.
    </p>
  ),
  fun: (
    <p>
      <b>¿Qué le dijo el un HTML a su CSS?</b> <br />
      <i>”¡Sin ti, no tengo estilo!”</i>
    </p>
  ),
};

const IndexPage = () => {
  const [userLanguage, setUserLanguage] = useState<"en" | "es">("en");
  const [initialMessages, setInitialMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: "Hey, this is JVBOT; ask me your questions about Javier Vargas and his professional experience as a frontend developer",
    },
  ]);

  useEffect(() => {
    let initialBotMessage: string;
    if (userLanguage === "en") {
      initialBotMessage =
        "Hey, this is JVBOT; ask me your questions about Javier Vargas and his professional experience as a frontend developer";
    } else {
      initialBotMessage =
        "Hey, este es JVBOT; puedes hacerme preguntas sobre Javier Vargas y su experiencia profesional como desarrollador frontend";
    }

    const newInitialMessages: Message[] = [
      {
        id: "1",
        type: "bot",
        text: initialBotMessage,
      },
    ];
    setInitialMessages(newInitialMessages);
  }, [userLanguage]);

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
      <main className="px-24 md:px-48 lg:px-64 xl:px-80 max-w-[2000px] mx-auto h-svh w-svw overflow-x-hidden">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-800 opacity-20 blur-[100px]" />
        <Chat
          initialMessages={initialMessages}
          userLanguage={userLanguage}
          onChangeLanguage={setUserLanguage}
          apiKey={API_KEY}
          examples={EXAMPLES}
          answers={userLanguage === "en" ? ANSWERS : SPANISH_ANSWERS}
        />
      </main>
    </div>
  );
};

export default IndexPage;
