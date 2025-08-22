
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bell, CheckCircle, Calendar, FileText, Wrench } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function RecentActivity() {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  
  // Enhanced activity data with more property history
  const activities = [
    {
      id: 1,
      type: "payment",
      title: "Rent payment confirmed",
      date: "June 1, 2023",
      amount: "KES 25,000",
      icon: <CheckCircle className="w-4 h-4" />,
      iconBg: "bg-green-100 text-green-800"
    },
    {
      id: 2,
      type: "bill",
      title: "Water bill generated",
      date: "June 15, 2023",
      amount: "KES 1,200",
      icon: <Bell className="w-4 h-4" />,
      iconBg: "bg-blue-100 text-blue-800"
    },
    {
      id: 3,
      type: "reminder",
      title: "Rent reminder sent",
      date: "June 28, 2023",
      icon: <AlertTriangle className="w-4 h-4" />,
      iconBg: "bg-yellow-100 text-yellow-800"
    },
    {
      id: 4,
      type: "maintenance",
      title: "Maintenance request completed",
      date: "May 25, 2023",
      details: "Plumbing repair in bathroom",
      icon: <Wrench className="w-4 h-4" />,
      iconBg: "bg-purple-100 text-purple-800"
    },
    {
      id: 5,
      type: "lease",
      title: "Lease renewal notice",
      date: "May 15, 2023",
      details: "Your lease expires in 45 days",
      icon: <FileText className="w-4 h-4" />,
      iconBg: "bg-indigo-100 text-indigo-800"
    },
    {
      id: 6,
      type: "inspection",
      title: "Property inspection scheduled",
      date: "May 10, 2023",
      details: "Annual inspection on May 20",
      icon: <Calendar className="w-4 h-4" />,
      iconBg: "bg-teal-100 text-teal-800"
    },
  ];

  const displayedActivities = showAll ? activities : activities.slice(0, 3);
  
  const handleViewAll = () => {
    if (showAll) {
      setShowAll(false);
    } else {
      setShowAll(true);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Recent Activity</h2>
        <Button variant="ghost" size="sm" onClick={handleViewAll}>
          {showAll ? "Show Less" : "View All"}
        </Button>
      </div>
      <div className="space-y-4">
        {displayedActivities.map(activity => (
          <div key={activity.id} className="p-4 rounded-lg border bg-white flex items-start">
            <div className={`mr-4 mt-0.5 p-2 rounded-full ${activity.iconBg}`}>
              {activity.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{activity.title}</h3>
              <p className="text-sm text-gray-500">
                {activity.date}{activity.amount ? ` • ${activity.amount}` : ""}
              </p>
              {activity.details && (
                <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
              )}
            </div>
            {activity.type === "maintenance" && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => navigate("/tenant/maintenance")}
              >
                Details
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
