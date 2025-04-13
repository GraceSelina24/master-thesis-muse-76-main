import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Dumbbell, 
  Calendar, 
  Clock, 
  Flame, 
  Trophy, 
  TrendingUp, 
  CheckCircle2, 
  Repeat2, 
  BarChart3, 
  Heart,
  Play,
  RefreshCw,
  Timer
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const workoutData = [
  {
    id: "workout-1",
    title: "Full Body HIIT",
    duration: 30,
    calories: 320,
    category: "cardio",
    level: "intermediate",
    equipment: ["None"],
    exercises: [
      { name: "Jumping Jacks", sets: 3, reps: "30 sec" },
      { name: "Push-ups", sets: 3, reps: "10-15" },
      { name: "Mountain Climbers", sets: 3, reps: "30 sec" },
      { name: "Bodyweight Squats", sets: 3, reps: "15-20" },
      { name: "Plank", sets: 3, reps: "45 sec" }
    ]
  },
  {
    id: "workout-2",
    title: "Upper Body Strength",
    duration: 45,
    calories: 280,
    category: "strength",
    level: "intermediate",
    equipment: ["Dumbbells"],
    exercises: [
      { name: "Dumbbell Bench Press", sets: 3, reps: "10-12" },
      { name: "Bent-over Rows", sets: 3, reps: "10-12" },
      { name: "Shoulder Press", sets: 3, reps: "10-12" },
      { name: "Bicep Curls", sets: 3, reps: "12-15" },
      { name: "Tricep Extensions", sets: 3, reps: "12-15" }
    ]
  },
  {
    id: "workout-3",
    title: "Lower Body Focus",
    duration: 40,
    calories: 300,
    category: "strength",
    level: "beginner",
    equipment: ["Resistance Band"],
    exercises: [
      { name: "Goblet Squats", sets: 3, reps: "12-15" },
      { name: "Romanian Deadlifts", sets: 3, reps: "10-12" },
      { name: "Walking Lunges", sets: 3, reps: "10 each leg" },
      { name: "Glute Bridges", sets: 3, reps: "15-20" },
      { name: "Calf Raises", sets: 3, reps: "20-25" }
    ]
  },
  {
    id: "workout-4",
    title: "Core Strength",
    duration: 25,
    calories: 200,
    category: "strength",
    level: "beginner",
    equipment: ["None"],
    exercises: [
      { name: "Crunches", sets: 3, reps: "15-20" },
      { name: "Leg Raises", sets: 3, reps: "12-15" },
      { name: "Russian Twists", sets: 3, reps: "20 twists" },
      { name: "Plank Shoulder Taps", sets: 3, reps: "30 sec" },
      { name: "Bicycle Crunches", sets: 3, reps: "15-20" }
    ]
  },
  {
    id: "workout-5",
    title: "Cardio Blast",
    duration: 20,
    calories: 250,
    category: "cardio",
    level: "intermediate",
    equipment: ["None"],
    exercises: [
      { name: "High Knees", sets: 3, reps: "30 sec" },
      { name: "Burpees", sets: 3, reps: "10-12" },
      { name: "Jump Squats", sets: 3, reps: "15-20" },
      { name: "Mountain Climbers", sets: 3, reps: "30 sec" },
      { name: "Skater Jumps", sets: 3, reps: "20" }
    ]
  },
  {
    id: "workout-6",
    title: "Leg Day",
    duration: 35,
    calories: 300,
    category: "strength",
    level: "advanced",
    equipment: ["Dumbbells"],
    exercises: [
      { name: "Squats", sets: 4, reps: "12-15" },
      { name: "Lunges", sets: 4, reps: "10 each leg" },
      { name: "Leg Press", sets: 4, reps: "10-12" },
      { name: "Calf Raises", sets: 4, reps: "15-20" },
      { name: "Leg Curls", sets: 4, reps: "12-15" }
    ]
  },
  {
    id: "workout-7",
    title: "Yoga Flow",
    duration: 45,
    calories: 150,
    category: "flexibility",
    level: "beginner",
    equipment: ["Yoga Mat"],
    exercises: [
      { name: "Sun Salutations", sets: 3, reps: "5 min" },
      { name: "Warrior Poses", sets: 3, reps: "5 min" },
      { name: "Tree Pose", sets: 3, reps: "2 min" },
      { name: "Bridge Pose", sets: 3, reps: "2 min" },
      { name: "Corpse Pose", sets: 3, reps: "5 min" }
    ]
  },
  {
    id: "workout-8",
    title: "HIIT Cardio",
    duration: 30,
    calories: 350,
    category: "cardio",
    level: "advanced",
    equipment: ["None"],
    exercises: [
      { name: "Jumping Jacks", sets: 3, reps: "30 sec" },
      { name: "Burpees", sets: 3, reps: "15" },
      { name: "High Knees", sets: 3, reps: "30 sec" },
      { name: "Mountain Climbers", sets: 3, reps: "30 sec" },
      { name: "Sprints", sets: 3, reps: "30 sec" }
    ]
  },
  {
    id: "workout-9",
    title: "Upper Body Pump",
    duration: 40,
    calories: 280,
    category: "strength",
    level: "intermediate",
    equipment: ["Dumbbells"],
    exercises: [
      { name: "Bench Press", sets: 3, reps: "10-12" },
      { name: "Shoulder Press", sets: 3, reps: "10-12" },
      { name: "Bicep Curls", sets: 3, reps: "12-15" },
      { name: "Tricep Dips", sets: 3, reps: "12-15" },
      { name: "Lat Pulldowns", sets: 3, reps: "10-12" }
    ]
  },
  {
    id: "workout-10",
    title: "Full Body Stretch",
    duration: 20,
    calories: 100,
    category: "flexibility",
    level: "beginner",
    equipment: ["Yoga Mat"],
    exercises: [
      { name: "Hamstring Stretch", sets: 3, reps: "30 sec" },
      { name: "Quad Stretch", sets: 3, reps: "30 sec" },
      { name: "Shoulder Stretch", sets: 3, reps: "30 sec" },
      { name: "Tricep Stretch", sets: 3, reps: "30 sec" },
      { name: "Neck Stretch", sets: 3, reps: "30 sec" }
    ]
  },
  {
    id: "workout-19",
    title: "Mobility and Stretching",
    duration: 30,
    calories: 100,
    category: "flexibility",
    level: "beginner",
    equipment: ["Yoga Mat"],
    exercises: [
      { name: "Cat-Cow Stretch", sets: 3, reps: "30 sec" },
      { name: "Child's Pose", sets: 3, reps: "30 sec" },
      { name: "Seated Forward Bend", sets: 3, reps: "30 sec" },
      { name: "Butterfly Stretch", sets: 3, reps: "30 sec" },
      { name: "Downward Dog", sets: 3, reps: "30 sec" }
    ]
  },
  {
    id: "workout-12",
    title: "Strength Circuit",
    duration: 30,
    calories: 250,
    category: "strength",
    level: "intermediate",
    equipment: ["Dumbbells"],
    exercises: [
      { name: "Deadlifts", sets: 3, reps: "10-12" },
      { name: "Bent-over Rows", sets: 3, reps: "10-12" },
      { name: "Shoulder Press", sets: 3, reps: "10-12" },
      { name: "Bicep Curls", sets: 3, reps: "12-15" },
      { name: "Tricep Extensions", sets: 3, reps: "12-15" }
    ]
  },
  {
    id: "workout-13",
    title: "Pilates Core",
    duration: 30,
    calories: 180,
    category: "flexibility",
    level: "beginner",
    equipment: ["Yoga Mat"],
    exercises: [
      { name: "Hundred", sets: 3, reps: "30 sec" },
      { name: "Roll-Up", sets: 3, reps: "10" },
      { name: "Leg Circles", sets: 3, reps: "10 each leg" },
      { name: "Plank", sets: 3, reps: "30 sec" },
      { name: "Side Plank", sets: 3, reps: "30 sec each side" }
    ]
  },
  {
    id: "workout-14",
    title: "Endurance Run",
    duration: 60,
    calories: 600,
    category: "cardio",
    level: "advanced",
    equipment: ["None"],
    exercises: [
      { name: "Warm-up Jog", sets: 1, reps: "10 min" },
      { name: "Steady Pace Run", sets: 1, reps: "40 min" },
      { name: "Cool Down Walk", sets: 1, reps: "10 min" }
    ]
  },
  {
    id: "workout-15",
    title: "Bodyweight Strength",
    duration: 30,
    calories: 250,
    category: "strength",
    level: "beginner",
    equipment: ["None"],
    exercises: [
      { name: "Push-ups", sets: 3, reps: "10-15" },
      { name: "Bodyweight Squats", sets: 3, reps: "15-20" },
      { name: "Lunges", sets: 3, reps: "10 each leg" },
      { name: "Plank", sets: 3, reps: "30 sec" },
      { name: "Burpees", sets: 3, reps: "10" }
    ]
  },
  {
    id: "workout-16",
    title: "Power Yoga",
    duration: 45,
    calories: 200,
    category: "flexibility",
    level: "intermediate",
    equipment: ["Yoga Mat"],
    exercises: [
      { name: "Sun Salutations", sets: 3, reps: "5 min" },
      { name: "Warrior Poses", sets: 3, reps: "5 min" },
      { name: "Tree Pose", sets: 3, reps: "2 min" },
      { name: "Bridge Pose", sets: 3, reps: "2 min" },
      { name: "Corpse Pose", sets: 3, reps: "5 min" }
    ]
  },
  {
    id: "workout-17",
    title: "Strength and Conditioning",
    duration: 40,
    calories: 300,
    category: "strength",
    level: "advanced",
    equipment: ["Dumbbells"],
    exercises: [
      { name: "Deadlifts", sets: 3, reps: "10-12" },
      { name: "Bench Press", sets: 3, reps: "10-12" },
      { name: "Squats", sets: 3, reps: "12-15" },
      { name: "Shoulder Press", sets: 3, reps: "10-12" },
      { name: "Bicep Curls", sets: 3, reps: "12-15" }
    ]
  },
  {
    id: "workout-18",
    title: "Cardio and Core",
    duration: 30,
    calories: 250,
    category: "cardio",
    level: "intermediate",
    equipment: ["None"],
    exercises: [
      { name: "Jumping Jacks", sets: 3, reps: "30 sec" },
      { name: "Burpees", sets: 3, reps: "10-12" },
      { name: "Mountain Climbers", sets: 3, reps: "30 sec" },
      { name: "Plank", sets: 3, reps: "30 sec" },
      { name: "Bicycle Crunches", sets: 3, reps: "15-20" }
    ]
  }
];

