import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ChefHat, Utensils, Coffee, Apple, PlusCircle, HeartPulse, RefreshCw, Search, Calendar, Filter } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../hooks/useAuth';

interface MealType {
  id: string;
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  ingredients: string[];
  tags: string[];
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface MealPlan {
  date: string;
  meals: {
    breakfast?: MealType;
    lunch?: MealType;
    dinner?: MealType;
    snacks?: MealType[];
  };
}

const MealPlanner = () => {
  const [activeDay, setActiveDay] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");
  const [mealType, setMealType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [dbMeals, setDbMeals] = useState<MealType[]>([]);
  const { user } = useAuth();
  const [mealPlan, setMealPlan] = useState<MealPlan>({
    date: new Date().toISOString().split('T')[0],
    meals: {
      breakfast: undefined,
      lunch: undefined,
      dinner: undefined,
      snacks: []
    }
  });

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token || !user) {
          console.log('Authentication issue: No token or user');
          throw new Error('No authentication token found or user not authenticated');
        }
        
        console.log('Fetching meals for user:', user.id);
        const response = await fetch(`http://localhost:3001/api/meals/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          console.error('API Error:', response.status, response.statusText);
          throw new Error('Failed to fetch meals');
        }

        const data = await response.json();
        console.log('Received meal data:', data);
        
        // Convert DB meals to our MealType format
        const formattedMeals: MealType[] = data.map((meal: any) => {
          // Ensure image URL is properly constructed
          let imageUrl = 'https://placehold.co/600x400?text=No+Image';
          
          // If image path exists
          if (meal.image) {
            console.log('Raw image path from DB:', meal.image);
            
            // If it's a full URL, use it directly
            if (meal.image.startsWith('http')) {
              imageUrl = meal.image;
            } 
            // If it's a relative path, construct the full URL - fix the URL construction
            else if (meal.image.startsWith('/images/')) {
              // Use window.location.origin to get the current origin dynamically
              const apiBase = 'http://localhost:3001';
              imageUrl = `${apiBase}${meal.image}`;
              console.log('Image URL constructed:', imageUrl);
            }
          }
          
          return {
            id: meal.id,
            title: meal.name,
            calories: meal.calories,
            protein: meal.protein || 0,
            carbs: meal.carbs || 0,
            fat: meal.fat || 0,
            image: imageUrl,
            ingredients: meal.description ? meal.description.split(', ') : [],
            tags: [(meal.type || 'meal').charAt(0).toUpperCase() + (meal.type || 'meal').slice(1)],
            mealType: (meal.type as 'breakfast' | 'lunch' | 'dinner' | 'snack') || 'snack'
          };
        });
        
        console.log('Formatted meals:', formattedMeals);
        setDbMeals(formattedMeals);
      } catch (error) {
        console.error('Error fetching meals:', error);
        // Load empty meals array instead of fallback data
        setDbMeals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, [user]);

  // Find meals by type from our database meals
  const getMealsByType = (type: string) => {
    return dbMeals.filter(meal => meal.mealType === type);
  };

  // Display all meals in the console for debugging
  useEffect(() => {
    if (dbMeals.length > 0) {
      console.log('All available meals in database:', dbMeals);
      console.log('Meal types breakdown:',{
        breakfast: getMealsByType('breakfast').length, 
        lunch: getMealsByType('lunch').length,
        dinner: getMealsByType('dinner').length,
        snack: getMealsByType('snack').length
      });
      
      // Debug log for image URLs
      console.log('Image URLs:');
      dbMeals.slice(0, 5).forEach(meal => {
        console.log(`${meal.title}: ${meal.image}`);
        // Test load the image
        const img = new Image();
        img.onload = () => console.log(`✅ Image for ${meal.title} loaded successfully`);
        img.onerror = () => console.error(`❌ Failed to load image for ${meal.title}`);
        img.src = meal.image;
      });
    }
  }, [dbMeals]);

  // Get random meal of a specific type
  const getRandomMeal = (type: string) => {
    const mealsOfType = getMealsByType(type);
    if (mealsOfType.length === 0) return null;
    return mealsOfType[Math.floor(Math.random() * mealsOfType.length)];
  };

  const filteredMeals = dbMeals.filter(meal => {
    const matchesSearch = meal.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = mealType === "all" || meal.mealType === mealType;
    return matchesSearch && matchesType;
  });

  const handleAddMeal = (meal: MealType) => {
    setMealPlan(prev => {
      const newMeals = { ...prev.meals };
      if (meal.mealType === 'snack') {
        newMeals.snacks = [...(newMeals.snacks || []), meal];
      } else {
        newMeals[meal.mealType] = meal;
      }
      return { ...prev, meals: newMeals };
    });
  };

  const handleRemoveMeal = (mealId: string, type: keyof MealPlan['meals']) => {
    setMealPlan(prev => {
      const newMeals = { ...prev.meals };
      if (type === 'snacks') {
        newMeals.snacks = newMeals.snacks?.filter(snack => snack.id !== mealId);
      } else {
        newMeals[type] = undefined;
      }
      return { ...prev, meals: newMeals };
    });
  };

  const calculateTotalNutrition = () => {
    const total = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };

    Object.values(mealPlan.meals).forEach(meal => {
      if (Array.isArray(meal)) {
        meal.forEach(snack => {
          total.calories += snack.calories;
          total.protein += snack.protein;
          total.carbs += snack.carbs;
          total.fat += snack.fat;
        });
      } else if (meal) {
        total.calories += meal.calories;
        total.protein += meal.protein;
        total.carbs += meal.carbs;
        total.fat += meal.fat;
      }
    });

    return total;
  };

  const totalNutrition = calculateTotalNutrition();

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Meal Planner</h1>
        <p className="text-gray-600">Plan and track your meals for optimal nutrition</p>
      </header>

      {isLoading && dbMeals.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold mb-2">Loading your meals...</h3>
            <p className="text-gray-500">Please wait while we prepare your meal options</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* All Meals Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>All Available Meals</CardTitle>
              <CardDescription>Browse all meal options in your library</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dbMeals.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No meals found in your library</p>
                    <p className="text-sm text-gray-400">
                      Contact your administrator to add meals
                    </p>
                  </div>
                ) : (
                  dbMeals.slice(0, 6).map((meal) => (
                    <Card key={meal.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative aspect-video bg-gray-100">
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-100">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        
                        <img 
                          src={meal.image}
                          alt={meal.title}
                          className="w-full h-full object-cover z-20 relative"
                          onError={(e) => {
                            console.error(`Failed to load image for ${meal.title}:`, meal.image);
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                            (e.target as HTMLImageElement).parentElement?.querySelector('.absolute')?.classList.add('hidden');
                          }}
                          onLoad={(e) => {
                            console.log(`Successfully loaded image for ${meal.title}`);
                            (e.target as HTMLImageElement).parentElement?.querySelector('.absolute')?.classList.add('hidden');
                          }}
                        />
                        <div className="absolute top-2 right-2 z-30">
                          <Badge>{meal.mealType}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold mb-1">{meal.title}</h3>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{meal.calories} kcal</span>
                          <span>{meal.protein}g protein</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => handleAddMeal(meal)}
                        >
                          Add to Plan
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              {dbMeals.length > 6 && (
                <div className="text-center mt-4 space-y-4">
                  <Button 
                    variant="link"
                    onClick={() => {
                      // Find the meal library element and scroll to it
                      const mealLibraryElement = document.getElementById('meal-library');
                      if (mealLibraryElement) {
                        mealLibraryElement.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        });
                      } else {
                        console.error('Meal library element not found');
                      }
                    }}
                  >
                    View all {dbMeals.length} meals
                  </Button>
                  
                  {/* Debug: Direct link to check image existence */}
                  <div className="text-xs text-gray-500">
                    <p>Having trouble with images? Try these direct links:</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-1">
                      <a href="http://localhost:3001/images/meals/meal-1.jpg" target="_blank" className="underline">Image 1</a>
                      <a href="http://localhost:3001/images/meals/meal-2.jpg" target="_blank" className="underline">Image 2</a>
                      <a href="http://localhost:3001/list-images" target="_blank" className="underline">Check Available Images</a>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Meal Plan Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Today's Plan</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Change Date
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        const breakfastMeal = getRandomMeal('breakfast');
                        const lunchMeal = getRandomMeal('lunch');
                        const dinnerMeal = getRandomMeal('dinner');
                        const snackMeal = getRandomMeal('snack');
                        
                        const newPlan: MealPlan = {
                          date: new Date().toISOString().split('T')[0],
                          meals: {
                            breakfast: breakfastMeal || undefined,
                            lunch: lunchMeal || undefined,
                            dinner: dinnerMeal || undefined,
                            snacks: snackMeal ? [snackMeal] : []
                          }
                        };
                        
                        setMealPlan(newPlan);
                      }}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generate Plan
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Breakfast */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Breakfast</h3>
                        {mealPlan.meals.breakfast && (
                          <Button variant="outline" size="sm" onClick={() => handleRemoveMeal(mealPlan.meals.breakfast?.id || '', 'breakfast')}>
                            Remove
                          </Button>
                        )}
                      </div>
                      {mealPlan.meals.breakfast ? (
                        <MealCard meal={mealPlan.meals.breakfast} />
                      ) : (
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => {
                            const breakfastMeal = getRandomMeal('breakfast');
                            if (breakfastMeal) handleAddMeal(breakfastMeal);
                          }}
                          disabled={isLoading || getMealsByType('breakfast').length === 0}
                        >
                          {isLoading ? 'Loading...' : 'Add Breakfast'}
                        </Button>
                      )}
                    </div>

                    {/* Lunch */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Lunch</h3>
                        {mealPlan.meals.lunch && (
                          <Button variant="outline" size="sm" onClick={() => handleRemoveMeal(mealPlan.meals.lunch?.id || '', 'lunch')}>
                            Remove
                          </Button>
                        )}
                      </div>
                      {mealPlan.meals.lunch ? (
                        <MealCard meal={mealPlan.meals.lunch} />
                      ) : (
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => {
                            const lunchMeal = getRandomMeal('lunch');
                            if (lunchMeal) handleAddMeal(lunchMeal);
                          }}
                          disabled={isLoading || getMealsByType('lunch').length === 0}
                        >
                          {isLoading ? 'Loading...' : 'Add Lunch'}
                        </Button>
                      )}
                    </div>

                    {/* Dinner */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Dinner</h3>
                        {mealPlan.meals.dinner && (
                          <Button variant="outline" size="sm" onClick={() => handleRemoveMeal(mealPlan.meals.dinner?.id || '', 'dinner')}>
                            Remove
                          </Button>
                        )}
                      </div>
                      {mealPlan.meals.dinner ? (
                        <MealCard meal={mealPlan.meals.dinner} />
                      ) : (
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => {
                            const dinnerMeal = getRandomMeal('dinner');
                            if (dinnerMeal) handleAddMeal(dinnerMeal);
                          }}
                          disabled={isLoading || getMealsByType('dinner').length === 0}
                        >
                          {isLoading ? 'Loading...' : 'Add Dinner'}
                        </Button>
                      )}
                    </div>

                    {/* Snacks */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Snacks</h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            const snackMeal = getRandomMeal('snack');
                            if (snackMeal) handleAddMeal(snackMeal);
                          }}
                          disabled={isLoading || getMealsByType('snack').length === 0}
                        >
                          {isLoading ? 'Loading...' : 'Add Snack'}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {mealPlan.meals.snacks?.map((snack) => (
                          <div key={snack.id} className="flex items-center justify-between">
                            <MealCard meal={snack} />
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveMeal(snack.id, 'snacks')}>
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Nutrition Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition Summary</CardTitle>
                  <CardDescription>Today's total nutrition intake</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Calories</span>
                        <span>{totalNutrition.calories} kcal</span>
                      </div>
                      <Progress value={Math.min((totalNutrition.calories / 2000) * 100, 100)} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Protein</span>
                        <span>{totalNutrition.protein}g</span>
                      </div>
                      <Progress value={Math.min((totalNutrition.protein / 50) * 100, 100)} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Carbs</span>
                        <span>{totalNutrition.carbs}g</span>
                      </div>
                      <Progress value={Math.min((totalNutrition.carbs / 250) * 100, 100)} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Fat</span>
                        <span>{totalNutrition.fat}g</span>
                      </div>
                      <Progress value={Math.min((totalNutrition.fat / 70) * 100, 100)} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Meal Library */}
              <Card className="mt-6" id="meal-library">
                <CardHeader>
                  <CardTitle>Meal Library</CardTitle>
                  <CardDescription>Search and add meals to your plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search meals..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                      <Select value={mealType} onValueChange={setMealType}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Meal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Meals</SelectItem>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snacks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {filteredMeals.length > 0 ? (
                          filteredMeals.map((meal) => (
                            <MealCard
                              key={meal.id}
                              meal={meal}
                              onAdd={() => handleAddMeal(meal)}
                            />
                          ))
                        ) : (
                          <div className="text-center py-8">
                            {isLoading ? (
                              <div className="flex flex-col items-center justify-center">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-500">Loading meals...</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center">
                                <ChefHat className="w-12 h-12 text-gray-400 mb-4" />
                                <p className="text-gray-500 mb-2">No meals found</p>
                                <p className="text-sm text-gray-400">
                                  {searchTerm || mealType !== "all" 
                                    ? "Try adjusting your search filters" 
                                    : "Add some meals to get started"}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MealCard = ({ meal, onAdd }: { meal: MealType; onAdd?: () => void }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Card className="hover:shadow-lg transition-shadow w-full">
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={imageError ? "https://placehold.co/600x400?text=No+Image" : meal.image}
          alt={meal.title}
          className={`w-full h-full object-cover transition-opacity ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onError={(e) => {
            console.error(`Failed to load image for ${meal.title}:`, meal.image);
            setImageError(true);
            setImageLoading(false);
          }}
          onLoad={() => {
            console.log(`Successfully loaded image for ${meal.title}`);
            setImageLoading(false);
          }}
        />
        <div className="absolute top-2 right-2">
          {meal.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="mr-1 mb-1 bg-white/80">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2">{meal.title}</CardTitle>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <p className="text-sm text-gray-500">Calories</p>
            <p className="font-semibold">{meal.calories} kcal</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Protein</p>
            <p className="font-semibold">{meal.protein}g</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Carbs</p>
            <p className="font-semibold">{meal.carbs}g</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fat</p>
            <p className="font-semibold">{meal.fat}g</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm font-semibold mb-1">Ingredients:</p>
          <ul className="text-sm text-gray-600">
            {meal.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
        {onAdd && (
          <Button className="w-full" onClick={onAdd}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add to Plan
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MealPlanner;
