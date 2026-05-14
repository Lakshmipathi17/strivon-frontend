import { useState, useEffect } from 'react';
import { Calendar, Dumbbell, Trash2, Plus, Minus } from 'lucide-react';
const API = import.meta.env.VITE_API_BASE_URL;

interface SetData {
    setNo: number;
    weight: number;
    reps: number;
}

interface WorkoutType {
    id: number;
    name: string;
    targetMuscle: string;
    created: string;
    modified: string;
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

interface PlainWorkoutData {
    sets: SetData[];
    workoutTypeName: string;
    workoutDate: string;
    workoutTypeId: number;
}

interface WorkoutsProps {
    clientId?: string | number | null;
}

interface GroupedWorkouts {
    [date: string]: WorkoutData[];
}

export default function Workouts({ clientId }: WorkoutsProps) {
    const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [workoutTypeSearch, setWorkoutTypeSearch] = useState<string>('');
    const [newWorkout, setNewWorkout] = useState({
        workoutTypeName: '',
        workoutDate: new Date().toISOString().split('T')[0],
        sets: [{ setNo: 1, weight: 0, reps: 0 }] as SetData[]
    });

    useEffect(() => {
        if (!clientId) return;
        fetchWorkouts();
    }, [clientId, selectedDate]);

    useEffect(() => {
        fetchWorkoutTypes();
    }, []);

    const fetchWorkouts = async () => {
        setLoading(true);
        setError('');
        try {
            const url = selectedDate 
                ? `${API}/user/workout/${clientId}?localDate=${selectedDate}`
                : `${API}/user/workout/${clientId}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data: WorkoutData[] = await response.json();
                setWorkouts(data);
                localStorage.setItem('workouts', JSON.stringify(data));
            } else if (response.status === 204) {
                setWorkouts([]);
                localStorage.setItem('workouts', JSON.stringify([]));
            } else {
                throw new Error('Failed to fetch workouts');
            }
        } catch (err) {
            console.error('Error fetching workouts:', err);
            setError('No workouts found for this date');
            // Load from localStorage if API fails
            const saved = localStorage.getItem('workouts');
            if (saved) {
                setWorkouts(JSON.parse(saved));
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkoutTypes = async () => {
        try {
            const response = await fetch(`${API}/workoutTypes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data: WorkoutType[] = await response.json();
                setWorkoutTypes(data);
            }
        } catch (err) {
            console.error('Error fetching workout types:', err);
        }
    };

    const handleAddSet = () => {
        const newSetNo = newWorkout.sets.length + 1;
        setNewWorkout(prev => ({
            ...prev,
            sets: [...prev.sets, { setNo: newSetNo, weight: 0, reps: 0 }]
        }));
    };

    const handleRemoveSet = (index: number) => {
        setNewWorkout(prev => ({
            ...prev,
            sets: prev.sets.filter((_, i) => i !== index).map((set, i) => ({ ...set, setNo: i + 1 }))
        }));
    };

    const handleSetChange = (index: number, field: keyof SetData, value: number) => {
        setNewWorkout(prev => ({
            ...prev,
            sets: prev.sets.map((set, i) => i === index ? { ...set, [field]: value } : set)
        }));
    };

