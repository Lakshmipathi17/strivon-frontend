import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import DashboardSidebar from '../components/DashboardSidebar';
import NutritionChart from '../components/NutritionChart';
import ActivityChart from '../components/ActivityChart';
import RecentWorkouts from '../components/RecentWorkouts';
import Workouts from '../components/Workouts';
import Goals from '../components/Goals';
import Settings from '../components/Settings';
import { Apple, Zap, Scale } from 'lucide-react';

interface ClientData {
    id?: number;
    name: string;
    userName: string;
    height: number;
    weight: number;
    workoutfrequency: number;
    gender: string;
    age: number;
}

interface NutritionDistribution {
    protein: { grams: number; calories: number; percentage: number };
    fat: { grams: number; calories: number; percentage: number };
    carbs: { grams: number; calories: number; percentage: number };
}
const API = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [clientName, setClientName] = useState('User');
    const [maintenanceCalories, setMaintenanceCalories] = useState(0);
    const [dailyGoalCalories, setDailyGoalCalories] = useState(0);
    const [nutritionDistribution, setNutritionDistribution] = useState<NutritionDistribution>({
        protein: { grams: 0, calories: 0, percentage: 0 },
        fat: { grams: 0, calories: 0, percentage: 0 },
        carbs: { grams: 0, calories: 0, percentage: 0 }
    });
    const [clientData, setClientData] = useState<ClientData>({
        name: 'User',
        userName: 'user',
        height: 175,
        weight: 80,
        workoutfrequency: 3,
        gender: 'Male',
        age: 30
    });

    const location = useLocation();
    useEffect(() => {
                // Check if this is a self-trained user
        const isTrainer = localStorage.getItem('Trainer') === 'true';
        if(!isTrainer) {
          const fetchUserDetails = async () => {
            const response  = await fetch( `${API}/user/details`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(response.ok){
              const data = await response.json();
              localStorage.setItem('selfTrainedUser', JSON.stringify(data));
              setClientData(data);
              setClientName(data.name);
            }
            else{
              alert("token expired.");
              localStorage.removeItem('token');
              localStorage.removeItem('Trainer');
              localStorage.removeItem('clients');
              localStorage.removeItem('selfTrainedUser');
              window.location.href = '/';
            }
          };
          fetchUserDetails();
        }
       else if (location.state?.clientId) {
            // This is a trainer viewing a client's dashboard
            const clients = JSON.parse(localStorage.getItem('clients') || '[]');
            const client = clients.find((c: any) => c.id === location.state.clientId);
            if (client) {
                setClientName(client.name);
                setClientData({
                    id: client.id,
                    name: client.name,
                    height: parseInt(client.height),
                    weight: parseInt(client.weight),
                    age: parseInt(client.age),
                    workoutfrequency: parseInt(client.workoutfrequency),
                    gender: client.gender,
                    userName: client.userName
                });
            }
        }
    },[]); 

    useEffect(() => {
        if(!clientData.id) return;
        //Function to calculate maintenance calories using Mifflin-St Jeor Equation and adjusting for activity level
        const maintainceCalores = () =>{
            //Step 1 calculate BMR using Mifflin-St Jeor Equation
            let bmr = 0;
            if(clientData.gender === 'Male'){
              bmr = (10 * clientData.weight) + (6.25 * clientData.height) - (5 * clientData.age) + 5;
            }
            else{
              bmr = (10 * clientData.weight) + (6.25 * clientData.height) - (5 * clientData.age) - 161;
            }
            //Step 2 Adjust BMR based on activity level
            let activityFactor = 1.2;
            switch(clientData.workoutfrequency){
              case 1:
                activityFactor = 1.2; // Sedentary
                break;
              case 2:
                activityFactor = 1.22; // Lightly active
                break;
              case 3:
              case 4:
                activityFactor = 1.375; // Moderately active
                break;
              case 5:
              case 6:
                activityFactor = 1.55; // Very active
                break;
              case 7:
                activityFactor = 1.725; // Extra active, Athlete
                break;
              default: activityFactor = 1.2; // Default to sedentary if frequency is out of range
            }
            //Step 3 Calculate maintenance calories tdee
            const maintenanceCalories = bmr * activityFactor;
            return maintenanceCalories;
        }

        //Function to calculate daily goal calories based on user's target weight and time frame to achieve it
        const calculateGoalCalories = (tdee:number,currentWeight:number,targetWeight:number,days:number) => {
          //Step 1: Calculate total weight  change + or -
          const weightDifference = targetWeight - currentWeight;
          const totalCaloriesChange = weightDifference * 7700; // 1 kg of body weight is approximately 7700 calories
          let dailyCaloriesChange = totalCaloriesChange / days;
          if (dailyCaloriesChange > 500) dailyCaloriesChange = 500;
          if (dailyCaloriesChange < -700) dailyCaloriesChange = -700;
          const dailyGoalCaloriesResult = tdee + dailyCaloriesChange;
          return dailyGoalCaloriesResult;
        }

        const calculateNutritionDistribution = (calories:number, weight:number): NutritionDistribution => {
            const proteinGrams = 2.2 * weight;
            const fatGrams = 0.88 * weight;
            const proteinCalories = proteinGrams * 4;
            const fatCalories = fatGrams * 9;
            const remainingCalories = calories - (proteinCalories + fatCalories);
            const carbGrams = remainingCalories > 0 ? remainingCalories / 4 : 0;
            const totalCalories = proteinCalories + fatCalories + carbGrams * 4;

            return {
                protein: {
                    grams: Math.round(proteinGrams),
                    calories: Math.round(proteinCalories),
                    percentage: totalCalories ? Math.round((proteinCalories / totalCalories) * 100) : 0
                },
                fat: {
                    grams: Math.round(fatGrams),
                    calories: Math.round(fatCalories),
                    percentage: totalCalories ? Math.round((fatCalories / totalCalories) * 100) : 0
                },
                carbs: {
                    grams: Math.round(carbGrams),
                    calories: Math.round(carbGrams * 4),
                    percentage: totalCalories ? Math.round(((carbGrams * 4) / totalCalories) * 100) : 0
                }
            };
        }

        const bmi = clientData.weight / ((clientData.height / 100) ** 2); 
        const maintenanceCaloriesData = maintainceCalores();
        setMaintenanceCalories(Math.round(maintenanceCaloriesData));

        const fetchGoal = async () => {
              const response = await fetch(`${API}/user/getgoal/${clientData.id}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
              });
              let data = null;
              if(!response.ok ||  response.status === 204){
                return null;
              }
            data = await response.json();
                return data;
        };              
        const handleCalories = async () => {
            const goalData = await fetchGoal();
            let dailyGoalCaloriesData = maintenanceCaloriesData;

            if (goalData) {
                const targetWeight = goalData.targetWeight;
                const endDate = new Date(goalData.endDate);
                const currentDate = new Date();

                const timeDiff = endDate.getTime() - currentDate.getTime();
                const daysToGoal = Math.ceil(timeDiff / (1000 * 3600 * 24));

                dailyGoalCaloriesData = calculateGoalCalories(
                    maintenanceCaloriesData,
                    clientData.weight,
                    targetWeight,
                    daysToGoal
                );
            } else {
                if (bmi < 18.5) {
                    dailyGoalCaloriesData += 300;
                } else if (bmi <= 24.9) {
                    dailyGoalCaloriesData += 100;
                } else {
                    dailyGoalCaloriesData -= 400;
                }
            }

            const roundedCalories = Math.round(dailyGoalCaloriesData);
            setDailyGoalCalories(roundedCalories);
            setNutritionDistribution(calculateNutritionDistribution(roundedCalories, clientData.weight));
        };
        handleCalories();
    }, [clientData.id]);


    return (
        <div className="min-h-screen bg-dark">
            <DashboardHeader clientName={clientName} />
            <DashboardSidebar activeTab={activeTab} clientName={clientName} clientUserName={clientData.userName} clientId={clientData.id} onTabChange={setActiveTab} />

            {/* Main Content */}
            <main className="ml-64 pt-24 pb-12">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <>
                            {/* Welcome Section */}
                            <div className="mb-12">
                                <h1 className="text-4xl font-bold text-white mb-2">Welcome Back {clientName}!</h1>
                                <p className="text-gray-400">Track your fitness progress and achieve your goals</p>
                            </div>

                            {/* Top Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                {/* Weight Card */}
                                <div className="bg-card rounded-lg p-6 border border-gray-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-gray-400 font-medium">Current Weight</h3>
                                        <Scale className="text-primary" size={24} />
                                    </div>
                                    <p className="text-4xl font-bold text-white mb-2">{clientData.weight}</p>
                                    <p className="text-gray-400 text-sm">kg</p>
                                </div>

                                {/* Height Card */}
                                <div className="bg-card rounded-lg p-6 border border-gray-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-gray-400 font-medium">Height</h3>
                                        <Zap className="text-primary" size={24} />
                                    </div>
                                    <p className="text-4xl font-bold text-white mb-2">{clientData.height}</p>
                                    <p className="text-gray-400 text-sm">cm</p>
                                </div>

                                {/* Maintenance Calories Card */}
                                <div className="bg-card rounded-lg p-6 border border-gray-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-gray-400 font-medium">Maintenance Calories</h3>
                                        <Apple className="text-primary" size={24} />
                                    </div>
                                    <p className="text-4xl font-bold text-white mb-2">{maintenanceCalories}</p>
                                    <p className="text-gray-400 text-sm">kcal/day</p>
                                </div>
                            </div>

                            {/* Diet Goals Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                                {/* Diet as per goal */}
                                <div className="bg-card rounded-lg p-6 border border-gray-800">
                                    <h3 className="text-lg font-bold text-white mb-6">Diet as per Goal</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-400">Daily Goal</span>
                                                <span className="text-primary font-bold">{dailyGoalCalories} kcal</span>
                                            </div>

                                        </div>
                                        <div className="pt-4 border-t border-gray-700">
                                            <p className="text-sm text-gray-400">Goal: {maintenanceCalories > dailyGoalCalories ? 'Cut Calories' : 'Calories Surplus'}</p>
                                            <p className="text-lg font-bold text-white mt-2">{Math.abs(dailyGoalCalories - maintenanceCalories)} kcal/day</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Nutrition Chart */}
                                <div className="lg:col-span-2">
                                    <NutritionChart dailyGoalCalories={dailyGoalCalories} nutritionDistribution={nutritionDistribution} />
                                </div>
                            </div>

                            {/* Activity Chart */}
                            <div className="mb-12">
                                <ActivityChart clientId={clientData.id} clientData={clientData} dailyGoalCalories={dailyGoalCalories} nutritionDistribution={nutritionDistribution} />
                            </div>

                            {/* Recent Workouts */}
                            <div>
                                <RecentWorkouts clientId={localStorage.getItem('Trainer') === 'true' ? location.state.clientId : clientData.id} />
                            </div>
                        </>
                    )}

                    {/* Workouts Tab */}
                    {activeTab === 'workouts' && (
                        <>
                            <div className="mb-12">
                                <h1 className="text-4xl font-bold text-white mb-2">Manage Your Workouts</h1>
                                <p className="text-gray-400">Log, track, and manage your workout history</p>
                            </div>
                            <Workouts clientId={localStorage.getItem('Trainer') === 'true' ? location.state.clientId : clientData.id} />
                        </>
                    )}

                    {/* Goals Tab */}
                    {activeTab === 'goals' && (
                        <>
                            <div className="mb-12">
                                <h1 className="text-4xl font-bold text-white mb-2">Your Fitness Goals</h1>
                                <p className="text-gray-400">Set and track your fitness targets</p>
                            </div>
                            <Goals clientId={localStorage.getItem('Trainer') === 'true' ? location.state.clientId : clientData.id} />
                        </>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <>
                            <div className="mb-12">
                                <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
                                <p className="text-gray-400">Update your personal details and preferences</p>
                            </div>
                            <Settings clientId={localStorage.getItem('Trainer') === 'true' ? location.state.clientId : clientData.id} />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}