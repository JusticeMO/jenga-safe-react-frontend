
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus
} from "lucide-react";
import { ConversationList } from "./messages/ConversationList";
import { MessageDisplay } from "./messages/MessageDisplay";
import { MessageInput } from "./messages/MessageInput";
import { NewConversationDialog } from "./messages/NewConversationDialog";

// Mock conversation data
const initialConversations = [
  {
    id: "1",
    name: "Jane Smith",
    role: "Landlord",
    lastMessage: "I've addressed the maintenance request.",
    time: "10:30 AM",
    unread: 2,
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Property Management",
    role: "Administrator",
    lastMessage: "Your rent receipt has been generated.",
    time: "Yesterday",
    unread: 0,
    avatar: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Maintenance Team",
    role: "Support",
    lastMessage: "We'll send someone tomorrow morning.",
    time: "Apr 22",
    unread: 0,
    avatar: "/placeholder.svg",
  },
];

// Mock messages for the first conversation
const initialMessages = {
  "1": [
    {
      id: "m1",
      sender: "Jane Smith",
      content: "Hello, I've received your maintenance request about the kitchen sink.",
      time: "10:15 AM",
      isSelf: false,
    },
    {
      id: "m2",
      sender: "You",
      content: "Thank you for the quick response. When can I expect someone to come fix it?",
      time: "10:20 AM",
      isSelf: true,
    },
    {
      id: "m3",
      sender: "Jane Smith",
      content: "I've scheduled a maintenance visit for tomorrow between 10 AM and 12 PM. Will you be available during that time?",
      time: "10:25 AM",
      isSelf: false,
    },
    {
      id: "m4",
      sender: "Jane Smith",
      content: "Also, please make sure the area around the sink is accessible.",
      time: "10:30 AM",
      isSelf: false,
    },
  ],
  "2": [
    {
      id: "m5",
      sender: "Property Management",
      content: "Your rent receipt for April has been generated and is available in the Documents section.",
      time: "Yesterday",
      isSelf: false,
    }
  ],
  "3": [
    {
      id: "m6",
      sender: "Maintenance Team",
      content: "We've received your request about the bathroom light fixture.",
      time: "Apr 22",
      isSelf: false,
    },
    {
      id: "m7",
      sender: "Maintenance Team",
      content: "We'll send a technician tomorrow morning between 9 AM and 11 AM.",
      time: "Apr 22",
      isSelf: false,
    },
    {
      id: "m8",
      sender: "You",
      content: "Thank you, I'll be available during that time.",
      time: "Apr 22",
      isSelf: true,
    }
  ]
};

// Mock contacts for new messages
const contactsList = [
  { id: "c1", name: "Jane Smith", role: "Landlord", avatar: "/placeholder.svg" },
  { id: "c2", name: "Property Management", role: "Administrator", avatar: "/placeholder.svg" },
  { id: "c3", name: "Maintenance Team", role: "Support", avatar: "/placeholder.svg" },
  { id: "c4", name: "John Tenant", role: "Tenant", apartment: "Unit 2B", avatar: "/placeholder.svg" },
  { id: "c5", name: "Sarah Johnson", role: "Tenant", apartment: "Unit 5A", avatar: "/placeholder.svg" },
  { id: "c6", name: "Michael Smith", role: "Tenant", apartment: "House 7", avatar: "/placeholder.svg" }
];

type MessagesViewProps = {
  userRole: "tenant" | "landlord";
};

export function MessagesView({ userRole }: MessagesViewProps) {
  const { toast } = useToast();
  const [conversations, setConversations] = useState(initialConversations);
  const [messages, setMessages] = useState(initialMessages);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);

  const handleSendMessage = (messageText: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMsg = {
      id: `m${Math.random().toString(36).substring(2, 9)}`,
      sender: "You",
      content: messageText,
      time: timeString,
      isSelf: true,
    };
    
    // Add the message to the conversation
    setMessages(prevMessages => ({
      ...prevMessages,
      [selectedConversation.id]: [...(prevMessages[selectedConversation.id] || []), newMsg]
    }));
    
    // Update the last message in the conversations list
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === selectedConversation.id ? {
          ...conv,
          lastMessage: messageText,
          time: timeString,
          unread: 0
        } : conv
      )
    );
    
    // Simulate a reply (for demo purposes)
    setTimeout(() => {
      const replyMessages = [
        "Thank you for your message. I'll get back to you shortly.",
        "Got it, I'll look into this right away.",
        "Thanks for letting me know.",
        "I'll address this as soon as possible.",
      ];
      
      const randomReply = replyMessages[Math.floor(Math.random() * replyMessages.length)];
      const replyTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const replyMsg = {
        id: `m${Math.random().toString(36).substring(2, 9)}`,
        sender: selectedConversation.name,
        content: randomReply,
        time: replyTimeString,
        isSelf: false,
      };
      
      setMessages(prevMessages => ({
        ...prevMessages,
        [selectedConversation.id]: [...(prevMessages[selectedConversation.id] || []), replyMsg]
      }));
      
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === selectedConversation.id ? {
            ...conv,
            lastMessage: randomReply,
            time: replyTimeString
          } : conv
        )
      );
    }, 2000);
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    
    // Mark as read
    if (conversation.unread > 0) {
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === conversation.id ? {
            ...conv,
            unread: 0
          } : conv
        )
      );
    }
  };

  const handleStartNewConversation = (contact) => {
    // Check if conversation already exists
    const existingConv = conversations.find(conv => conv.name === contact.name);
    
    if (existingConv) {
      setSelectedConversation(existingConv);
      setIsNewMessageDialogOpen(false);
      return;
    }
    
    // Create a new conversation
    const newConv = {
      id: `conv-${Math.random().toString(36).substring(2, 9)}`,
      name: contact.name,
      role: contact.role,
      lastMessage: "No messages yet",
      time: "Just now",
      unread: 0,
      avatar: contact.avatar
    };
    
    setConversations(prev => [newConv, ...prev]);
    setMessages(prev => ({
      ...prev,
      [newConv.id]: []
    }));
    
    setSelectedConversation(newConv);
    setIsNewMessageDialogOpen(false);
    
    toast({
      title: "Conversation Started",
      description: `You can now message ${contact.name}`
    });
  };

  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button onClick={() => setIsNewMessageDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100%-4rem)]">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
        />

        <Card className="md:col-span-2 h-full flex flex-col">
          <CardHeader className="pb-2 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <img 
                    src={selectedConversation.avatar} 
                    alt={selectedConversation.name}
                    className="rounded-full" 
                  />
                </Avatar>
                <div>
                  <CardTitle className="text-base">{selectedConversation.name}</CardTitle>
                  <p className="text-xs text-gray-500">{selectedConversation.role}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto py-4">
            <MessageDisplay messages={messages[selectedConversation.id]} />
          </CardContent>
          <MessageInput onSendMessage={handleSendMessage} />
        </Card>
      </div>

      <NewConversationDialog
        isOpen={isNewMessageDialogOpen}
        onOpenChange={setIsNewMessageDialogOpen}
        contacts={contactsList}
        userRole={userRole}
        onStartConversation={handleStartNewConversation}
      />
    </div>
  );
}
