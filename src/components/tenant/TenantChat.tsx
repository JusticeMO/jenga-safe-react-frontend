
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Send, 
  Users,
  User
} from "lucide-react";

// Mock messages for the property chat group
const initialMessages = [
  {
    id: "m1",
    sender: "John Doe",
    content: "Hello everyone! Just moved into Unit 3B. Nice to meet you all!",
    time: "10:30 AM",
    isSelf: true,
    avatar: "JD"
  },
  {
    id: "m2",
    sender: "Sarah Smith",
    content: "Welcome John! I'm in Unit 2A. Let me know if you need any help getting settled.",
    time: "10:32 AM",
    isSelf: false,
    avatar: "SS"
  },
  {
    id: "m3",
    sender: "Michael Johnson",
    content: "Hi John, welcome to the building! We're having a small get-together this weekend if you'd like to join.",
    time: "10:35 AM",
    isSelf: false,
    avatar: "MJ"
  }
];

export function TenantChat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMsg = {
      id: `m${Math.random().toString(36).substring(2, 9)}`,
      sender: "John Doe",
      content: newMessage.trim(),
      time: timeString,
      isSelf: true,
      avatar: "JD"
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");
    
    // Simulate a reply (for demo purposes)
    setTimeout(() => {
      const replyMessages = [
        "Thanks everyone for the warm welcome!",
        "Looking forward to meeting you all!",
        "That sounds great, count me in!",
        "Appreciate the help offer!"
      ];
      
      const randomReply = replyMessages[Math.floor(Math.random() * replyMessages.length)];
      const replyTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const replyMsg = {
        id: `m${Math.random().toString(36).substring(2, 9)}`,
        sender: "John Doe",
        content: randomReply,
        time: replyTimeString,
        isSelf: true,
        avatar: "JD"
      };
      
      setMessages(prev => [...prev, replyMsg]);
    }, 2000);
  };

  return (
    <div className="p-3 md:p-6 h-full">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Tenant Chat</h1>
          <p className="text-sm text-gray-600 mt-1">Riverside Apartments Chat Group</p>
        </div>
        <Button variant="outline" size="sm">
          <Users className="mr-2 h-4 w-4" />
          Share Contact Info
        </Button>
      </div>

      <Card className="h-[calc(100vh-200px)] flex flex-col">
        <CardHeader className="pb-3 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Riverside Apartments Chat Group</CardTitle>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Users className="h-4 w-4" />
                12 tenants • 3 online
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex gap-3 ${message.isSelf ? "flex-row-reverse" : ""}`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="text-xs bg-[#9b87f5]/20 text-[#9b87f5]">
                  {message.avatar}
                </AvatarFallback>
              </Avatar>
              <div className={`flex flex-col ${message.isSelf ? "items-end" : "items-start"} max-w-[70%]`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-600">
                    {message.sender}
                  </span>
                  <span className="text-xs text-gray-400">{message.time}</span>
                </div>
                <div 
                  className={`rounded-lg p-3 ${
                    message.isSelf 
                      ? "bg-[#9b87f5] text-white" 
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
        
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon" className="bg-[#9b87f5] hover:bg-[#7E69AB] flex-shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
