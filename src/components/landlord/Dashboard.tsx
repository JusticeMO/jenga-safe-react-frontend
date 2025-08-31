import { mockProperties } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export function LandlordDashboard() {
  const navigate = useNavigate();
  const totalUnits = mockProperties.reduce((acc, prop) => acc + prop.units, 0);
  const occupiedUnits = mockProperties.reduce((acc, prop) => acc + prop.occupiedUnits, 0);
  const occupancyRate = Math.round((occupiedUnits / totalUnits) * 100);
  
  const handleAddProperty = () => {
    navigate("/landlord/property/new");
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Overview</h1>
        <Button onClick={handleAddProperty}>
          <Plus className="w-5 h-5 mr-2" />
          Add Property
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-500">Total Properties</h2>
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">{mockProperties.length}</p>
          <p className="text-sm text-gray-500 mt-2">{totalUnits} units total</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-500">Occupancy Rate</h2>
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">{occupancyRate}%</p>
          <p className="text-sm text-gray-500 mt-2">{occupiedUnits} of {totalUnits} units occupied</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-500">Rent Collected</h2>
            <div className="p-2 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">KES 425,000</p>
          <p className="text-sm text-green-600 mt-2">+12% from last month</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-500">Outstanding Rent</h2>
            <div className="p-2 rounded-full bg-red-100 text-red-600">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">KES 75,000</p>
          <p className="text-sm text-red-600 mt-2">3 tenants with overdue rent</p>
        </div>
      </div>
      
      {/* Team & Delegation quick-access card */}
      <div className="p-6 bg-white rounded-lg shadow-sm border flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-medium">Team &amp; Delegation</h2>
          <p className="text-sm text-gray-600">
            Invite property managers or update their access levels.
          </p>
        </div>
        <Button
          className="mt-4 md:mt-0"
          onClick={() => navigate('/landlord/settings#delegation')}
        >
          Manage Delegation
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium">Your Properties</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collected</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Riverside Apartments</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">12 units</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">10/12 (83%)</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">KES 250,000</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-red-600">KES 50,000</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button variant="outline" size="sm" onClick={() => navigate("/landlord/property/1")}>
                    View Details
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Green Gardens Estate</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">8 units</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">7/8 (88%)</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">KES 175,000</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-red-600">KES 25,000</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button variant="outline" size="sm" onClick={() => navigate("/landlord/property/2")}>
                    View Details
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Recent Activity</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 rounded-lg border bg-white flex items-start">
            <div className="mr-4 p-2 rounded-full bg-green-100 text-green-600">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Rent payment received from John Doe</h3>
              <p className="text-sm text-gray-500">2023-07-01</p>
            </div>
            <div className="text-green-600 font-medium">
              KES 25,000
            </div>
          </div>
          
          <div className="p-4 rounded-lg border bg-white flex items-start">
            <div className="mr-4 p-2 rounded-full bg-yellow-100 text-yellow-600">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h3 className="font-medium">Maintenance request from Unit 5B</h3>
              <p className="text-sm text-gray-500">2023-06-30</p>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border bg-white flex items-start">
            <div className="mr-4 p-2 rounded-full bg-green-100 text-green-600">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <h3 className="font-medium">New lease signed for Unit 3A</h3>
              <p className="text-sm text-gray-500">2023-06-28</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
