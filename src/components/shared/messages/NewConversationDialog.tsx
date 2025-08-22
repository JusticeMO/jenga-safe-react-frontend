
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { User } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface NewConversationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contacts: User[];
  userRole: "tenant" | "landlord";
  onStartConversation: (contact: User, subject: string, content: string) => void;
}

export function NewConversationDialog({
  isOpen,
  onOpenChange,
  contacts,
  userRole,
  onStartConversation
}: NewConversationDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const filteredContacts = contacts.filter(contact => 
    (userRole === "landlord" ? contact.role === "tenant" : contact.role !== "tenant") &&
    (contact.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStartConversation = () => {
    if (selectedContact && subject && content) {
      onStartConversation(selectedContact, subject, content);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        setSelectedContact(null);
        setSubject("");
        setContent("");
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>
            Select a {userRole === "landlord" ? "tenant" : "contact"} to message
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {!selectedContact ? (
            <>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={`Search ${userRole === "landlord" ? "tenants" : "contacts"}...`}
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredContacts.map(contact => (
                  <div
                    key={contact.id}
                    className="p-2 rounded-md cursor-pointer hover:bg-gray-100 flex items-center space-x-3"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <Avatar>
                      <img
                        src={contact.profile_picture || "/placeholder.svg"}
                        alt={contact.name}
                        className="rounded-full"
                      />
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.role}</p>
                    </div>
                  </div>
                ))}
                {filteredContacts.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No contacts found</p>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>To:</Label>
                <p className="font-medium">{selectedContact.name}</p>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="content">Message</Label>
                <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          {selectedContact && <Button onClick={handleStartConversation}>Send Message</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
