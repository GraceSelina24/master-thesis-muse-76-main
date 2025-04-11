import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, Coffee, Utensils, Apple, Pizza, Trash } from "lucide-react";
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

interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

const NutritionTracker = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mealData, setMealData] = useState({
    name: '',
    description: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    type: 'breakfast',
    date: new Date().toISOString()
  });

  useEffect(() => {
    if (user?.id) {
      fetchMeals();
    }
  }, [user?.id]);

  const fetchMeals = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:3001/api/meals/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch meals');
      }

      const data = await response.json();
      setMeals(data);
    } catch (error) {
      console.error('Error fetching meals:', error);
      toast.error('Failed to fetch meals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to add meals');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:3001/api/meals/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: mealData.name,
          description: mealData.description,
          calories: Number(mealData.calories),
          protein: Number(mealData.protein),
          carbs: Number(mealData.carbs),
          fat: Number(mealData.fat),
          type: mealData.type,
          date: mealData.date
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add meal');
      }

      const newMeal = await response.json();
      setMeals(prevMeals => [...prevMeals, newMeal]);
      setMealData({
        name: '',
        description: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        type: 'breakfast',
        date: new Date().toISOString()
      });
      setIsDialogOpen(false);
      toast.success('Meal added successfully!');
    } catch (error) {
      console.error('Error adding meal:', error);
      toast.error('Failed to add meal');
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:3001/api/meals/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete meal');
      }

      setMeals(prevMeals => prevMeals.filter(meal => meal.id !== mealId));
      toast.success('Meal deleted successfully!');
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast.error('Failed to delete meal');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Today's Meals</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 w-8 sm:h-9 sm:w-auto">
              <Plus className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Add Meal</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Meal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMeal} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="hidden sm:block">Name</Label>
                  <Input
                    id="name"
                    placeholder="Meal name"
                    value={mealData.name}
                    onChange={(e) => setMealData({ ...mealData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type" className="hidden sm:block">Type</Label>
                  <Select
                    value={mealData.type}
                    onValueChange={(value) => setMealData({ ...mealData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="calories" className="hidden sm:block">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="Calories"
                    value={mealData.calories}
                    onChange={(e) => setMealData({ ...mealData, calories: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="protein" className="hidden sm:block">Protein</Label>
                    <Input
                      id="protein"
                      type="number"
                      placeholder="Protein (g)"
                      value={mealData.protein}
                      onChange={(e) => setMealData({ ...mealData, protein: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="carbs" className="hidden sm:block">Carbs</Label>
                    <Input
                      id="carbs"
                      type="number"
                      placeholder="Carbs (g)"
                      value={mealData.carbs}
                      onChange={(e) => setMealData({ ...mealData, carbs: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fat" className="hidden sm:block">Fat</Label>
                    <Input
                      id="fat"
                      type="number"
                      placeholder="Fat (g)"
                      value={mealData.fat}
                      onChange={(e) => setMealData({ ...mealData, fat: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full">Add Meal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No meals recorded today
          </div>
        ) : (
          <div className="space-y-4">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center space-x-4">
                  {meal.type === 'breakfast' ? (
                    <Coffee className="h-5 w-5 text-primary" />
                  ) : meal.type === 'lunch' ? (
                    <Utensils className="h-5 w-5 text-primary" />
                  ) : meal.type === 'dinner' ? (
                    <Pizza className="h-5 w-5 text-primary" />
                  ) : (
                    <Apple className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <p className="font-medium">{meal.name}</p>
                    <p className="text-sm text-muted-foreground">{meal.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">{meal.calories} kcal</p>
                    <p className="text-sm text-muted-foreground">
                      P: {meal.protein}g C: {meal.carbs}g F: {meal.fat}g
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteMeal(meal.id)}
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

export default NutritionTracker;
