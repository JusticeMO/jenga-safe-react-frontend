
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface UpcomingPayment {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
}

interface UpcomingPaymentsTableProps {
  payments: UpcomingPayment[];
  onMakePayment: (payment: UpcomingPayment) => void;
}

export function UpcomingPaymentsTable({ payments, onMakePayment }: UpcomingPaymentsTableProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'overflow-x-auto -mx-4 px-4' : ''}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="whitespace-nowrap">{payment.description}</TableCell>
              <TableCell className="whitespace-nowrap">
                {new Date(payment.dueDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="whitespace-nowrap">KES {payment.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant="outline">Upcoming</Badge>
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-[#ea384c] hover:bg-[#ea384c]/10"
                  onClick={() => onMakePayment(payment)}
                >
                  Pay Now
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
