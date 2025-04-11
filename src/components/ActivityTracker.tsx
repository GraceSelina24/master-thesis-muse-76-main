import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, Activity, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "react-hot-toast";
import { useAuth } from '../hooks/useAuth';

interface Activity {
  id: string;
  name: string;
  description: string;
  duration: number;
  calories: number;
  type: string;
  date: string;
}

interface ActivityData {
  name: string;
  duration: string;
  calories: string;
  type: string;
  date: string;
}

const ActivityTracker = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activityData, setActivityData] = useState<ActivityData>({
    name: '',
    duration: '',
    calories: '',
    type: 'walking',
    date: new Date().toISOString()
  });

  useEffect(() => {
    if (user?.id) {
      fetchActivities();
    }
  }, [user?.id]);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:3001/api/workouts/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to fetch activities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to add activities');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:3001/api/workouts/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: activityData.name,
          duration: Number(activityData.duration),
          calories: Number(activityData.calories),
          type: activityData.type,
          date: activityData.date
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add activity');
      }

      const newActivity = await response.json();
      setActivities(prevActivities => [...prevActivities, newActivity]);
      setActivityData({
        name: '',
        duration: '',
        calories: '',
        type: 'walking',
        date: new Date().toISOString()
      });
      setIsDialogOpen(false);
      toast.success('Activity added successfully!');
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error('Failed to add activity');
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Attempting to delete activity:', activityId);
      
      const response = await fetch(`http://localhost:3001/api/workouts/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Log the response status and headers
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Get the response text first to see what we're dealing with
      const responseText = await response.text();
      console.log('Response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Server returned an invalid response');
      }
      
      if (!response.ok) {
        console.error('Delete response not OK:', data);
        throw new Error(data.error || 'Failed to delete activity');
      }

      console.log('Activity deleted successfully:', data);
      setActivities(prevActivities => 
        prevActivities.filter(activity => activity.id !== activityId)
      );
      toast.success('Activity deleted successfully!');
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete activity');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Today's Activities</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 w-8 sm:h-9 sm:w-auto">
              <Plus className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Add Activity</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Activity</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddActivity} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="hidden sm:block">Name</Label>
                  <Input
                    id="name"
                    placeholder="Activity name"
                    value={activityData.name}
                    onChange={(e) => setActivityData({ ...activityData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type" className="hidden sm:block">Type</Label>
                  <Select
                    value={activityData.type}
                    onValueChange={(value) => setActivityData({ ...activityData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walking">Walking</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="cycling">Cycling</SelectItem>
                      <SelectItem value="swimming">Swimming</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration" className="hidden sm:block">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="Duration in minutes"
                    value={activityData.duration}
                    onChange={(e) => setActivityData({ ...activityData, duration: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="calories" className="hidden sm:block">Calories Burned</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="Calories burned"
                    value={activityData.calories}
                    onChange={(e) => setActivityData({ ...activityData, calories: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Add Activity</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No activities recorded today
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center space-x-4">
                  <Activity className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{activity.name}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">{activity.calories} kcal</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.duration} minutes
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteActivity(activity.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTracker;
