import { useState, useEffect } from "react";
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
import { apiClient } from "@/lib/api";
import { Message, User } from "@/types";

type MessagesViewProps = {
  userRole: "tenant" | "landlord";
};

export function MessagesView({ userRole }: MessagesViewProps) {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Message[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [selectedConversation, setSelectedConversation] = useState<Message | null>(null);
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState<User[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [convResponse, contactsResponse] = await Promise.all([
          apiClient.getMessages(),
          userRole === 'landlord' ? apiClient.getMyTenants() : Promise.resolve({ success: true, data: [] }) // Assuming tenants can only message landlord, which is a single contact
        ]);

        if (convResponse.success) {
          setConversations(convResponse.data);
          if (convResponse.data.length > 0) {
            setSelectedConversation(convResponse.data[0]);
          }
        } else {
          toast({ title: "Error", description: "Failed to fetch conversations", variant: "destructive" });
        }

        if (contactsResponse.success) {
          setContacts(contactsResponse.data);
        } else {
          toast({ title: "Error", description: "Failed to fetch contacts", variant: "destructive" });
        }

      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch initial data";
        toast({ title: "Error", description: message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [toast, userRole]);

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        setIsLoading(true);
        try {
          const response = await apiClient.getMessagesForConversation(selectedConversation.id);
          if (response.success) {
            setMessages(prev => ({ ...prev, [selectedConversation.id]: response.data }));
          } else {
            toast({
              title: "Error",
              description: "Failed to fetch messages",
              variant: "destructive",
            });
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Failed to fetch messages";
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
    }
  }, [selectedConversation, toast]);

  const handleSendMessage = async (messageText: string) => {
    if (!selectedConversation) return;

    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      content: messageText,
      date: new Date().toISOString(),
      read: true,
      from: 'You',
      subject: selectedConversation.subject,
      name: 'You',
      role: 'user',
      avatar: '',
      unread: 0,
      time: new Date().toLocaleTimeString(),
      lastMessage: messageText,
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), optimisticMessage],
    }));

    try {
      await apiClient.sendMessage({
        id: selectedConversation.id,
        content: messageText,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to send message";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      // Revert optimistic update
      setMessages(prev => ({
        ...prev,
        [selectedConversation.id]: prev[selectedConversation.id].filter(m => m.id !== optimisticMessage.id),
      }));
    }
  };

  const handleSelectConversation = async (conversation: Message) => {
    setSelectedConversation(conversation);

    if (!conversation.read) {
      try {
        await apiClient.markMessageRead(conversation.id);
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversation.id ? { ...conv, read: true } : conv
          )
        );
      } catch (error) {
        // Handle error silently for now
      }
    }
  };

  const handleStartNewConversation = async (contact: User, subject: string, content: string) => {
    try {
      const response = await apiClient.startConversation({
        recipientId: contact.id,
        subject,
        content,
      });
      if (response.success) {
        setConversations(prev => [response.data, ...prev]);
        setSelectedConversation(response.data);
        setIsNewMessageDialogOpen(false);
        toast({
          title: "Conversation Started",
          description: `You can now message ${contact.name}`
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to start conversation",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to start conversation";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  if (isLoading && conversations.length === 0) {
    return <div>Loading messages...</div>;
  }

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
          {selectedConversation ? (
            <>
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>No conversation selected.</p>
            </div>
          )}
        </Card>
      </div>

      <NewConversationDialog
        isOpen={isNewMessageDialogOpen}
        onOpenChange={setIsNewMessageDialogOpen}
        contacts={contacts}
        userRole={userRole}
        onStartConversation={handleStartNewConversation}
      />
    </div>
  );
}
