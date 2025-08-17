
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search } from "lucide-react";

interface Conversation {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation;
  onSelectConversation: (conversation: Conversation) => void;
}

export function ConversationList({ 
  conversations, 
  selectedConversation, 
  onSelectConversation 
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="md:col-span-1 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search messages..." 
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {filteredConversations.map((conversation) => (
            <div 
              key={conversation.id}
              className={`p-2 rounded-md cursor-pointer flex items-center space-x-3 ${
                selectedConversation.id === conversation.id ? "bg-primary/10" : "hover:bg-gray-100"
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <Avatar>
                <img 
                  src={conversation.avatar} 
                  alt={conversation.name} 
                  className="rounded-full"
                />
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{conversation.name}</span>
                  <span className="text-xs text-gray-500">{conversation.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
                  {conversation.unread > 0 && (
                    <Badge className="ml-2" variant="secondary">{conversation.unread}</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
