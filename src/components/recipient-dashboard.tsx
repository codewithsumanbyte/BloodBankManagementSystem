'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Droplets, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Search,
  Calendar
} from 'lucide-react';

interface BloodRequest {
  id: string;
  bloodGroup: string;
  units: number;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FULFILLED';
  notes?: string;
  createdAt: string;
  requester: {
    name: string;
    email: string;
    phone: string;
  };
}

interface InventoryItem {
  id: string;
  bloodGroup: string;
  quantity: number;
}

export default function RecipientDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    bloodGroup: '',
    units: '',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchRequests();
      fetchInventory();
    }
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/requests?requesterId=${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setRequests(data.requests);
      } else {
        setError('Failed to fetch blood requests');
      }
    } catch (err) {
      setError('An error occurred while fetching blood requests');
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/inventory');
      const data = await response.json();
      
      if (response.ok) {
        setInventory(data.inventory);
      } else {
        setError('Failed to fetch inventory');
      }
    } catch (err) {
      setError('An error occurred while fetching inventory');
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requesterId: user?.id,
          bloodGroup: requestData.bloodGroup,
          units: parseInt(requestData.units),
          reason: requestData.reason,
          notes: requestData.notes
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Blood request created successfully!');
        setShowRequestForm(false);
        setRequestData({ bloodGroup: '', units: '', reason: '', notes: '' });
        fetchRequests();
      } else {
        setError(data.error || 'Failed to create blood request');
      }
    } catch (err) {
      setError('An error occurred while creating blood request');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'APPROVED':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'FULFILLED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Fulfilled</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInventoryStatus = (quantity: number) => {
    if (quantity === 0) return { status: 'Critical', color: 'text-red-500', badge: 'destructive' };
    if (quantity <= 5) return { status: 'Low', color: 'text-yellow-500', badge: 'default' };
    return { status: 'Available', color: 'text-green-500', badge: 'secondary' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBloodGroupLabel = (bloodGroup: string) => {
    return bloodGroup.replace('_', ' ').replace('POSITIVE', '+').replace('NEGATIVE', '-');
  };

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recipient Profile</CardTitle>
          <CardDescription>Your personal information and request history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                <p className="text-lg font-semibold">{user?.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <p className="text-lg">{user?.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Blood Group</Label>
                <p className="text-lg font-semibold text-red-600">{user?.bloodGroup || 'Not specified'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Phone</Label>
                <p className="text-lg">{user?.phone || 'Not specified'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Age</Label>
                <p className="text-lg">{user?.age || 'Not specified'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Gender</Label>
                <p className="text-lg">{user?.gender || 'Not specified'}</p>
              </div>
            </div>
          </div>
          {user?.address && (
            <div className="mt-4">
              <Label className="text-sm font-medium text-gray-500">Address</Label>
              <p className="text-lg">{user.address}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blood Request Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Request Blood</CardTitle>
              <CardDescription>Submit a new blood request</CardDescription>
            </div>
            <Button 
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </div>
        </CardHeader>
        {showRequestForm && (
          <CardContent>
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group Required</Label>
                  <Select value={requestData.bloodGroup} onValueChange={(value) => setRequestData({ ...requestData, bloodGroup: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A_POSITIVE">A+</SelectItem>
                      <SelectItem value="A_NEGATIVE">A-</SelectItem>
                      <SelectItem value="B_POSITIVE">B+</SelectItem>
                      <SelectItem value="B_NEGATIVE">B-</SelectItem>
                      <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                      <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                      <SelectItem value="O_POSITIVE">O+</SelectItem>
                      <SelectItem value="O_NEGATIVE">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units">Units Required</Label>
                  <Input
                    id="units"
                    type="number"
                    placeholder="Number of units"
                    value={requestData.units}
                    onChange={(e) => setRequestData({ ...requestData, units: e.target.value })}
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Request (Optional)</Label>
                <Input
                  id="reason"
                  type="text"
                  placeholder="Medical reason or emergency details"
                  value={requestData.reason}
                  onChange={(e) => setRequestData({ ...requestData, reason: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information or special requirements"
                  value={requestData.notes}
                  onChange={(e) => setRequestData({ ...requestData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Request'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Blood Bank Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Blood Bank Inventory</CardTitle>
          <CardDescription>Current availability of blood units</CardDescription>
        </CardHeader>
        <CardContent>
          {inventory.length === 0 ? (
            <div className="text-center py-8">
              <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No inventory data available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {inventory.map((item) => {
                const statusInfo = getInventoryStatus(item.quantity);
                return (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold">{getBloodGroupLabel(item.bloodGroup)}</span>
                      <Badge variant={statusInfo.badge as any}>{statusInfo.status}</Badge>
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {item.quantity}
                    </div>
                    <p className="text-sm text-gray-500">units available</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request History */}
      <Card>
        <CardHeader>
          <CardTitle>Request History</CardTitle>
          <CardDescription>Your blood request status and history</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No blood requests found</p>
              <p className="text-sm text-gray-400 mt-2">Submit your first blood request</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Droplets className="w-4 h-4 text-red-500" />
                        <span className="font-medium">{request.units} units of {getBloodGroupLabel(request.bloodGroup)}</span>
                      </div>
                      <p className="text-sm text-gray-600">Requested on {formatDate(request.createdAt)}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  {request.reason && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Reason:</strong> {request.reason}
                    </p>
                  )}
                  {request.notes && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Notes:</strong> {request.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}