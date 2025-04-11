import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '../components/ui/calendar';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

type Event = {
  id: string;
  type: 'health' | 'meal' | 'workout';
  title: string;
  date: Date;
  description?: string;
};

// Mock API functions since the actual APIs aren't implemented
const mockApi = {
  getHealthData: (userId: string): Promise<any[]> => {
    return Promise.resolve([
      {
        id: '1',
        date: new Date(2023, 4, 15),
        weight: 68.5,
        bmi: 22.1
      }
    ]);
  },
  getMeals: (userId: string): Promise<any[]> => {
    return Promise.resolve([
      {
        id: '1',
        name: 'Breakfast',
        date: new Date(2023, 4, 15),
        calories: 450
      }
    ]);
  },
  getWorkouts: (userId: string): Promise<any[]> => {
    return Promise.resolve([
      {
        id: '1',
        name: 'Morning Run',
        date: new Date(2023, 4, 15),
        duration: 30
      }
    ]);
  }
};

export default function CalendarPage() {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    try {
      const [healthData, meals, workouts] = await Promise.all([
        mockApi.getHealthData(user!.id),
        mockApi.getMeals(user!.id),
        mockApi.getWorkouts(user!.id),
      ]);

      const allEvents: Event[] = [
        ...healthData.map(data => ({
          id: data.id,
          type: 'health' as const,
          title: 'Health Check',
          date: new Date(data.date),
          description: `Weight: ${data.weight}kg, BMI: ${data.bmi}`,
        })),
        ...meals.map(meal => ({
          id: meal.id,
          type: 'meal' as const,
          title: meal.name,
          date: new Date(meal.date),
          description: `${meal.calories} calories`,
        })),
        ...workouts.map(workout => ({
          id: workout.id,
          type: 'workout' as const,
          title: workout.name,
          date: new Date(workout.date),
          description: `${workout.duration} minutes`,
        })),
      ];

      setEvents(allEvents);
    } catch (error) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'health':
        return 'bg-blue-100 text-blue-800';
      case 'meal':
        return 'bg-green-100 text-green-800';
      case 'workout':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>View your health activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Events</CardTitle>
            <CardDescription>
              {date ? `Events for ${format(date, 'MMMM d, yyyy')}` : 'Select a date to view events'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {date ? (
              <div className="space-y-4">
                {getEventsForDate(date).length > 0 ? (
                  getEventsForDate(date).map(event => (
                    <div
                      key={event.id}
                      className={`p-4 rounded-lg ${getEventColor(event.type)}`}
                    >
                      <h3 className="font-semibold">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm mt-1">{event.description}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    No events scheduled for this date
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Select a date to view events</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 