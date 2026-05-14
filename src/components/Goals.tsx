import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_BASE_URL;

interface Goal {
    id?: number;
    name: string;
    description: string;
    targetWeight?: number;
    monthsToAcheive?: number;
    endDate: string;
    created?: string;
    modified?: string;
    status?: string;
}

interface GoalsProps {
    clientId?: string | number | null;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

export default function Goals({ clientId }: GoalsProps) {
    const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        targetWeight: '',
        monthsToAcheive: '',
        endDate: ''
    });

    const isActiveGoal = Boolean(
        activeGoal && new Date(activeGoal.endDate) >= today
    );

    useEffect(() => {
        if (!clientId) return;
        const fetchActiveGoal = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await fetch(`${API}/user/getgoal/${clientId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Unable to load goal data');
                }
                let data = null;
                if(response.json){
                    data = await response.json();
                }
                const goal = data?.goal ?? data ?? null;

                if (goal && typeof goal === 'object') {
                    setActiveGoal(goal as Goal);
                } else {
                    setActiveGoal(null);
                }
            } catch (fetchError) {
                console.error('Error fetching active goal:', fetchError);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveGoal();
    }, [clientId]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.name || !formData.targetWeight || !formData.monthsToAcheive) {
            setError('Please fill in all goal fields.');
            return;
        }

        if (!clientId) {
            setError('Client information is missing.');
            return;
        }
        try {
            
            const response = await fetch(`${API}/user/setgoal/${clientId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    targetWeight: Number(formData.targetWeight),
                    monthsToAcheive: Number(formData.monthsToAcheive),
                    endDate: formData.endDate
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create goal');
            }

            setFormData({ name: '', description: '', targetWeight: '', monthsToAcheive: '', endDate: '' });
            const createdGoal = await response.json();
            const goal = createdGoal?.goal ?? createdGoal ?? null;
            setActiveGoal(goal as Goal);
            setSuccess('Goal created successfully.');
        } catch (submitError) {
            console.error('Error creating goal:', submitError);
            setError('Could not create goal. Please try again.');
        }
    };

    const handleDelete = async () => {
        if (!activeGoal?.id) {
            setError('Goal ID is missing.');
            return;
        }

        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${API}/user/goal/${activeGoal.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete goal');
            }

            setActiveGoal(null);
            setSuccess('Goal deleted. You can create a new one now.');
        } catch (deleteError) {
            console.error('Error deleting goal:', deleteError);
            setError('Could not delete goal. Please try again.');
        }
    };

    const formatDate = (value?: string) => {
        if (!value) return '-';
        return new Date(value).toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-dark pt-6 pb-12">
            <div className="max-w-4xl mx-auto px-6">
                <div className="space-y-8">
                    <div className="rounded-3xl border border-gray-700 bg-slate-950 p-8 shadow-xl shadow-black/20">
                        <div className="flex flex-col gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-white">Current Planned Goal</h2>
                                <p className="text-gray-400">Only one active goal is allowed at a time. The create form appears only when there is no active goal.</p>
                            </div>

                            {loading && (
                                <div className="rounded-2xl border border-gray-800 bg-gray-900 px-6 py-5 text-gray-300">
                                    Loading active goal...
                                </div>
                            )}
                            {error && (
                                <div className="rounded-2xl border border-red-600 bg-red-950 px-6 py-5 text-red-300">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="rounded-2xl border border-emerald-600 bg-emerald-950 px-6 py-5 text-emerald-300">
                                    {success}
                                </div>
                            )}

                            { activeGoal ? (
                                <div className="rounded-3xl border border-gray-700 bg-slate-900 p-6 shadow-inner shadow-black/20">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <h3 className="text-2xl font-semibold text-white">{activeGoal.name}</h3>
                                                <p className="text-sm text-gray-400">Active until {formatDate(activeGoal.endDate)}</p>
                                            </div>
                                            <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                                                {activeGoal.status ?? 'In progress'}
                                            </span>
                                        </div>

                                        <p className="text-gray-300 whitespace-pre-line">{activeGoal.description}</p>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="rounded-2xl border border-gray-700 bg-gray-950 p-4">
                                                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Target Weight</p>
                                                <p className="mt-2 text-lg font-semibold text-white">{activeGoal.targetWeight ?? '-'}</p>
                                            </div>
                                            <div className="rounded-2xl border border-gray-700 bg-gray-950 p-4">
                                                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Months to Achieve</p>
                                                <p className="mt-2 text-lg font-semibold text-white">{activeGoal.monthsToAcheive ?? '-'}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                            <button
                                                type="button"
                                                onClick={handleDelete}
                                                className="inline-flex items-center justify-center rounded-2xl border border-red-600 bg-red-600/10 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-600/20"
                                            >
                                                Delete Goal
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                !loading && (
                                    <div className="rounded-3xl border border-dashed border-gray-700 bg-slate-900 p-6 text-gray-300">
                                        <p className="text-lg font-medium text-white">No active goal available.</p>
                                        <p className="mt-2 text-gray-400">Create a new goal to get started.</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {!isActiveGoal && (
                        <div className="rounded-3xl border border-gray-700 bg-slate-950 p-8 shadow-xl shadow-black/20">
                            <h2 className="text-3xl font-bold text-white mb-4">Create New Goal</h2>
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <label className="block">
                                        <span className="text-gray-300">Goal Name</span>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="mt-2 w-full rounded-2xl border border-gray-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-primary"
                                            placeholder="Goal name"
                                        />
                                    </label>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <label className="block">
                                        <span className="text-gray-300">Target Weight</span>
                                        <input
                                            type="number"
                                            name="targetWeight"
                                            value={formData.targetWeight}
                                            onChange={handleChange}
                                            className="mt-2 w-full rounded-2xl border border-gray-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-primary"
                                            placeholder="e.g. 75"
                                            min="0"
                                            step="0.1"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-300">Months to Achieve</span>
                                        <input
                                            type="number"
                                            name="monthsToAcheive"
                                            value={formData.monthsToAcheive}
                                            onChange={handleChange}
                                            className="mt-2 w-full rounded-2xl border border-gray-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-primary"
                                            placeholder="e.g. 6"
                                            min="1"
                                        />
                                    </label>
                                </div>

                                <label className="block">
                                    <span className="text-gray-300">Description</span>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="mt-2 w-full rounded-2xl border border-gray-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-primary"
                                        placeholder="Describe what you want to achieve"
                                    />
                                </label>

                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-black font-semibold transition hover:bg-primary/90"
                                >
                                    Save Goal
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
