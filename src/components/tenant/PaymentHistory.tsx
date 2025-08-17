
import { mockPayments } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PaymentHistoryView() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Payment History</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {new Date(payment.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>KES {payment.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        payment.status === "completed" 
                          ? "success" 
                          : payment.status === "pending" 
                            ? "outline" 
                            : "destructive"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{payment.method || "Bank Transfer"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-sm font-medium text-gray-500">Total Paid</div>
                <div className="mt-1 text-2xl font-bold">
                  KES {mockPayments
                    .filter(p => p.status === "completed")
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-sm font-medium text-gray-500">Pending</div>
                <div className="mt-1 text-2xl font-bold">
                  KES {mockPayments
                    .filter(p => p.status === "pending")
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-sm font-medium text-gray-500">Overdue</div>
                <div className="mt-1 text-2xl font-bold text-red-600">
                  KES {mockPayments
                    .filter(p => p.status === "overdue")
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
