import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'react-hot-toast';
import { Badge } from '../components/ui/badge';

interface UserSettings {
  theme: string;
  language: string;
  heightUnit: string;
  weightUnit: string;
  calorieUnit: string;
  distanceUnit: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  mealReminders: boolean;
  workoutReminders: boolean;
  progressUpdates: boolean;
  goalNotifications: boolean;
  subscriptionStatus: string;
  subscriptionEndDate: string | null;
}

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:3001/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }

        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchSettings();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
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
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof UserSettings, value: any) => {
    if (settings) {
      setSettings({
        ...settings,
        [field]: value,
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Please log in to access settings</p>
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

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No settings data available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Units Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Units</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heightUnit">Height Unit</Label>
                <Select 
                  value={settings.heightUnit} 
                  onValueChange={(value) => handleChange('heightUnit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select height unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cm">Centimeters (cm)</SelectItem>
                    <SelectItem value="in">Inches (in)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weightUnit">Weight Unit</Label>
                <Select 
                  value={settings.weightUnit} 
                  onValueChange={(value) => handleChange('weightUnit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select weight unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="lb">Pounds (lb)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="calorieUnit">Calorie Unit</Label>
                <Select 
                  value={settings.calorieUnit} 
                  onValueChange={(value) => handleChange('calorieUnit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select calorie unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kcal">Kilocalories (kcal)</SelectItem>
                    <SelectItem value="kJ">Kilojoules (kJ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="distanceUnit">Distance Unit</Label>
                <Select 
                  value={settings.distanceUnit} 
                  onValueChange={(value) => handleChange('distanceUnit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select distance unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="km">Kilometers (km)</SelectItem>
                    <SelectItem value="mi">Miles (mi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value) => handleChange('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => handleChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications" className="block mb-1">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch 
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications" className="block mb-1">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications on your device</p>
                </div>
                <Switch 
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleChange('pushNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="mealReminders" className="block mb-1">Meal Reminders</Label>
                  <p className="text-sm text-gray-500">Get reminded about your meal plans</p>
                </div>
                <Switch 
                  id="mealReminders"
                  checked={settings.mealReminders}
                  onCheckedChange={(checked) => handleChange('mealReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="workoutReminders" className="block mb-1">Workout Reminders</Label>
                  <p className="text-sm text-gray-500">Get notified about scheduled workouts</p>
                </div>
                <Switch 
                  id="workoutReminders"
                  checked={settings.workoutReminders}
                  onCheckedChange={(checked) => handleChange('workoutReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="progressUpdates" className="block mb-1">Progress Updates</Label>
                  <p className="text-sm text-gray-500">Get updates on your health progress</p>
                </div>
                <Switch 
                  id="progressUpdates"
                  checked={settings.progressUpdates}
                  onCheckedChange={(checked) => handleChange('progressUpdates', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="goalNotifications" className="block mb-1">Goal Notifications</Label>
                  <p className="text-sm text-gray-500">Get notified when you reach your goals</p>
                </div>
                <Switch 
                  id="goalNotifications"
                  checked={settings.goalNotifications}
                  onCheckedChange={(checked) => handleChange('goalNotifications', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Information */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label>Current Plan:</Label>
                <Badge variant={settings.subscriptionStatus === "premium" ? "default" : "secondary"}>
                  {settings.subscriptionStatus.charAt(0).toUpperCase() + settings.subscriptionStatus.slice(1)}
                </Badge>
              </div>
              
              {settings.subscriptionEndDate && (
                <div className="flex items-center space-x-2">
                  <Label>Renewal Date:</Label>
                  <span>{new Date(settings.subscriptionEndDate).toLocaleDateString()}</span>
                </div>
              )}
              
              {settings.subscriptionStatus !== "premium" && (
                <Button variant="outline" className="mt-4">
                  Upgrade to Premium
                </Button>
              )}
              
              {settings.subscriptionStatus === "premium" && (
                <Button variant="outline" className="mt-4">
                  Manage Subscription
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;