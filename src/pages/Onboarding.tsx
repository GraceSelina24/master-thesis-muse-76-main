
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const { toast } = useToast();

  // User profile data
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'pescatarian', label: 'Pescatarian' },
    { id: 'gluten-free', label: 'Gluten-Free' },
    { id: 'dairy-free', label: 'Dairy-Free' },
    { id: 'keto', label: 'Keto' },
    { id: 'paleo', label: 'Paleo' },
  ];

  const allergyOptions = [
    { id: 'nuts', label: 'Nuts' },
    { id: 'dairy', label: 'Dairy' },
    { id: 'eggs', label: 'Eggs' },
    { id: 'gluten', label: 'Gluten' },
    { id: 'shellfish', label: 'Shellfish' },
    { id: 'soy', label: 'Soy' },
  ];

  const handleDietaryChange = (dietary: string) => {
    setDietaryPreferences(prev => 
      prev.includes(dietary) 
        ? prev.filter(item => item !== dietary) 
        : [...prev, dietary]
    );
  };

  const handleAllergyChange = (allergy: string) => {
    setAllergies(prev => 
      prev.includes(allergy) 
        ? prev.filter(item => item !== allergy) 
        : [...prev, allergy]
    );
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      setProgress(progress + 25);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(progress - 25);
    }
  };

  const completeOnboarding = () => {
    // This would normally send the data to your backend
    toast({
      title: "Profile setup complete!",
      description: "Your personalized health journey begins now.",
    });
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg animate-slide-up">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Set Up Your Health Profile</CardTitle>
          <CardDescription>
            Help us personalize your experience
          </CardDescription>
          <Progress value={progress} className="h-2 mt-4" />
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4 animate-slide-up">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Your height in cm"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Current Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Your weight in kg"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-slide-up">
              <h3 className="text-lg font-medium">Your Goals</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal">Primary Goal</Label>
                  <Select value={goal} onValueChange={setGoal}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose-weight">Lose Weight</SelectItem>
                      <SelectItem value="maintain-weight">Maintain Weight</SelectItem>
                      <SelectItem value="gain-weight">Gain Weight</SelectItem>
                      <SelectItem value="build-muscle">Build Muscle</SelectItem>
                      <SelectItem value="improve-fitness">Improve Fitness</SelectItem>
                      <SelectItem value="eat-healthier">Eat Healthier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {goal === 'lose-weight' || goal === 'gain-weight' ? (
                  <div className="space-y-2">
                    <Label htmlFor="goalWeight">Target Weight (kg)</Label>
                    <Input
                      id="goalWeight"
                      type="number"
                      placeholder="Your target weight in kg"
                      value={goalWeight}
                      onChange={(e) => setGoalWeight(e.target.value)}
                    />
                  </div>
                ) : null}
                
                <div className="space-y-2">
                  <Label htmlFor="activityLevel">Activity Level</Label>
                  <Select value={activityLevel} onValueChange={setActivityLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                      <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="active">Very active (hard exercise 6-7 days/week)</SelectItem>
                      <SelectItem value="extra-active">Extra active (very hard exercise & physical job)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-slide-up">
              <h3 className="text-lg font-medium">Dietary Preferences</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select any dietary preferences</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {dietaryOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={option.id} 
                          checked={dietaryPreferences.includes(option.id)}
                          onCheckedChange={() => handleDietaryChange(option.id)}
                        />
                        <Label htmlFor={option.id} className="cursor-pointer">{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-slide-up">
              <h3 className="text-lg font-medium">Allergies & Restrictions</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select any food allergies or restrictions</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {allergyOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`allergy-${option.id}`} 
                          checked={allergies.includes(option.id)}
                          onCheckedChange={() => handleAllergyChange(option.id)}
                        />
                        <Label htmlFor={`allergy-${option.id}`} className="cursor-pointer">{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevStep}
            disabled={step === 1}
          >
            Previous
          </Button>
          <Button onClick={handleNextStep}>
            {step === 4 ? "Complete Setup" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Onboarding;
