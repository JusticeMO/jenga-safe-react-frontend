
import { Message } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface MessageDisplayProps {
  messages: Message[];
}

export function MessageDisplay({ messages }: MessageDisplayProps) {
  const { user } = useAuth();
  return (
    <div className="space-y-4">
      {messages?.map((message) => {
        const isSelf = message.from === 'You' || message.from === user?.name;
        return (
          <div
            key={message.id}
            className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                isSelf
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">{new Date(message.date).toLocaleTimeString()}</p>
            </div>
          </div>
        )
      })}
    </div>
  );
}
