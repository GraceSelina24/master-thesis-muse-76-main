import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { CalorieChart } from '../components/CalorieChart';
import { Button } from '../components/ui/button';
import { ArrowRight, Utensils, Dumbbell, Droplets, Award, TrendingUp } from 'lucide-react';
import NutritionTracker from '../components/NutritionTracker';
import ActivityTracker from '../components/ActivityTracker';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Welcome, Grace!</h1>
        <p className="text-gray-600">Here's an overview of your health journey</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              <Utensils className="h-5 w-5 mr-2 text-primary" />
              Daily Calories
            </CardTitle>
            <CardDescription>1,750 / 2,200 kcal</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={75} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">450 kcal remaining</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              <Droplets className="h-5 w-5 mr-2 text-blue-500" />
              Water Intake
            </CardTitle>
            <CardDescription>1.8 / 2.5 L</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={72} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">0.7 L remaining</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              <Dumbbell className="h-5 w-5 mr-2 text-accent" />
              Activity
            </CardTitle>
            <CardDescription>8,200 / 10,000 steps</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={82} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">1,800 steps remaining</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              <Award className="h-5 w-5 mr-2 text-secondary" />
              Goal Progress
            </CardTitle>
            <CardDescription>Weight Loss</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={40} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">3.2 kg of 8 kg goal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Weekly Progress</CardTitle>
              <CardDescription>Your calorie balance for the last 7 days</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <CalorieChart />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recommended For You</CardTitle>
            <CardDescription>Based on your goals and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
              <span className="text-xs font-medium text-primary-foreground bg-primary rounded-full px-2 py-0.5">Meal Plan</span>
              <h4 className="mt-2 font-medium">Mediterranean Diet Plan</h4>
              <p className="text-sm text-gray-600 mt-1">Perfect for your heart health goals</p>
              <div className="flex justify-end mt-2">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            </div>
            
            <div className="p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
              <span className="text-xs font-medium text-primary-foreground bg-accent rounded-full px-2 py-0.5">Workout</span>
              <h4 className="mt-2 font-medium">20-Minute HIIT Cardio</h4>
              <p className="text-sm text-gray-600 mt-1">Efficient for your weight loss goals</p>
              <div className="flex justify-end mt-2">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            </div>
            
            <div className="p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
              <span className="text-xs font-medium text-primary-foreground bg-secondary rounded-full px-2 py-0.5">Insight</span>
              <h4 className="mt-2 font-medium">Sleep Quality Analysis</h4>
              <p className="text-sm text-gray-600 mt-1">Tips to improve your sleep habits</p>
              <div className="flex justify-end mt-2">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="nutrition" className="w-full">
        <TabsList className="w-full md:w-auto mb-4">
          <TabsTrigger value="nutrition" className="flex-1">Nutrition</TabsTrigger>
          <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="nutrition">
          <NutritionTracker />
        </TabsContent>
        <TabsContent value="activity">
          <ActivityTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
