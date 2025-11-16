'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Droplets, 
  Users, 
  Heart, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  LogOut,
  User,
  Settings,
  Activity,
  FileText
} from 'lucide-react';
import DonorProfile from './donor-profile';
import RecipientDashboard from './recipient-dashboard';
import AdminDashboardComponent from './admin-dashboard';

export default function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return null; // This should be handled by the main page
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      case 'DONOR': return 'bg-green-100 text-green-800';
      case 'RECIPIENT': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Settings className="h-5 w-5" />;
      case 'DONOR': return <Heart className="h-5 w-5" />;
      case 'RECIPIENT': return <Droplets className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const renderAdminDashboard = () => (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="donations">Donations</TabsTrigger>
        <TabsTrigger value="requests">Requests</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blood Units</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">432</div>
              <p className="text-xs text-muted-foreground">Available in inventory</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">Scheduled this week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Blood Inventory Status</CardTitle>
              <CardDescription>Current blood stock levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { group: 'A+', units: 45, status: 'good' },
                  { group: 'A-', units: 12, status: 'low' },
                  { group: 'B+', units: 38, status: 'good' },
                  { group: 'B-', units: 8, status: 'critical' },
                  { group: 'AB+', units: 15, status: 'good' },
                  { group: 'AB-', units: 5, status: 'critical' },
                  { group: 'O+', units: 67, status: 'good' },
                  { group: 'O-', units: 22, status: 'good' },
                ].map((item) => (
                  <div key={item.group} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{item.group}</span>
                      <Badge variant={item.status === 'critical' ? 'destructive' : item.status === 'low' ? 'default' : 'secondary'}>
                        {item.units} units
                      </Badge>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === 'critical' ? 'bg-red-500' : 
                      item.status === 'low' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'New donor registration', user: 'John Doe', time: '2 hours ago' },
                  { action: 'Blood request approved', user: 'Jane Smith', time: '4 hours ago' },
                  { action: 'Donation completed', user: 'Mike Johnson', time: '6 hours ago' },
                  { action: 'Inventory updated', user: 'System', time: '1 day ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="donations">
        <AdminDashboardComponent type="donations" user={user} />
      </TabsContent>

      <TabsContent value="requests">
        <AdminDashboardComponent type="requests" user={user} />
      </TabsContent>

      <TabsContent value="inventory">
        <AdminDashboardComponent type="inventory" user={user} />
      </TabsContent>
    </Tabs>
  );

  const renderDonorDashboard = () => (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Lifetime donations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Donation</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Months ago</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Eligible</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Month from now</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled donation appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Blood Donation</p>
                    <p className="text-sm text-muted-foreground">March 15, 2024 at 10:00 AM</p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div className="text-center text-muted-foreground">
                  <p>No other appointments scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
              <CardDescription>Your past donation records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: 'Dec 15, 2023', status: 'Completed', bloodGroup: 'A+' },
                  { date: 'Sep 20, 2023', status: 'Completed', bloodGroup: 'A+' },
                  { date: 'Jun 10, 2023', status: 'Completed', bloodGroup: 'A+' },
                ].map((donation, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{donation.date}</p>
                      <p className="text-sm text-muted-foreground">{donation.bloodGroup}</p>
                    </div>
                    <Badge variant="secondary">{donation.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="appointments">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Management</CardTitle>
            <CardDescription>View and manage your donation appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Appointment management interface will be implemented here.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="profile">
        <DonorProfile />
      </TabsContent>
    </Tabs>
  );

  const renderRecipientDashboard = () => (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="requests">My Requests</TabsTrigger>
        <TabsTrigger value="inventory">Blood Bank</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blood Requests</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Total requests</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fulfilled Requests</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Requests</CardTitle>
              <CardDescription>Your blood request status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">2 units of A+</p>
                    <p className="text-sm text-muted-foreground">Requested on March 10, 2024</p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div className="text-center text-muted-foreground">
                  <p>No other active requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blood Availability</CardTitle>
              <CardDescription>Current blood bank inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { group: 'A+', units: 45, status: 'Available' },
                  { group: 'A-', units: 12, status: 'Limited' },
                  { group: 'B+', units: 38, status: 'Available' },
                  { group: 'B-', units: 8, status: 'Limited' },
                  { group: 'AB+', units: 15, status: 'Available' },
                  { group: 'AB-', units: 5, status: 'Critical' },
                  { group: 'O+', units: 67, status: 'Available' },
                  { group: 'O-', units: 22, status: 'Available' },
                ].map((item) => (
                  <div key={item.group} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{item.group}</span>
                      <Badge variant={item.status === 'Critical' ? 'destructive' : item.status === 'Limited' ? 'default' : 'secondary'}>
                        {item.units} units
                      </Badge>
                    </div>
                    <span className={`text-xs ${
                      item.status === 'Critical' ? 'text-red-500' : 
                      item.status === 'Limited' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="requests">
        <RecipientDashboard />
      </TabsContent>

      <TabsContent value="inventory">
        <RecipientDashboard />
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-red-600">Blood Bank</h1>
              <span className="ml-2 text-gray-600">Management System</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getRoleIcon(user.role)}
                <span className="font-medium">{user.name}</span>
                <Badge className={getRoleColor(user.role)}>
                  {user.role}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h2>
          <p className="mt-2 text-gray-600">
            {user.role === 'ADMIN' && 'Manage the blood bank system efficiently.'}
            {user.role === 'DONOR' && 'Thank you for your valuable donations.'}
            {user.role === 'RECIPIENT' && 'Manage your blood requests and check availability.'}
          </p>
        </div>

        <Separator className="mb-8" />

        {user.role === 'ADMIN' && renderAdminDashboard()}
        {user.role === 'DONOR' && renderDonorDashboard()}
        {user.role === 'RECIPIENT' && renderRecipientDashboard()}
      </main>
    </div>
  );
}