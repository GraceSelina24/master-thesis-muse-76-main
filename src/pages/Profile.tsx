import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'react-hot-toast';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';

interface UserProfile {
  name: string;
  email: string;
  height: number;
  weight: number;
  age: number;
  gender: string;
  activityLevel: string;
  dietaryPreferences: string[];
  healthGoals: string[];
  heightUnit: string;
  weightUnit: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editableProfile, setEditableProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('Fetching profile...');
        console.log('Token:', token.substring(0, 10) + '...');

        const response = await fetch('http://localhost:3001/api/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
        });

        console.log('Response received:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });
          throw new Error(`Failed to fetch profile data: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('Profile data received:', data);
        
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid profile data received');
        }

        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleUpdateProfile = async (updatedProfile: UserProfile) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:3001/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      setProfile(data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  const handleEditClick = () => {
    setEditableProfile({ ...profile });
  };

  const handleSaveClick = () => {
    if (editableProfile) {
      handleUpdateProfile(editableProfile);
      setEditableProfile(null);
    }
  };

  const handleCancelClick = () => {
    setEditableProfile(null);
  };

  const handleChange = (field: keyof UserProfile, value: string | number) => {
    setEditableProfile((prev) => prev ? ({ ...prev, [field]: value }) : null);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Please log in to view your profile</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleEditClick} disabled={!!editableProfile}>
            Edit Profile
          </Button>
          {editableProfile && (
            <>
              <Button variant="default" onClick={handleSaveClick}>
                Save
              </Button>
              <Button variant="secondary" onClick={handleCancelClick}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editableProfile ? editableProfile.name : profile.name}
                readOnly={!editableProfile}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={editableProfile ? editableProfile.email : profile.email}
                readOnly={!editableProfile}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                value={editableProfile ? editableProfile.age : profile.age}
                readOnly={!editableProfile}
                onChange={(e) => handleChange('age', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input id="gender" value={profile.gender} readOnly />
            </div>
          </CardContent>
        </Card>

        {/* Health Information */}
        <Card>
          <CardHeader>
            <CardTitle>Health Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height ({profile.heightUnit})</Label>
              <Input
                id="height"
                value={editableProfile ? editableProfile.height : profile.height}
                readOnly={!editableProfile}
                onChange={(e) => handleChange('height', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight ({profile.weightUnit})</Label>
              <Input
                id="weight"
                value={editableProfile ? editableProfile.weight : profile.weight}
                readOnly={!editableProfile}
                onChange={(e) => handleChange('weight', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Input
                id="activityLevel"
                value={editableProfile ? editableProfile.activityLevel : profile.activityLevel}
                readOnly={!editableProfile}
                onChange={(e) => handleChange('activityLevel', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences & Goals */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Preferences & Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Dietary Preferences</Label>
              <div className="flex flex-wrap gap-2">
                {profile.dietaryPreferences.map((pref, index) => (
                  <Badge key={index} variant="secondary">
                    {pref}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Health Goals</Label>
              <div className="flex flex-wrap gap-2">
                {profile.healthGoals.map((goal, index) => (
                  <Badge key={index} variant="outline">
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;