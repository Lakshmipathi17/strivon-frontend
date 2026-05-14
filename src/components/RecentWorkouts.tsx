import { useState, useEffect } from 'react';
import { Calendar, Dumbbell, ChevronDown } from 'lucide-react';
const API = import.meta.env.VITE_API_BASE_URL;
interface SetData {
    setNo: number;
    weight: number;
    reps: number;
}

interface WorkoutTypeData {
    workoutTypeName: string;
    sets: SetData[];
}

interface WorkoutData {
    id: number;
    date: string;
    workoutTypes: WorkoutTypeData[];
}

interface GroupedWorkouts {
    [date: string]: {
        [workoutType: string]: WorkoutTypeData[];
    }
}

interface RecentWorkoutsProps {
    clientId?: string | number | null;
}

export default function RecentWorkouts({ clientId }: RecentWorkoutsProps) {
    const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!clientId) return;
        fetchRecentWorkouts();
    }, [clientId]);

    const fetchRecentWorkouts = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API}/user/workout/${clientId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Fetch response:', response);
            if (response.ok) {
                const data: WorkoutData[] = await response.json();
                setWorkouts(data);
                setExpandedDates(new Set(data.map((workout) => workout.date)));
                localStorage.setItem('workouts', JSON.stringify(data));
            } else if (response.status === 204) {
                setWorkouts([]);
                setExpandedDates(new Set());
                localStorage.setItem('workouts', JSON.stringify([]));
            } else {
                throw new Error('Failed to load recent workouts');
            }
        } catch (err) {
            console.error('Error fetching recent workouts:', err);
            setError('Could not load recent workouts.');
        } finally {
            setLoading(false);
        }
    };

    const groupedWorkouts: GroupedWorkouts = workouts.reduce((acc, workout) => {
        if (!acc[workout.date]) {
            acc[workout.date] = {};
        }
        workout.workoutTypes.forEach((type) => {
            if (!acc[workout.date][type.workoutTypeName]) {
                acc[workout.date][type.workoutTypeName] = [];
            }
            acc[workout.date][type.workoutTypeName].push(type);
        });
        return acc;
    }, {} as GroupedWorkouts);

    const sortedDates = Object.keys(groupedWorkouts).sort((a, b) => 
        new Date(b).getTime() - new Date(a).getTime()
    );

    const toggleDate = (date: string) => {
        const newExpanded = new Set(expandedDates);
        if (newExpanded.has(date)) {
            newExpanded.delete(date);
        } else {
            newExpanded.add(date);
        }
        setExpandedDates(newExpanded);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (dateStr === today.toISOString().split('T')[0]) {
            return 'Today';
        } else if (dateStr === yesterday.toISOString().split('T')[0]) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        }
    };

    return (
        <div className="bg-card rounded-lg p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-6">
                <Dumbbell size={24} className="text-primary" />
                <h3 className="text-lg font-bold text-white">Recent Workouts</h3>
            </div>

            {loading && <p className="text-gray-400 mb-4">Loading recent workouts...</p>}
            {error && <p className="text-red-400 mb-4">{error}</p>}

            <div className="space-y-4">
                {sortedDates.map((date) => (
                    <div key={date} className="border border-gray-700 rounded-lg overflow-hidden">
                        {/* Date Header */}
                        <button
                            onClick={() => toggleDate(date)}
                            className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 transition"
                        >
                            <div className="flex items-center gap-3">
                                <Calendar size={18} className="text-primary" />
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-white">{formatDate(date)}</p>
                                    <p className="text-xs text-gray-400">{Object.values(groupedWorkouts[date]).flat().length} workout(s)</p>
                                </div>
                            </div>
                            <ChevronDown 
                                size={20} 
                                className={`text-gray-400 transition-transform ${expandedDates.has(date) ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Workouts for this date */}
                        {expandedDates.has(date) && (
                            <div className="divide-y divide-gray-700">
                                {Object.entries(groupedWorkouts[date]).map(([workouttype, workoutTypeEntries]) => {
                                    const setList = workoutTypeEntries.flatMap(entry => entry.sets);
                                    return (
                                        <div
                                            key={workouttype}
                                            className="p-4 bg-gray-900/50 hover:bg-gray-800/50 transition"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                    <p className="font-semibold text-white">{workouttype}</p>
                                                </div>
                                            </div>
                                            {setList.map((set, index) => (
                                                <div key={`${workouttype}-${set.setNo}-${index}`} className="bg-gray-800/50 rounded-lg p-4 mb-3 border border-gray-700">
                                                    <div className="grid grid-cols-3 divide-x divide-gray-700">
                                                        <div className="px-4 text-center">
                                                            <p className="text-xs text-gray-400 mb-1">Set</p>
                                                            <p className="text-sm font-semibold text-primary">{set.setNo}</p>
                                                        </div>
                                                        <div className="px-4 text-center">
                                                            <p className="text-xs text-gray-400 mb-1">Weight</p>
                                                            <p className="text-sm font-semibold text-white">{set.weight === 0 ? '0 kg' : `${set.weight} kg`}</p>
                                                        </div>
                                                        <div className="px-4 text-center">
                                                            <p className="text-xs text-gray-400 mb-1">Reps</p>
                                                            <p className="text-sm font-semibold text-white">{set.reps}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            ))}
        </div>
        </div>
    );
}
