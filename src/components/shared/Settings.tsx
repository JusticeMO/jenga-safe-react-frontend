
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";

type SettingsViewProps = {
  userRole: "tenant" | "landlord";
};

export function SettingsView({ userRole }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Account Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24">
                    <img src="/placeholder.svg" alt="Profile" />
                  </Avatar>
                </div>
                <div className="flex-1 space-y-2">
                  <Button variant="outline" size="sm">
                    Upload New Photo
                  </Button>
                  <p className="text-sm text-gray-500">
                    JPG, GIF or PNG. Max size of 800K
                  </p>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={userRole === "tenant" ? "John" : "Jane"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={userRole === "tenant" ? "Doe" : "Smith"} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={userRole === "tenant" ? "tenant@example.com" : "landlord@example.com"} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue="+254 712 345 678" />
              </div>
              
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailRent" className="flex-1">
                      Rent Reminders
                    </Label>
                    <Switch id="emailRent" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailMaintenance" className="flex-1">
                      Maintenance Updates
                    </Label>
                    <Switch id="emailMaintenance" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailMessages" className="flex-1">
                      New Messages
                    </Label>
                    <Switch id="emailMessages" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailDocuments" className="flex-1">
                      New Documents
                    </Label>
                    <Switch id="emailDocuments" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">SMS Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smsRent" className="flex-1">
                      Rent Reminders
                    </Label>
                    <Switch id="smsRent" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smsMaintenance" className="flex-1">
                      Maintenance Updates
                    </Label>
                    <Switch id="smsMaintenance" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smsEmergency" className="flex-1">
                      Emergency Alerts
                    </Label>
                    <Switch id="smsEmergency" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enable 2FA</h3>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch id="2fa" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Trusted Devices</h3>
                  <p className="text-sm text-gray-500">
                    Manage devices that can access your account
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="darkMode" className="flex-1">
                    Dark Mode
                  </Label>
                  <Switch id="darkMode" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoLogin" className="flex-1">
                    Remember me on this device
                  </Label>
                  <Switch id="autoLogin" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="language" className="flex-1">
                    Language
                  </Label>
                  <select className="form-select rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
                    <option>English</option>
                    <option>Swahili</option>
                    <option>French</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="timezone" className="flex-1">
                    Timezone
                  </Label>
                  <select className="form-select rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
                    <option>Africa/Nairobi (GMT +3)</option>
                    <option>UTC (GMT +0)</option>
                    <option>America/New_York (GMT -5)</option>
                  </select>
                </div>
              </div>
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
