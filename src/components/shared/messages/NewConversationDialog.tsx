
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

interface Contact {
  id: string;
  name: string;
  role: string;
  apartment?: string;
  avatar: string;
}

interface NewConversationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contacts: Contact[];
  userRole: "tenant" | "landlord";
  onStartConversation: (contact: Contact) => void;
}

export function NewConversationDialog({
  isOpen,
  onOpenChange,
  contacts,
  userRole,
  onStartConversation
}: NewConversationDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = contacts.filter(contact => 
    // For landlords, show only tenants; for tenants, show only non-tenants
    (userRole === "landlord" ? contact.role === "Tenant" : contact.role !== "Tenant") && 
    (contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     (contact.apartment && contact.apartment.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>
            Select a {userRole === "landlord" ? "tenant" : "contact"} to message
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
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
                onClick={() => onStartConversation(contact)}
              >
                <Avatar>
                  <img 
                    src={contact.avatar} 
                    alt={contact.name} 
                    className="rounded-full"
                  />
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{contact.name}</p>
                  <p className="text-xs text-gray-500">
                    {contact.role}
                    {contact.apartment ? ` - ${contact.apartment}` : ''}
                  </p>
                </div>
              </div>
            ))}
            
            {filteredContacts.length === 0 && (
              <p className="text-center text-gray-500 py-4">No contacts found</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
