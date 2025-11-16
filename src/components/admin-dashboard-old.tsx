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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Droplets, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Plus,
  Edit,
  Save,
  RefreshCw
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DONOR' | 'RECIPIENT';
  phone?: string;
  bloodGroup?: string;
  age?: number;
  gender?: string;
}

interface Donation {
  id: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  notes?: string;
  user: User;
}

interface BloodRequest {
  id: string;
  bloodGroup: string;
  units: number;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FULFILLED';
  notes?: string;
  createdAt: string;
  requester: User;
}

interface InventoryItem {
  id: string;
  bloodGroup: string;
  quantity: number;
}

interface AdminDashboardProps {
  type?: 'donations' | 'requests' | 'inventory';
}

export default function AdminDashboard({ type = 'donations' }: AdminDashboardProps) {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingInventory, setEditingInventory] = useState<{[key: string]: number}>({});

  useEffect(() => {
    if (user) {
      fetchDonations();
      fetchRequests();
      fetchInventory();
    }
  }, [user]);

  const fetchDonations = async () => {
    try {
      const response = await fetch('/api/donations/all');
      const data = await response.json();
      
      if (response.ok) {
        setDonations(data.donations);
      } else {
        setError('Failed to fetch donations');
      }
    } catch (err) {
      setError('An error occurred while fetching donations');
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/requests/all');
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
        const initialEditingState = data.inventory.reduce((acc: any, item: InventoryItem) => {
          acc[item.id] = item.quantity;
          return acc;
        }, {});
        setEditingInventory(initialEditingState);
      } else {
        setError('Failed to fetch inventory');
      }
    } catch (err) {
      setError('An error occurred while fetching inventory');
    }
  };

  const updateDonationStatus = async (donationId: string, status: string, notes?: string) => {
    try {
      const response = await fetch('/api/donations/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ donationId, status, notes }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Donation status updated successfully');
        fetchDonations();
        fetchInventory();
      } else {
        setError(data.error || 'Failed to update donation status');
      }
    } catch (err) {
      setError('An error occurred while updating donation status');
    }
  };

  const updateRequestStatus = async (requestId: string, status: string, notes?: string) => {
    try {
      const response = await fetch('/api/requests/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId, status, notes }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Blood request status updated successfully');
        fetchRequests();
        fetchInventory();
      } else {
        setError(data.error || 'Failed to update blood request status');
      }
    } catch (err) {
      setError('An error occurred while updating blood request status');
    }
  };

  const updateInventory = async (itemId: string, quantity: number) => {
    try {
      const item = inventory.find(i => i.id === itemId);
      if (!item) return;

      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bloodGroup: item.bloodGroup, quantity }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Inventory updated successfully');
        fetchInventory();
      } else {
        setError(data.error || 'Failed to update inventory');
      }
    } catch (err) {
      setError('An error occurred while updating inventory');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'APPROVED':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'COMPLETED':
      case 'FULFILLED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getBloodGroupLabel = (bloodGroup: string) => {
    return bloodGroup.replace('_', ' ').replace('POSITIVE', '+').replace('NEGATIVE', '-');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Donations Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Donation Management</CardTitle>
              <CardDescription>Manage donor appointments and track donations</CardDescription>
            </div>
            <Button variant="outline" onClick={fetchDonations}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No donations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{donation.user.name}</div>
                          <div className="text-sm text-gray-500">{donation.user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(donation.date)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {donation.user.bloodGroup ? getBloodGroupLabel(donation.user.bloodGroup) : 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(donation.status)}</TableCell>
                      <TableCell className="max-w-xs truncate">{donation.notes || '-'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {donation.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateDonationStatus(donation.id, 'APPROVED')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateDonationStatus(donation.id, 'REJECTED')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {donation.status === 'APPROVED' && (
                            <Button
                              size="sm"
                              onClick={() => updateDonationStatus(donation.id, 'COMPLETED')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blood Requests Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Blood Requests</CardTitle>
              <CardDescription>Manage and approve blood requests from recipients</CardDescription>
            </div>
            <Button variant="outline" onClick={fetchRequests}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No blood requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.requester.name}</div>
                          <div className="text-sm text-gray-500">{request.requester.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getBloodGroupLabel(request.bloodGroup)}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.units}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.reason || '-'}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {request.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateRequestStatus(request.id, 'APPROVED')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateRequestStatus(request.id, 'REJECTED')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {request.status === 'APPROVED' && (
                            <Button
                              size="sm"
                              onClick={() => updateRequestStatus(request.id, 'FULFILLED')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Fulfill
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inventory Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Manage blood bank inventory and stock levels</CardDescription>
            </div>
            <Button variant="outline" onClick={fetchInventory}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {inventory.length === 0 ? (
            <div className="text-center py-8">
              <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No inventory data available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {inventory.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold">{getBloodGroupLabel(item.bloodGroup)}</span>
                    <Badge 
                      variant={item.quantity <= 5 ? 'destructive' : item.quantity <= 10 ? 'default' : 'secondary'}
                    >
                      {item.quantity <= 5 ? 'Critical' : item.quantity <= 10 ? 'Low' : 'Good'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={editingInventory[item.id] || item.quantity}
                      onChange={(e) => setEditingInventory({
                        ...editingInventory,
                        [item.id]: parseInt(e.target.value) || 0
                      })}
                      min="0"
                      className="w-20"
                    />
                    <Button
                      size="sm"
                      onClick={() => updateInventory(item.id, editingInventory[item.id])}
                      disabled={editingInventory[item.id] === item.quantity}
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">units available</p>
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