    const handleAddWorkout = async () => {
        if (!newWorkout.workoutTypeName || newWorkout.sets.length === 0) {
            alert('Please fill workout name and add at least one set');
            return;
        }

        const plainWorkoutData: PlainWorkoutData = {
            sets: newWorkout.sets,
            workoutTypeName: newWorkout.workoutTypeName,
            workoutTypeId : workoutTypes.find(type => type.name === newWorkout.workoutTypeName)?.id || 0,
            workoutDate: newWorkout.workoutDate
        };

        try {
            const response = await fetch(`${API}/user/workout/${clientId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(plainWorkoutData)
            });

            if (response.ok) {
                setNewWorkout({
                    workoutTypeName: '',
                    workoutDate: new Date().toISOString().split('T')[0],
                    sets: [{ setNo: 1, weight: 0, reps: 0 }]
                });
                fetchWorkouts(); // Refresh
            } else {
                throw new Error('Failed to save workout');
            }
        } catch (err) {
            console.error('Error saving workout:', err);
            alert('Could not save workout. Please try again.');
        }
    };

    const handleDeleteWorkout = async (workoutId: number) => {
        try {
            const response = await fetch(`${API}/user/workout/${workoutId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                fetchWorkouts(); // Refresh
            } else {
                throw new Error('Failed to delete workout');
            }
        } catch (err) {
            console.error('Error deleting workout:', err);
            alert('Could not delete workout. Please try again.');
        }
    };

    const groupedWorkouts: GroupedWorkouts = workouts.reduce((acc, workout) => {
        if (!acc[workout.date]) {
            acc[workout.date] = [];
        }
        acc[workout.date].push(workout);
        return acc;
    }, {} as GroupedWorkouts);

    const sortedDates = Object.keys(groupedWorkouts).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return (
        <div className="space-y-8">
            {/* Add New Workout */}
            <div className="bg-card rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Plus size={24} />
                    Add Workout
                </h3>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Workout Name
                            </label>
                            <select
                                value={newWorkout.workoutTypeName}
                                onChange={(e) => setNewWorkout(prev => ({ ...prev, workoutTypeName: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition"
                            >
                                <option value="">Select Workout Name</option>
                                {workoutTypes
                                    .filter(type => type.name.toLowerCase().includes(workoutTypeSearch.toLowerCase()))
                                    .map((type) => (
                                        <option key={type.id} value={type.name}>
                                            {type.name} ({type.targetMuscle})
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={newWorkout.workoutDate}
                                onChange={(e) => setNewWorkout(prev => ({ ...prev, workoutDate: e.target.value }))}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Sets
                        </label>
                        <div className="space-y-2">
                            {newWorkout.sets.map((set, index) => (
                                <div key={index} className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
                                    <div className="w-16">
                                        <span className="text-gray-400 text-sm">Set {set.setNo}</span>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="Weight (kg)"
                                        value={set.weight || ''}
                                        onChange={(e) => handleSetChange(index, 'weight', parseFloat(e.target.value) || 0)}
                                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Reps"
                                        value={set.reps || ''}
                                        onChange={(e) => handleSetChange(index, 'reps', parseInt(e.target.value) || 0)}
                                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                                    />
                                    {newWorkout.sets.length > 1 && (
                                        <button
                                            onClick={() => handleRemoveSet(index)}
                                            className="p-2 hover:bg-red-600 rounded transition"
                                        >
                                            <Minus size={16} className="text-gray-400 hover:text-white" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleAddSet}
                            className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition"
                        >
                            <Plus size={16} />
                            Add Set
                        </button>
                    </div>

                    <button
                        onClick={handleAddWorkout}
                        className="w-full bg-primary text-black font-bold py-2 rounded-lg hover:bg-primary/90 transition"
                    >
                        Add Workout
                    </button>
                </div>
            </div>

            {/* Workouts List */}
            <div className="bg-card rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Dumbbell size={24} />
                    Your Workouts
                </h3>

                <div className="flex flex-wrap gap-4 items-end mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Filter by Date
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition"
                            />
                            <button
                                onClick={() => setSelectedDate('')}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {loading && <p className="text-gray-400">Loading workouts...</p>}
                {error && <p className="text-red-400">{error}</p>}

                <div className="space-y-6">
                    {sortedDates.map((date) => (
                        <div key={date} className="border border-gray-700 rounded-lg overflow-hidden">
                            <div className="p-4 bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <Calendar size={18} className="text-primary" />
                                    <p className="text-sm font-semibold text-white">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                                </div>

                            </div>
                            <div className="divide-y divide-gray-700">
                                {groupedWorkouts[date].map((workout) => (
                                    <div key={workout.id} className="p-4 bg-gray-900/50">
                                    <div className="mt-2 text-gray-400 text-sm flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleDeleteWorkout(workout.id)} className="p-2 hover:bg-red-600 rounded transition">
                                            <Trash2 size={18} className="text-gray-400 hover:text-white" />
                                        </button>
                                    </div>
                                        {workout.workoutTypes.map((type, typeIndex) => (
                                            <div key={typeIndex} className="mb-4 last:mb-0">
                                                <div className="flex items-center justify-between mb-3">
                                                    <p className="font-semibold text-white">{type.workoutTypeName}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    {type.sets.map((set) => (
                                                        <div key={set.setNo} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                                            <div className="grid grid-cols-3 gap-4">
                                                                <div className="text-center">
                                                                    <p className="text-xs text-gray-400 mb-1">Set</p>
                                                                    <p className="text-sm font-semibold text-primary">{set.setNo}</p>
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className="text-xs text-gray-400 mb-1">Weight</p>
                                                                    <p className="text-sm font-semibold text-white">{set.weight} kg</p>
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className="text-xs text-gray-400 mb-1">Reps</p>
                                                                    <p className="text-sm font-semibold text-white">{set.reps}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {sortedDates.length === 0 && !loading && (
                        <p className="text-gray-400 text-center py-8">
                            {selectedDate ? 'No workouts on this date' : 'No workouts yet'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
