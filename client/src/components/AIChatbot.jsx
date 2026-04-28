import { useState } from "react";
import "./Chatbot.css";

function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 I’m ready to answer for free (fallback mode). Ask anything!" }
  ]);
  const [input, setInput] = useState("");
  const [modelStatus, setModelStatus] = useState("ready");

  const fallbackAnswer = question => {
    const q = question.toLowerCase().trim();
    if (!q) return "Please ask any question.";

    if (q.includes("hello") || q.includes("hi")) return "Hello! How can I help you today?";
    if (q.includes("your name")) return "I'm your free AI chatbot in this app.";
    if (q.includes("time")) return `Current browser time is ${new Date().toLocaleTimeString()}.`;
    if (q.includes("date")) return `Today is ${new Date().toLocaleDateString()}.`;
    if (q.includes("how are you")) return "I'm a bot and doing great, thanks for asking!";
    if(q.includes("donate") || q.includes("post")) return "Login as a donor => donate Food Tab => Submitting the food Donation Form at Top-Right Corner. Thank you for help needy People"
   if(q.includes("request")) return "Login as a NGO (or) Receiver => Request Food Tab => Available Food are shown. Request food based on your availability. Thank You"
    if (q.includes("capital of")) {
      const country = q.replace("capital of", "").trim();
      const capitals = {
        "france": "Paris",
        "germany": "Berlin",
        "india": "New Delhi",
        "japan": "Tokyo",
        "australia": "Canberra",
      };
      return capitals[country] ? `${capitals[country]} is the capital of ${country}.` : "I don't know that capital, but it's usually something interesting!";
    }

    const faq = {
      "what is 1+1": "1 + 1 = 2",
      "what is the capital of   usa": "Washington, D.C.",
      "what is 2+2": "2 + 2 = 4",
      "how to cook rice": "Rinse rice, add water 1:2 ratio, boil then simmer until water absorbed.",
      "what is ai": "AI stands for artificial intelligence, technology that imitates human thinking.",
    };

    const key = q.replace(/\?/g, "").trim();
    if (faq[key]) return faq[key];

    // Friendly generic answer for broader queries
    return `Here is a free response from fallback mode: I can't run a full language model here, but I can help with: basics, facts, and small how-tos. You asked: "${question}". Try rephrasing with specifics like 'What is X?', 'How do I Y?', or 'Explain Z'.`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages(msgs => [...msgs, userMsg]);

    const botReply = fallbackAnswer(input);
    setMessages(msgs => [...msgs, { from: "bot", text: botReply }]);
    setInput("");
  };

  return (
    <div className="chatbot-container">
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">Food AI 🤖</div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={m.from === "bot" ? "bot-msg" : "user-msg"}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              placeholder="Ask something..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}

      <button className="chatbot-toggle" onClick={() => setOpen(!open)}>
        💬
      </button>
    </div>
  );
}

export default AIChatbot;
