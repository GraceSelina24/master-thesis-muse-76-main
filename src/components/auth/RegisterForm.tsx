import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  gender: z.string().nonempty({ message: 'Gender is required' }),
  age: z.string().nonempty({ message: 'Age is required' }),
  height: z.string().nonempty({ message: 'Height is required' }),
  weight: z.string().nonempty({ message: 'Weight is required' }),
  goalWeight: z.string().optional(),
  goal: z.string().nonempty({ message: 'Goal is required' }),
  activityLevel: z.string().nonempty({ message: 'Activity level is required' }),
  dietaryPreferences: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const { signUp } = useAuth();
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      gender: '',
      age: '',
      height: '',
      weight: '',
      goalWeight: '',
      goal: '',
      activityLevel: '',
      dietaryPreferences: [],
      allergies: [],
    },
  });

  const handleDietaryChange = (dietary: string) => {
    setDietaryPreferences((prev) =>
      prev.includes(dietary) ? prev.filter((item) => item !== dietary) : [...prev, dietary]
    );
  };

  const handleAllergyChange = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((item) => item !== allergy) : [...prev, allergy]
    );
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      console.log('Form data:', { ...data, dietaryPreferences, allergies });
      await signUp(data.email, data.password, data.name);
      alert('Registration complete!');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

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

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-gradient-to-br from-blue-50 to-indigo-100"
      style={{
        backgroundImage: 'url(/health-bg.jpg)',
      }}
    >
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Register</h2>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="name"
                {...form.register('name')}
                placeholder="John Doe"
                className="pl-10 bg-white/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                {...form.register('email')}
                type="email"
                placeholder="name@example.com"
                className="pl-10 bg-white/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                {...form.register('password')}
                type="password"
                placeholder="******"
                className="pl-10 bg-white/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="gender" className="text-sm font-medium">
              Gender
            </label>
            <Select {...form.register('gender')}>
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
            <label htmlFor="age" className="text-sm font-medium">
              Age
            </label>
            <Input id="age" {...form.register('age')} type="number" placeholder="Your age" />
          </div>

          <div className="space-y-2">
            <label htmlFor="height" className="text-sm font-medium">
              Height (cm)
            </label>
            <Input id="height" {...form.register('height')} type="number" placeholder="Your height" />
          </div>

          <div className="space-y-2">
            <label htmlFor="weight" className="text-sm font-medium">
              Weight (kg)
            </label>
            <Input id="weight" {...form.register('weight')} type="number" placeholder="Your weight" />
          </div>

          <div className="space-y-2">
            <label htmlFor="goalWeight" className="text-sm font-medium">
              Goal Weight (kg)
            </label>
            <Input
              id="goalWeight"
              {...form.register('goalWeight')}
              type="number"
              placeholder="Your goal weight"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="goal" className="text-sm font-medium">
              Primary Goal
            </label>
            <Select {...form.register('goal')}>
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Dietary Preferences</label>
            <div className="grid grid-cols-2 gap-2">
              {dietaryOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={dietaryPreferences.includes(option.id)}
                    onCheckedChange={() => handleDietaryChange(option.id)}
                  />
                  <label htmlFor={option.id} className="text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Allergies</label>
            <div className="grid grid-cols-2 gap-2">
              {allergyOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={allergies.includes(option.id)}
                    onCheckedChange={() => handleAllergyChange(option.id)}
                  />
                  <label htmlFor={option.id} className="text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
        </div>
      </div>
    </div>
  );
};