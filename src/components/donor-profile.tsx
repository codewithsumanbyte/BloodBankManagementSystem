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
import { Calendar, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';

interface Donation {
  id: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  notes?: string;
  user: {
    name: string;
    email: string;
    bloodGroup?: string;
  };
}

export default function DonorProfile() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');

  useEffect(() => {
    if (user) {
      fetchDonations();
    }
  }, [user]);

  const fetchDonations = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/donations?userId=${user.id}`);
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

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    console.log('Creating appointment with data:', {
      userId: user?.id,
      date: appointmentDate,
      notes: appointmentNotes
    });

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          date: appointmentDate,
          notes: appointmentNotes
        }),
      });

      const data = await response.json();
      console.log('Appointment creation response:', data);

      if (response.ok) {
        setSuccess('Appointment created successfully!');
        setShowAppointmentForm(false);
        setAppointmentDate('');
        setAppointmentNotes('');
        fetchDonations();
      } else {
        setError(data.error || 'Failed to create appointment');
        console.error('Failed to create appointment:', data.error);
      }
    } catch (err) {
      setError('An error occurred while creating appointment');
      console.error('Error creating appointment:', err);
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
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Donor Profile</CardTitle>
          <CardDescription>Your personal information and donation history</CardDescription>
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

      {/* New Appointment Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Schedule Donation</CardTitle>
              <CardDescription>Book a new blood donation appointment</CardDescription>
            </div>
            <Button 
              onClick={() => setShowAppointmentForm(!showAppointmentForm)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </CardHeader>
        {showAppointmentForm && (
          <CardContent>
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appointmentDate">Appointment Date & Time</Label>
                  <Input
                    id="appointmentDate"
                    type="datetime-local"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointmentNotes">Notes (Optional)</Label>
                  <Input
                    id="appointmentNotes"
                    type="text"
                    placeholder="Any special requirements or notes"
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowAppointmentForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Donation History */}
      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
          <CardDescription>Your past and upcoming donation appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No donation appointments found</p>
              <p className="text-sm text-gray-400 mt-2">Schedule your first donation appointment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <div key={donation.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{formatDate(donation.date)}</span>
                    </div>
                    {getStatusBadge(donation.status)}
                  </div>
                  {donation.notes && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Notes:</strong> {donation.notes}
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