import { useState, useEffect } from 'react';
import { Brain, Loader2, Sparkles } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

interface WorkoutData {
    id: number;
    date: string;
    workoutTypes: WorkoutTypeData[];
}

interface WorkoutTypeData {
    workoutTypeName: string;
    sets: SetData[];
}

interface SetData {
    setNo: number;
    weight: number;
    reps: number;
}

interface ClientData {
    id?: number;
    name: string;
    height: number;
    weight: number;
    age: number;
    gender: string;
    workoutfrequency: number;
}

interface NutritionDistribution {
    protein: { grams: number; calories: number; percentage: number };
    fat: { grams: number; calories: number; percentage: number };
    carbs: { grams: number; calories: number; percentage: number };
}

interface AnalyticsResponse {
    summary: string;
    workoutAnalysis: string[];
    dietAnalysis: string[];
    recommendations: string[];
    recovery: string[];
    TrainingEfficiency: string;
}

interface ActivityChartProps {
    clientId?: string | number | null;
    clientData: ClientData;
    dailyGoalCalories: number;
    nutritionDistribution: NutritionDistribution;
}

export default function ActivityChart({
    clientId,
    clientData,
    dailyGoalCalories,
    nutritionDistribution
}: ActivityChartProps) {

    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!clientId) return;
        if (loadStoredWorkouts().length === 0) return;

        generateAnalytics();
    }, [clientId, clientData, dailyGoalCalories, nutritionDistribution]);

    const loadStoredWorkouts = (): WorkoutData[] => {
        try {
            const saved = localStorage.getItem('workouts');

            return saved
                ? (JSON.parse(saved) as WorkoutData[])
                : [];
        } catch (err) {
            console.error('Error parsing stored workouts:', err);
            return [];
        }
    };

    const getWorkoutsForAnalysis = (): WorkoutData[] => {
        return loadStoredWorkouts();
    };

    const generateAnalytics = async () => {

        setLoading(true);
        setError('');
        if (localStorage.getItem(`analytics-${clientData.id}`)) {
            setAnalytics(JSON.parse(localStorage.getItem(`analytics-${clientData.id}`) || '{}'));
            setLoading(false);
            return;
        }
        try {

            const workouts = getWorkoutsForAnalysis();

            if (workouts.length === 0) {
                throw new Error(
                    'No workout history available yet.'
                );
            }

            const nutrition = nutritionDistribution;

            const prompt = `
You are a professional fitness and nutrition AI analyst.

Analyze the following user fitness data and return ONLY valid JSON.

IMPORTANT RULES:
- Return ONLY valid JSON
- No markdown
- No headings
- No explanations outside JSON
- Keep responses short and app-friendly
- Each insight should be maximum 12 words
- Focus on actionable recommendations

JSON FORMAT:
{
  "summary": "short overall summary",
  "workoutAnalysis": [
    "point 1",
    "point 2",
    "point 3"
  ],
  "dietAnalysis": [
    "point 1", this section shoud suggest the food recomondation as per nutrition distribution in diet
    "point 2" this section shoud suggest the food recomondation as per nutrition distribution in diet
    "point 3"  this section shoud suggest the food recomondation as per nutrition distribution in diet
  ],
  "recommendations": [
    "point 1",
    "point 2",
    "point 3"
  ],
  "recovery": [
    "point 1",
    "point 2"
  ],
  "TrainingEfficiency": "NEED IMPROVEMENT | MODERATE | HIGH"
}

USER PROFILE:
- Age: ${clientData.age} years
- Gender: ${clientData.gender}
- Height: ${clientData.height} cm
- Weight: ${clientData.weight} kg
- Workout Frequency: ${clientData.workoutfrequency} days per week
- Daily Calorie Goal: ${dailyGoalCalories} calories

NUTRITION DISTRIBUTION:
- Protein: ${nutrition.protein.grams}g (${nutrition.protein.percentage}%)
- Fat: ${nutrition.fat.grams}g (${nutrition.fat.percentage}%)
- Carbs: ${nutrition.carbs.grams}g (${nutrition.carbs.percentage}%)

RECENT WORKOUTS:
${workouts.slice(0, 5).map((workout, index) => `
Session ${index + 1}:
${workout.workoutTypes.map(type =>
`- ${type.workoutTypeName}: ${type.sets.map(set =>
`${set.weight}kg x ${set.reps}`
).join(', ')}`
).join('\n')}
`).join('\n')} `;

            const response = await fetch(
                `${API}/api/ai/analytics`,
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        prompt
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to generate analytics');
            }

            const data: AnalyticsResponse = await response.json();
            localStorage.setItem(`analytics-${clientData.id}`, JSON.stringify(data));
            setAnalytics(data);

        } catch (err) {
            console.error('Error generating analytics:', err);
            setError(
                'Unable to generate AI analytics at this time.'
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card rounded-lg p-6 border border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Brain className="text-primary" size={24} />
                    <h3 className="text-lg font-bold text-white">
                        AI Analytics
                    </h3>
                </div>
                <button
                    onClick={generateAnalytics}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                >
                    {loading
                        ? <Loader2 size={16} className="animate-spin" />
                        : <Sparkles size={16} />
                    }
                    {loading
                        ? 'Analyzing...'
                        : 'Refresh Analysis'
                    }
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-12">
                    <div className="text-center">
                        <Loader2
                            size={48}
                            className="animate-spin text-primary mx-auto mb-4"
                        />
                        <p className="text-gray-400">
                            Analyzing your fitness data...
                        </p>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
                    <p className="text-red-400">
                        {error}
                    </p>
                </div>
            )}
            {/* Analytics */}
            {analytics && !loading && (
                <div className="space-y-6">
                    {/* Summary */}
                    <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 rounded-xl p-6">
                        <h4 className="text-xl font-bold text-white mb-2">
                            Summary
                        </h4>
                        <p className="text-gray-300">
                            {analytics.summary}
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Diet */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                            <h4 className="text-primary font-semibold mb-4">
                                Workout Analysis
                            </h4>
                            <ul className="space-y-3">
                                {analytics.workoutAnalysis?.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex gap-2 text-gray-300"
                                    >
                                        <span className="text-primary">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Diet */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                            <h4 className="text-primary font-semibold mb-4">
                                Diet Analysis
                            </h4>
                            <ul className="space-y-3">
                                {analytics.dietAnalysis?.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex gap-2 text-gray-300"
                                    >
                                        <span className="text-primary">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Recommendations */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                            <h4 className="text-primary font-semibold mb-4">
                                Recommendations
                            </h4>
                            <ul className="space-y-3">
                                {analytics.recommendations?.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex gap-2 text-gray-300"
                                    >
                                        <span className="text-primary">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Recovery */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                            <h4 className="text-primary font-semibold mb-4">
                                Recovery
                            </h4>
                            <ul className="space-y-3">
                                {analytics.recovery?.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex gap-2 text-gray-300"
                                    >
                                        <span className="text-primary">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Risk Level */}
                    <div className="flex justify-end">
                        <div className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                            <span className="text-green-400 font-medium text-sm">
                                Training Efficiency: {analytics.TrainingEfficiency}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!analytics && !loading && !error && (
                <div className="text-center py-12">
                    <Brain
                        size={48}
                        className="text-gray-600 mx-auto mb-4"
                    />
                    <p className="text-gray-400 mb-3">
                        Click "Refresh Analysis" to generate AI insights
                    </p>
                    <p className="text-sm text-gray-500">
                        Personalized workout and nutrition recommendations
                    </p>
                </div>
            )}
        </div>
    );
}