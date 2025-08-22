
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, MessageCircle, Phone, Mail, FileText, HelpCircle } from "lucide-react";

type HelpViewProps = {
  userRole: "tenant" | "landlord";
};

export function HelpView({ userRole }: HelpViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Common FAQs
  const commonFaqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. Follow the instructions sent to your email to create a new password."
    },
    {
      question: "How do I update my contact information?",
      answer: "To update your contact information, go to Settings > Account and update your details. Don't forget to click 'Save Changes' when you're done."
    }
  ];
  
  // Role-specific FAQs
  const tenantFaqs = [
    {
      question: "How do I submit a maintenance request?",
      answer: "Navigate to the 'Maintenance' section from the sidebar. Click on 'New Request' and fill out the form with details about the issue. You can also upload photos of the problem to help maintenance staff better understand the issue."
    },
    {
      question: "How do I pay my rent online?",
      answer: "To pay rent online, go to the 'Payments' section. You can use a credit/debit card, bank transfer, or mobile money. The system will generate a receipt once your payment is processed."
    },
    {
      question: "When is my rent due?",
      answer: "Your rent is due on the 1st of each month. You can view your payment schedule in the 'Payments' section of your tenant portal."
    },
    {
      question: "How do I extend my lease?",
      answer: "Contact your landlord through the messaging system to discuss lease extension options. If agreed upon, you'll receive a new lease document to sign electronically through the Documents section."
    }
  ];
  
  const landlordFaqs = [
    {
      question: "How do I add a new property?",
      answer: "Go to the 'Properties' section and click on 'Add Property'. Fill in the property details, upload photos, and set rent information. You can also add multiple units to a single property."
    },
    {
      question: "How do I process rent payments?",
      answer: "All online rent payments are automatically processed through the system. You can view all transactions in the 'Reports' section. You can also manually record cash payments if needed."
    },
    {
      question: "How do I add a new tenant?",
      answer: "Navigate to 'Tenants' and click 'Add Tenant'. Enter their information and assign them to a property unit. You can also send them an invitation to create their account."
    },
    {
      question: "How do I respond to maintenance requests?",
      answer: "Go to the 'Maintenance' section to view all requests. Click on a request to see details and assign it to a maintenance worker or contractor. You can also communicate with the tenant about the request."
    }
  ];
  
  // Combine FAQs based on user role
  const faqs = [...commonFaqs, ...(userRole === "tenant" ? tenantFaqs : landlordFaqs)];
  
  // Filter FAQs based on search term
  const filteredFaqs = searchTerm 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : faqs;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Help & Support</h1>
      
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Search for help topics..." 
            className="w-full pl-10 text-lg h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <MessageCircle className="h-10 w-10 text-primary mb-2" />
            <h3 className="font-medium">Live Chat</h3>
            <p className="text-sm text-gray-500 mb-4">Chat with our support team</p>
            <Button variant="outline">Start Chat</Button>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Phone className="h-10 w-10 text-primary mb-2" />
            <h3 className="font-medium">Call Support</h3>
            <p className="text-sm text-gray-500 mb-4">Available 9am-6pm weekdays</p>
            <Button variant="outline">+254 712 345 678</Button>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Mail className="h-10 w-10 text-primary mb-2" />
            <h3 className="font-medium">Email Support</h3>
            <p className="text-sm text-gray-500 mb-4">We respond within 24 hours</p>
            <Button variant="outline">Send Email</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {filteredFaqs.length === 0 && (
              <div className="text-center py-6">
                <p className="text-gray-500">No results found for "{searchTerm}"</p>
                <p className="text-sm mt-2">Try a different search term or contact support for assistance.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              User Guides & Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Getting Started Guide</h3>
              <p className="text-sm text-gray-500 mb-2">A complete overview of the platform and how to use it.</p>
              <Button variant="link" className="p-0">View Guide</Button>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">
                {userRole === "tenant" ? "Making Payments Tutorial" : "Managing Properties Tutorial"}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {userRole === "tenant" 
                  ? "Learn how to set up and process rent and other payments."
                  : "Learn how to efficiently manage multiple properties and units."
                }
              </p>
              <Button variant="link" className="p-0">Watch Video</Button>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">
                {userRole === "tenant" ? "Maintenance Requests Guide" : "Tenant Management Guide"}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {userRole === "tenant"
                  ? "How to submit and track maintenance requests effectively."
                  : "Best practices for tenant onboarding, communication, and management."
                }
              </p>
              <Button variant="link" className="p-0">Read Article</Button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">All Tutorials</h3>
              <p className="text-sm text-gray-500 mb-2">Browse our complete library of guides and tutorials.</p>
              <Button variant="link" className="p-0">View All</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