const activityData = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 65 },
  { name: 'Wed', value: 30 },
  { name: 'Thu', value: 85 },
  { name: 'Fri', value: 50 },
  { name: 'Sat', value: 75 },
  { name: 'Sun', value: 60 },
];

const workoutBreakdownData = [
  { name: 'Cardio', value: 45 },
  { name: 'Strength', value: 30 },
  { name: 'Flexibility', value: 15 },
  { name: 'Recovery', value: 10 },
];

const COLORS = ['#0EA5E9', '#F97316', '#10B981', '#8B5CF6'];

const CATEGORY_COLORS = {
  cardio: COLORS[0], // '#0EA5E9'
  strength: COLORS[1], // '#F97316'
  flexibility: COLORS[2], // '#10B981'
  recovery: COLORS[3] // '#8B5CF6'
};

const Fitness = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [currentWorkout, setCurrentWorkout] = useState(workoutData[0]); // Default to the first workout
  const [activeTimers, setActiveTimers] = useState({}); // Track active timers for each workout
  const [activeInterval, setActiveInterval] = useState(null); // Track the active interval ID

  const startTimer = (workoutId) => {
    // Stop the previous timer
    if (activeInterval) {
      clearInterval(activeInterval);
    }

    // Reset all timers and start the new one
    setActiveTimers({ [workoutId]: 0 });

    const interval = setInterval(() => {
      setActiveTimers((prevTimers) => {
        if (prevTimers[workoutId] !== undefined) {
          return {
            ...prevTimers,
            [workoutId]: prevTimers[workoutId] + 1 // Increment timer
          };
        }
        clearInterval(interval); // Clear interval if timer is removed
        return prevTimers;
      });
    }, 1000);

    setActiveInterval(interval); // Save the new interval ID
  };

  const stopTimer = () => {
    if (activeInterval) {
      clearInterval(activeInterval); // Stop the active timer
      setActiveInterval(null);
      setActiveTimers({}); // Clear all timers
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    const pushWorkoutsToDatabase = async () => {
      try {
        const response = await fetch("https://your-database-api-url.com/workouts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(workoutData)
        });
        if (response.ok) {
          console.log("Workouts successfully pushed to the database.");
        } else {
          console.error("Failed to push workouts to the database.");
        }
      } catch (error) {
        console.error("Error pushing workouts to the database:", error);
      }
    };

    pushWorkoutsToDatabase();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Fitness Planner</h1>
        <p className="text-gray-600">Track your workouts and reach your fitness goals</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="col-span-3 md:col-span-2">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Your workout consistency over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value) => [`${value}% of daily goal`, 'Activity']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0EA5E9" 
                    strokeWidth={3}
                    dot={{ r: 6, fill: "#0EA5E9", strokeWidth: 0 }}
                    activeDot={{ r: 8, fill: "#0EA5E9", strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workout Breakdown</CardTitle>
            <CardDescription>Types of workouts this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workoutBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {workoutBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {workoutBreakdownData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="w-full md:w-auto mb-4">
          <TabsTrigger value="today" className="flex-1">Today</TabsTrigger>
          <TabsTrigger value="weekly" className="flex-1">Weekly Plan</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="animate-slide-up">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Today's Workout</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className="bg-accent text-white">
                    <Flame className="h-4 w-4 mr-1" />
                    Recommended
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const randomWorkout = workoutData[Math.floor(Math.random() * workoutData.length)];
                      setCurrentWorkout(randomWorkout); // Update the current workout
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Plan
                  </Button>
                </div>
              </div>
              <CardDescription>{currentWorkout.title} - {currentWorkout.level.charAt(0).toUpperCase() + currentWorkout.level.slice(1)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3 mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <h4 className="text-sm font-medium">Duration</h4>
                    <p className="text-2xl font-bold">{currentWorkout.duration} min</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Flame className="h-5 w-5 text-accent mr-3" />
                  <div>
                    <h4 className="text-sm font-medium">Calories</h4>
                    <p className="text-2xl font-bold">{currentWorkout.calories} kcal</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Dumbbell className="h-5 w-5 text-secondary mr-3" />
                  <div>
                    <h4 className="text-sm font-medium">Equipment</h4>
                    <p className="text-2xl font-bold">{currentWorkout.equipment.join(', ')}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Exercises</h3>
                <div className="grid gap-4">
                  {currentWorkout.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-3">
                          {index + 1}
                        </div>
                        <span className="font-medium">{exercise.name}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">{exercise.sets} sets × {exercise.reps}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              {activeTimers[currentWorkout.id] !== undefined ? (
                <div
                  className="flex items-center text-primary cursor-pointer"
                  onClick={stopTimer} // Stop the timer when clicked
                >
                  <Timer className="h-5 w-5 mr-2" />
                  <span>{formatTime(activeTimers[currentWorkout.id])}</span>
                </div>
              ) : (
                <Button className="w-full md:w-auto" onClick={() => startTimer(currentWorkout.id)}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Workout
                </Button>
              )}
            </CardFooter>
          </Card>

          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-secondary" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Workouts Completed</span>
                      <span className="font-medium">4/5</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Weekly Goal</span>
                      <span className="font-medium">320/400 min</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Calories Burned</span>
                      <span className="font-medium">1850/2000 kcal</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-accent" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center p-2 rounded-md bg-gray-50">
                    <CheckCircle2 className="h-5 w-5 text-secondary mr-3" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">Workout Streak</h4>
                      <p className="text-xs text-gray-500">3 days in a row</p>
                    </div>
                  </div>
                  <div className="flex items-center p-2 rounded-md bg-gray-50">
                    <CheckCircle2 className="h-5 w-5 text-secondary mr-3" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">1000 Calories Milestone</h4>
                      <p className="text-xs text-gray-500">Burned 1000+ calories this week</p>
                    </div>
                  </div>
                  <div className="flex items-center p-2 rounded-md bg-gray-50">
                    <CheckCircle2 className="h-5 w-5 text-secondary mr-3" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">Variety Champion</h4>
                      <p className="text-xs text-gray-500">Tried 3 different workout types</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Fitness Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-sm">Avg. Heart Rate</span>
                    </div>
                    <span className="font-medium">132 bpm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Flame className="h-5 w-5 text-accent mr-2" />
                      <span className="text-sm">Calories/Workout</span>
                    </div>
                    <span className="font-medium">310 kcal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-primary mr-2" />
                      <span className="text-sm">Avg. Duration</span>
                    </div>
                    <span className="font-medium">42 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Repeat2 className="h-5 w-5 text-secondary mr-2" />
                      <span className="text-sm">Weekly Frequency</span>
                    </div>
                    <span className="font-medium">4 times</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Workout Plan</CardTitle>
              <CardDescription>Your personalized exercise plan for this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => {
                  const workout = index < 3 ? workoutData[index] : index === 3 ? workoutData[0] : null;
                  const isCompleted = index < 2;
                  const isToday = index === 2;

                  return (
                    <div key={day} className="flex items-center p-4 border rounded-lg">
                      <div className="w-24 font-medium">{day}</div>
                      {workout ? (
                        <div className="flex-1 flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{workout.title}</h4>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{workout.duration} min</span>
                              <Flame className="h-4 w-4 ml-3 mr-1" />
                              <span>{workout.calories} kcal</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {isCompleted ? (
                              <Badge className="bg-secondary text-white">Completed</Badge>
                            ) : isToday ? (
                              <Button size="sm" onClick={() => startTimer(workout.id)}>
                                <Play className="h-4 w-4 mr-2" />
                                Start Workout
                              </Button>
                            ) : (
                              <Badge variant="outline" className="text-gray-600">Upcoming</Badge>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-gray-500">Rest Day</span>
                          <Badge variant="outline" className="text-gray-600">Recovery</Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>Your recent workout sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (index + 1));
                  const workout = workoutData[index % workoutData.length];

                  return (
                    <div key={index} className="flex items-center p-4 border rounded-lg">
                      <div className="w-24 text-sm">
                        <span className="font-medium">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span className="block text-gray-500">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{workout.title}</h4>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{workout.duration} min</span>
                            <Flame className="h-4 w-4 ml-3 mr-1" />
                            <span>{workout.calories} kcal</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All History</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Workout Library</CardTitle>
          <CardDescription>Browse recommended workouts based on your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workoutData.map((workout) => (
              <Card key={workout.id} className="flex flex-col h-full border-2 hover:border-primary transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{workout.title}</CardTitle>
                      <CardDescription>{workout.category.charAt(0).toUpperCase() + workout.category.slice(1)} • {workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}</CardDescription>
                    </div>
                    <Badge style={{ backgroundColor: CATEGORY_COLORS[workout.category] }}>
                      {workout.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-sm">{workout.duration} min</span>
                    </div>
                    <div className="flex items-center">
                      <Flame className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-sm">{workout.calories} kcal</span>
                    </div>
                    <div className="flex items-center">
                      <Dumbbell className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-sm">{workout.equipment.join(', ')}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {workout.exercises.slice(0, 3).map((exercise, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{exercise.name}</span>
                        <span className="text-gray-500">{exercise.sets} × {exercise.reps}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center mt-auto pt-4">
                  {activeTimers[workout.id] !== undefined ? (
                    <div
                      className="flex items-center text-primary cursor-pointer"
                      onClick={stopTimer} // Stop the timer when clicked
                    >
                      <Timer className="h-5 w-5 mr-2" />
                      <span>{formatTime(activeTimers[workout.id])}</span>
                    </div>
                  ) : (
                    <Button className="w-full md:w-auto" onClick={() => startTimer(workout.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Workout
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Fitness;
