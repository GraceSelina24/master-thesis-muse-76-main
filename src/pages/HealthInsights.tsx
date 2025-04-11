import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Heart, 
  Scale, 
  Utensils, 
  Dumbbell, 
  Zap,
  Download
} from 'lucide-react';

const weightData = [
  { date: 'Week 1', value: 78.4 },
  { date: 'Week 2', value: 77.8 },
  { date: 'Week 3', value: 77.2 },
  { date: 'Week 4', value: 76.5 },
  { date: 'Week 5', value: 76.7 },
  { date: 'Week 6', value: 75.9 },
  { date: 'Week 7', value: 75.6 },
  { date: 'Week 8', value: 75.2 },
];

const nutrientData = [
  { name: 'Mon', protein: 95, carbs: 180, fat: 65 },
  { name: 'Tue', protein: 110, carbs: 200, fat: 70 },
  { name: 'Wed', protein: 90, carbs: 150, fat: 60 },
  { name: 'Thu', protein: 105, carbs: 175, fat: 55 },
  { name: 'Fri', protein: 120, carbs: 190, fat: 65 },
  { name: 'Sat', protein: 85, carbs: 220, fat: 75 },
  { name: 'Sun', protein: 100, carbs: 170, fat: 60 },
];

const calorieData = [
  { name: 'Mon', consumed: 2000, burned: 2300, amt: 2400 },
  { name: 'Tue', consumed: 2100, burned: 2210, amt: 2400 },
  { name: 'Wed', consumed: 1800, burned: 2290, amt: 2400 },
  { name: 'Thu', consumed: 2300, burned: 2000, amt: 2400 },
  { name: 'Fri', consumed: 1900, burned: 2400, amt: 2400 },
  { name: 'Sat', consumed: 2500, burned: 2200, amt: 2400 },
  { name: 'Sun', consumed: 2100, burned: 1900, amt: 2400 },
];

const insightsData = [
  {
    id: "insight-1",
    title: "Nutritional Balance",
    description: "Your protein intake has been consistent and within target range. Maintaining this balance is excellent for your muscle recovery and overall health goals.",
    category: "nutrition",
    type: "positive",
    date: "2025-04-04"
  },
  {
    id: "insight-2",
    title: "Caloric Surplus Detected",
    description: "You've had a slight caloric surplus over the past 5 days, which could impact your weight loss goals. Consider adjusting portion sizes or increasing activity level.",
    category: "nutrition",
    type: "warning",
    date: "2025-04-03"
  },
  {
    id: "insight-3",
    title: "Workout Consistency",
    description: "Great job maintaining your workout schedule! You've completed 5 workouts in the past 7 days, which aligns perfectly with your fitness goals.",
    category: "fitness",
    type: "positive",
    date: "2025-04-02"
  },
  {
    id: "insight-4",
    title: "Hydration Pattern",
    description: "Your hydration levels tend to drop in the afternoons. Setting a reminder to drink water around 2-4 PM could help maintain optimal hydration throughout the day.",
    category: "health",
    type: "suggestion",
    date: "2025-04-01"
  },
  {
    id: "insight-5",
    title: "Heart Rate Trends",
    description: "Your average resting heart rate has decreased by 5 bpm over the last month, indicating improved cardiovascular fitness. Keep up the good work!",
    category: "health",
    type: "positive",
    date: "2025-03-29"
  }
];

const getInsightIcon = (category: string) => {
  switch (category) {
    case 'nutrition':
      return <Utensils className="h-5 w-5" />;
    case 'fitness':
      return <Dumbbell className="h-5 w-5" />;
    case 'health':
      return <Heart className="h-5 w-5" />;
    default:
      return <Zap className="h-5 w-5" />;
  }
};

const getInsightColor = (type: string) => {
  switch (type) {
    case 'positive':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'warning':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'suggestion':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const HealthInsights = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Health Insights</h1>
            <p className="text-gray-600">AI-powered analysis of your health and fitness data</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Weekly Health Summary</CardTitle>
          <CardDescription>An overview of your key health metrics this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-full bg-green-100">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Weight Change</h3>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-green-600">-0.4 kg</span>
                  <span className="ml-2 text-sm text-gray-500">this week</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">On track with your goal</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-full bg-blue-100">
                <Utensils className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Daily Calories</h3>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">2,100</span>
                  <span className="ml-2 text-sm text-gray-500">avg. consumed</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">2,190 avg. burned</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-full bg-purple-100">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Workout Consistency</h3>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">5/7</span>
                  <span className="ml-2 text-sm text-gray-500">days active</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">230 mins total activity</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Latest AI-Generated Insights</CardTitle>
          <CardDescription>Personalized observations based on your health data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insightsData.map((insight) => (
              <div 
                key={insight.id} 
                className={`p-4 border rounded-lg ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start">
                  <div className="mt-1 mr-3">
                    {insight.type === 'positive' ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : insight.type === 'warning' ? (
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    ) : (
                      getInsightIcon(insight.category)
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{insight.title}</h3>
                      <Badge variant="outline" className="ml-2">
                        {insight.category}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm">{insight.description}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      Generated on {new Date(insight.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="weight" className="w-full">
        <TabsList className="w-full md:w-auto mb-4 grid grid-cols-3">
          <TabsTrigger value="weight" className="flex-1">
            <Scale className="h-4 w-4 mr-2" />
            Weight Trend
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex-1">
            <Utensils className="h-4 w-4 mr-2" />
            Nutrition Analysis
          </TabsTrigger>
          <TabsTrigger value="calories" className="flex-1">
            <Zap className="h-4 w-4 mr-2" />
            Calorie Balance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="weight" className="animate-slide-up">
          <Card>
            <CardHeader>
              <CardTitle>Weight Progress</CardTitle>
              <CardDescription>Your 8-week weight journey (kg)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={weightData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="weightColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip formatter={(value) => [`${value} kg`, 'Weight']} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#0EA5E9" 
                      fillOpacity={1} 
                      fill="url(#weightColor)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nutrition" className="animate-slide-up">
          <Card>
            <CardHeader>
              <CardTitle>Macronutrient Distribution</CardTitle>
              <CardDescription>Your weekly nutrient intake (grams)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={nutrientData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="protein" name="Protein" fill="#0EA5E9" />
                    <Bar dataKey="carbs" name="Carbohydrates" fill="#F97316" />
                    <Bar dataKey="fat" name="Fat" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calories" className="animate-slide-up">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Calorie Balance</CardTitle>
              <CardDescription>Calories consumed vs. burned (kcal)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={calorieData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorConsumed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F97316" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorBurned" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="consumed" 
                      name="Calories Consumed" 
                      stroke="#F97316" 
                      fillOpacity={1} 
                      fill="url(#colorConsumed)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="burned" 
                      name="Calories Burned" 
                      stroke="#10B981" 
                      fillOpacity={1} 
                      fill="url(#colorBurned)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthInsights;
