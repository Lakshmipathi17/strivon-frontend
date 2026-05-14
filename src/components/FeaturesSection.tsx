import { Dumbbell, BarChart3, Users, Zap, Target, BrainCircuit } from 'lucide-react';

const features = [
  {
    icon: Dumbbell,
    title: 'Personalized Plans',
    description: 'Get workout plans tailored to your fitness level, goals, and preferences.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Monitor your progress with detailed analytics and performance metrics.',
  },
  {
    icon: Users,
    title: 'Expert Trainers',
    description: 'Connect with certified fitness professionals for guidance and support.',
  },
  {
    icon: BrainCircuit,
    title: 'AI Analytics',
    description: 'AI analyzes your workouts and provides actionable insights to optimize your training.',
  },
  {
    icon: Zap,
    title: 'Real-time Feedback',
    description: 'Get instant feedback on your form and technique during workouts.',
  },
  {
    icon: Target,
    title: 'Goal Setting',
    description: 'Set and track multiple fitness goals with our intelligent goal system.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful Features for Your Success
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to achieve your fitness goals in one powerful platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-lg p-8 border border-gray-800 hover:border-primary/50 transition group"
              >
                <div className="mb-4 inline-block p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition">
                  <Icon className="text-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
