import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, FileText, Download, Upload, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api";
import { Document } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function DocumentsView() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- Lease state ---------------------------------------------------------
  const [unitId, setUnitId] = useState<string | number | null>(null);
  const [leaseTerms, setLeaseTerms] = useState<string>("");
  const [leaseAcceptedAt, setLeaseAcceptedAt] = useState<string | null>(null);
  const hasLease = !!leaseTerms;

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.getDocuments();
        if (response.success) {
          setDocuments(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch documents",
            variant: "destructive",
          });
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch documents";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, [toast]);

  // ------------------------------------------------------------------
  // Fetch tenant unit & lease terms
  // ------------------------------------------------------------------
  useEffect(() => {
    const fetchLease = async () => {
      try {
        const unitRes = await apiClient.getMyUnit();
        if (unitRes.success && unitRes.data) {
          const id = (unitRes.data as any).id;
          setUnitId(id);
          const leaseRes = await apiClient.getTenantLease(id);
          if (leaseRes.success && leaseRes.data) {
            setLeaseTerms(leaseRes.data.lease_terms ?? "");
            setLeaseAcceptedAt(leaseRes.data.lease_accepted_at ?? null);
          }
        }
      } catch (err) {
        // silent fail – lease banner simply won't show
        console.error("Failed to load lease info", err);
      }
    };
    fetchLease();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const showLeaseBanner = hasLease && !leaseAcceptedAt;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Documents</h1>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* ------------------------------------------------------------------
       * Contract acknowledgement banner
       * ------------------------------------------------------------------ */}
      {showLeaseBanner ? (
        <Card className="border-l-4 border-[#1A1F2C]/80 bg-[#F8F9FC]">
          <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-[#1A1F2C]" />
              <p className="text-sm">
                Your lease contract is available. Please review and acknowledge
                the terms &amp; conditions.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: "Lease Preview",
                    description:
                      leaseTerms.length > 0
                        ? leaseTerms.slice(0, 100) + (leaseTerms.length > 100 ? "..." : "")
                        : "No lease terms text available.",
                  });
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Contract
              </Button>
              <Button
                size="sm"
                className="bg-[#1A1F2C] hover:bg-[#151922] text-white"
                onClick={async () => {
                  if (!unitId) return;
                  try {
                    const res = await apiClient.acceptTenantLease(unitId);
                    if (res.success) {
                      setLeaseAcceptedAt(new Date().toISOString());
                      toast({
                        title: "Contract Accepted",
                        description: "You have agreed to the terms of the tenancy contract.",
                      });
                    }
                  } catch (err) {
                    toast({
                      title: "Error",
                      description: "Failed to accept lease terms.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Agree&nbsp;to&nbsp;Terms
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-l-4 border-yellow-500 bg-yellow-50">
          <CardContent className="p-4 flex items-center gap-3">
            <FileText className="h-6 w-6 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              No tenancy contract has been uploaded yet.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">All Documents</p>
              <p className="text-xl font-bold">{documents.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="p-2 rounded-full bg-green-100 text-green-600 mr-4">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Contracts</p>
              <p className="text-xl font-bold">{documents.filter(d => d.category === 'Contract').length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Receipts</p>
              <p className="text-xl font-bold">{documents.filter(d => d.category === 'Receipt').length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Information</p>
              <p className="text-xl font-bold">{documents.filter(d => d.category === 'Information').length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="max-w-md w-full">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search documents..." 
              className="w-full pl-8"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">All</Button>
          <Button variant="outline" size="sm">Contracts</Button>
          <Button variant="outline" size="sm">Receipts</Button>
          <Button variant="outline" size="sm">Information</Button>
        </div>
      </div>

      <div className="overflow-hidden border rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((document) => (
              <tr key={document.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                      <FileText className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{document.name}</div>
                      <div className="text-xs text-gray-500">From: {document.sender}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline">{document.category}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(document.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {document.size} ({document.type})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
