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
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
}

interface MealPlan {
  date: string;
  meals: {
    breakfast?: MealType[];
    lunch?: MealType[];
    dinner?: MealType[];
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
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    }
  });

  useEffect(() => {
    // Update the meal type mapping to handle 'snack' from the database
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
          
          if (meal.image) {
            if (meal.image.startsWith('http')) {
              imageUrl = meal.image;
            } else if (meal.image.startsWith('/images/')) {
              const apiBase = 'http://localhost:3001';
              imageUrl = `${apiBase}${meal.image}`;
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
            mealType: meal.type === 'snack' ? 'snacks' : (meal.type as 'breakfast' | 'lunch' | 'dinner' | 'snacks') || 'snacks'
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
        snacks: getMealsByType('snacks').length
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

  // Add debug logs to ensure snacks functionality is working
  useEffect(() => {
    if (dbMeals.length > 0) {
      console.log('All available meals in database:', dbMeals);
      console.log('Meal types breakdown:', {
        breakfast: getMealsByType('breakfast').length,
        lunch: getMealsByType('lunch').length,
        dinner: getMealsByType('dinner').length,
        snacks: getMealsByType('snacks').length, // Debug log for snacks
      });

      // Debug log for snacks availability
      const snacks = getMealsByType('snacks');
      if (snacks.length === 0) {
        console.warn('No snacks available in the database');
      } else {
        console.log('Available snacks:', snacks);
      }
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
    setMealPlan((prev) => {
      const newMeals = { ...prev.meals };
      if (meal.mealType === 'snacks' || meal.mealType === 'breakfast' || meal.mealType === 'lunch' || meal.mealType === 'dinner') {
        const mealArray = newMeals[meal.mealType] || []; // Ensure the array exists
        newMeals[meal.mealType] = [...mealArray, meal];
      }
      return { ...prev, date: new Date().toISOString().split('T')[0], meals: newMeals };
    });
  };

  const handleRemoveMeal = (mealId: string, type: keyof MealPlan['meals']) => {
    setMealPlan(prev => {
      const newMeals = { ...prev.meals };
      if (Array.isArray(newMeals[type])) {
        newMeals[type] = newMeals[type]?.filter(meal => meal.id !== mealId) as MealType[];
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

    Object.values(mealPlan.meals).forEach((mealArray) => {
      if (Array.isArray(mealArray)) {
        mealArray.forEach((meal) => {
          total.calories += meal.calories;
          total.protein += meal.protein;
          total.carbs += meal.carbs;
          total.fat += meal.fat;
        });
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
                  (() => {
                    const displayedMealIds = new Set();
                    return ['breakfast', 'lunch', 'dinner', 'snacks'].map((type) => {
                      const mealOfType = dbMeals.find((meal) => meal.mealType === type && !displayedMealIds.has(meal.id));
                      if (mealOfType) {
                        displayedMealIds.add(mealOfType.id);
                        return (
                          <Card key={mealOfType.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
                            <div>
                              <div className="relative aspect-video bg-gray-100">
                                <img
                                  src={mealOfType.image}
                                  alt={mealOfType.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                                  }}
                                />
                                <div className="absolute top-2 right-2">
                                  <Badge>{mealOfType.mealType}</Badge>
                                </div>
                              </div>
                              <CardContent className="p-3">
                                <h3 className="font-semibold mb-1">{mealOfType.title}</h3>
                                <div className="flex justify-between text-sm text-gray-500">
                                  <span>{mealOfType.calories} kcal</span>
                                  <span>{mealOfType.protein}g protein</span>
                                </div>
                              </CardContent>
                            </div>
                            <div className="p-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full bg-primary text-white hover:bg-primary-dark transition-colors"
                                onClick={() => handleAddMeal(mealOfType)}
                              >
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add to Plan
                              </Button>
                            </div>
                          </Card>
                        );
                      }
                      return null;
                    }).concat(
                      ['lunch', 'dinner'].map((type) => {
                        const mealOfType = dbMeals.find((meal) => meal.mealType === type && !displayedMealIds.has(meal.id));
                        if (mealOfType) {
                          displayedMealIds.add(mealOfType.id);
                          return (
                            <Card key={mealOfType.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
                              <div>
                                <div className="relative aspect-video bg-gray-100">
                                  <img
                                    src={mealOfType.image}
                                    alt={mealOfType.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                                    }}
                                  />
                                  <div className="absolute top-2 right-2">
                                    <Badge>{mealOfType.mealType}</Badge>
                                  </div>
                                </div>
                                <CardContent className="p-3">
                                  <h3 className="font-semibold mb-1">{mealOfType.title}</h3>
                                  <div className="flex justify-between text-sm text-gray-500">
                                    <span>{mealOfType.calories} kcal</span>
                                    <span>{mealOfType.protein}g protein</span>
                                  </div>
                                </CardContent>
                              </div>
                              <div className="p-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full bg-primary text-white hover:bg-primary-dark transition-colors"
                                  onClick={() => handleAddMeal(mealOfType)}
                                >
                                  <PlusCircle className="w-4 h-4 mr-2" />
                                  Add to Plan
                                </Button>
                              </div>
                            </Card>
                          );
                        }
                        return null;
                      })
                    );
                  })()
                )}
              </div>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const breakfastMeal = getRandomMeal('breakfast');
                          const lunchMeal = getRandomMeal('lunch');
                          const dinnerMeal = getRandomMeal('dinner');
                          const snackMeal = getRandomMeal('snacks');

                          const newPlan: MealPlan = {
                            date: new Date().toISOString().split('T')[0],
                            meals: {
                              breakfast: breakfastMeal ? [breakfastMeal] : [],
                              lunch: lunchMeal ? [lunchMeal] : [],
                              dinner: dinnerMeal ? [dinnerMeal] : [],
                              snacks: snackMeal ? [snackMeal] : [],
                            },
                          };

                          setMealPlan(newPlan);
                        }}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generate Plan
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Breakfast */}
                    <MealSection
                      title="Breakfast"
                      meals={mealPlan.meals.breakfast}
                      mealType="breakfast"
                      onAdd={() => {
                        const meal = getRandomMeal('breakfast');
                        if (meal) handleAddMeal(meal);
                      }}
                      onRemove={handleRemoveMeal}
                      isLoading={isLoading}
                      availableMeals={getMealsByType('breakfast')}
                    />

                    {/* Lunch */}
                    <MealSection
                      title="Lunch"
                      meals={mealPlan.meals.lunch}
                      mealType="lunch"
                      onAdd={() => {
                        const meal = getRandomMeal('lunch');
                        if (meal) handleAddMeal(meal);
                      }}
                      onRemove={handleRemoveMeal}
                      isLoading={isLoading}
                      availableMeals={getMealsByType('lunch')}
                    />

                    {/* Dinner */}
                    <MealSection
                      title="Dinner"
                      meals={mealPlan.meals.dinner}
                      mealType="dinner"
                      onAdd={() => {
                        const meal = getRandomMeal('dinner');
                        if (meal) handleAddMeal(meal);
                      }}
                      onRemove={handleRemoveMeal}
                      isLoading={isLoading}
                      availableMeals={getMealsByType('dinner')}
                    />

                    {/* Snacks */}
                    <MealSection
                      title="Snacks"
                      meals={mealPlan.meals.snacks} // Ensure snacks array is passed correctly
                      mealType="snacks" // Correctly match the key in the `mealPlan` object
                      onAdd={() => {
                        const meal = getRandomMeal('snacks'); // Get a random snack meal
                        if (meal) handleAddMeal(meal); // Add the meal to the plan
                      }}
                      onRemove={handleRemoveMeal} // Remove snacks functionality
                      isLoading={isLoading} // Ensure the button is not disabled
                      availableMeals={getMealsByType('snacks')} // Filter available snacks
                    />
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
                    <NutritionProgress label="Calories" value={totalNutrition.calories} max={2000} />
                    <NutritionProgress label="Protein" value={totalNutrition.protein} max={50} />
                    <NutritionProgress label="Carbs" value={totalNutrition.carbs} max={250} />
                    <NutritionProgress label="Fat" value={totalNutrition.fat} max={70} />
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
                          <SelectItem value="snacks">Snacks</SelectItem>
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

// Define the MealCard component if not already defined
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
          onError={() => setImageError(true)}
          onLoad={() => setImageLoading(false)}
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

// Helper components for better structure
const MealSection = ({
  title,
  meals,
  mealType,
  onAdd,
  onRemove,
  isLoading,
  availableMeals,
}: {
  title: string;
  meals?: MealType[];
  mealType: keyof MealPlan['meals'];
  onAdd: () => void;
  onRemove: (mealId: string, type: keyof MealPlan['meals']) => void;
  isLoading: boolean;
  availableMeals: MealType[];
}) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold">{title}</h3>
      <Button
        variant="outline"
        size="sm"
        onClick={onAdd}
        disabled={isLoading || availableMeals.length === 0}
      >
        {isLoading ? 'Loading...' : `Add ${title}`}
      </Button>
    </div>
    {meals && meals.length > 0 ? (
      <div className="space-y-6">
        {meals.map((meal) => (
          <div key={meal.id}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{meal.title}</h3>
              <Button variant="outline" size="sm" onClick={() => onRemove(meal.id, mealType)}>
                Remove
              </Button>
            </div>
            <MealCard meal={meal} />
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No {title.toLowerCase()} meals added yet.</p>
    )}
  </div>
);

const NutritionProgress = ({ label, value, max }: { label: string; value: number; max: number }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span>{label}</span>
      <span>{value} {label === 'Calories' ? 'kcal' : 'g'}</span>
    </div>
    <Progress value={Math.min((value / max) * 100, 100)} />
  </div>
);

export default MealPlanner;
