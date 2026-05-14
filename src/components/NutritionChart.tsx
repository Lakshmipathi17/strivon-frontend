import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#f97316', '#ec4899', '#3b82f6'];

interface NutritionDistribution {
    protein: { grams: number; calories: number; percentage: number };
    fat: { grams: number; calories: number; percentage: number };
    carbs: { grams: number; calories: number; percentage: number };
}

export default function NutritionChart({
    dailyGoalCalories,
    nutritionDistribution
}: {
    dailyGoalCalories: number;
    nutritionDistribution: NutritionDistribution;
}) {
    const nutritionData = [
        {
            name: 'Carbs',
            value: nutritionDistribution.carbs.percentage,
            grams: nutritionDistribution.carbs.grams,
        },
        {
            name: 'Protein',
            value: nutritionDistribution.protein.percentage,
            grams: nutritionDistribution.protein.grams,
        },
        {
            name: 'Fat',
            value: nutritionDistribution.fat.percentage,
            grams: nutritionDistribution.fat.grams,
        },
    ];

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-6 tracking-wide">
                Suggested Nutrition Distribution
            </h3>

            <div className="flex flex-col lg:flex-row items-center gap-10">

                <div className="flex-1 min-h-[320px] relative">
                    <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                            <Pie
                                data={nutritionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}   // 🔥 makes donut
                                outerRadius={110}
                                paddingAngle={4}   // 🔥 spacing between slices
                                dataKey="value"
                                stroke="none"
                            >
                                {nutritionData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index]}
                                        style={{
                                            filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.4))"
                                        }}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#111827',
                                    border: '1px solid #374151',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    padding: '12px'
                                }}
                                formatter={(_value, _name, props) => [
                                    `${props.payload.grams}g`,
                                    props.payload.name
                                ]}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <p className="text-gray-400 text-sm">Calories</p>
                        <p className="text-3xl font-bold text-white">
                            {Math.round(dailyGoalCalories)}
                        </p>
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    {nutritionData.map((item, index) => (
                        <div
                            key={item.name}
                            className="bg-gray-800/60 backdrop-blur rounded-xl p-4 border border-gray-700 hover:border-gray-500 transition"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: COLORS[index] }}
                                    />
                                    <span className="font-semibold text-white">
                                        {item.name}
                                    </span>
                                </div>
                                <span className="text-gray-300 text-sm">
                                    {item.value}%
                                </span>
                            </div>

                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-white">
                                    {item.grams}
                                </span>
                                <span className="text-gray-400 text-sm">
                                    grams/day
                                </span>
                            </div>

                            {/* 🔥 Smooth progress bar */}
                            <div className="mt-3 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-2 rounded-full transition-all duration-700 ease-out"
                                    style={{
                                        width: `${item.value}%`,
                                        background: `linear-gradient(90deg, ${COLORS[index]}, #ffffff33)`
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}