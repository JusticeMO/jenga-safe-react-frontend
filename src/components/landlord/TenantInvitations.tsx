
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Mail, RotateCw, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TenantInviteDialog } from "./TenantInviteDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Invitation = {
  id: string;
  code: string;
  email: string;
  propertyName: string;
  unitNumber: string;
  rent: number;
  createdAt: string;
  status: "pending" | "used" | "expired";
};

export function TenantInvitationsView() {
  const { toast } = useToast();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: "inv1",
      code: "A7B9C2D4",
      email: "john.doe@example.com",
      propertyName: "Riverside Villas",
      unitNumber: "A102",
      rent: 28000,
      createdAt: "2025-05-10T10:30:00Z",
      status: "pending"
    },
    {
      id: "inv2",
      code: "E5F3G8H1",
      email: "sarah.smith@example.com",
      propertyName: "Sunshine Apartments",
      unitNumber: "B201",
      rent: 32000,
      createdAt: "2025-05-08T14:15:00Z",
      status: "used"
    },
    {
      id: "inv3",
      code: "J6K2L9M4",
      email: "michael.brown@example.com",
      propertyName: "Mountain View Residences",
      unitNumber: "C301",
      rent: 45000,
      createdAt: "2025-05-01T09:45:00Z",
      status: "expired"
    }
  ]);

  const handleInviteSent = (email: string, propertyId: string, unitId: string) => {
    // In a real app, this would come from the API response
    const newInvitation: Invitation = {
      id: `inv${Math.random().toString(36).substring(2, 6)}`,
      code: Math.random().toString(36).substring(2, 10).toUpperCase(),
      email,
      propertyName: "Riverside Villas", // This would come from the property details
      unitNumber: "A102", // This would come from the unit details
      rent: 28000, // This would come from the unit details
      createdAt: new Date().toISOString(),
      status: "pending"
    };
    
    setInvitations([newInvitation, ...invitations]);
    setIsInviteDialogOpen(false);
    
    toast({
      title: "Invitation Sent",
      description: `Invitation code has been sent to ${email}`
    });
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Invitation code copied to clipboard"
    });
  };

  const resendInvitation = (id: string) => {
    toast({
      title: "Invitation Resent",
      description: "The invitation has been resent to the tenant"
    });
  };

  const deleteInvitation = (id: string) => {
    setInvitations(invitations.filter(inv => inv.id !== id));
    toast({
      title: "Invitation Deleted",
      description: "The invitation has been permanently deleted"
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "used":
        return <Badge className="bg-green-100 text-green-800">Used</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tenant Invitations</h1>
        <Button onClick={() => setIsInviteDialogOpen(true)}>
          <Mail className="mr-2 h-4 w-4" />
          Send New Invitation
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">
            Invite new tenants by sending them a unique invitation code. 
            They'll use this code when signing up to be automatically connected to their assigned unit.
          </p>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invitation Code</TableHead>
            <TableHead>Tenant Email</TableHead>
            <TableHead>Property & Unit</TableHead>
            <TableHead>Rent Amount</TableHead>
            <TableHead>Sent Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell className="font-mono">{invitation.code}</TableCell>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>
                {invitation.propertyName}
                <br />
                <span className="text-sm text-gray-500">Unit {invitation.unitNumber}</span>
              </TableCell>
              <TableCell>KES {invitation.rent.toLocaleString()}</TableCell>
              <TableCell>{new Date(invitation.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{getStatusBadge(invitation.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyInviteCode(invitation.code)}
                    disabled={invitation.status !== "pending"}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy Code</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => resendInvitation(invitation.id)}
                    disabled={invitation.status !== "pending"}
                  >
                    <RotateCw className="h-4 w-4" />
                    <span className="sr-only">Resend</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteInvitation(invitation.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TenantInviteDialog 
        open={isInviteDialogOpen} 
        onOpenChange={setIsInviteDialogOpen}
        onInviteSent={handleInviteSent}
      />
    </div>
  );
}
