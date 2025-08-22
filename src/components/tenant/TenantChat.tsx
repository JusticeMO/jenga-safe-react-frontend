import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Send, 
  Users,
  User
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { ChatMessage } from "@/types";

export function TenantChat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.getChatMessages();
        if (response.success) {
          setMessages(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch chat messages",
            variant: "destructive",
          });
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch chat messages";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [toast]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: "You",
      content: newMessage.trim(),
      time: new Date().toLocaleTimeString(),
      isSelf: true,
      avatar: "JD"
    };
    
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage("");

    try {
      const response = await apiClient.sendChatMessage({ content: newMessage.trim() });
      if (!response.success) {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
        setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to send message";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
