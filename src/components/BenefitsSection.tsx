import { Check, Heart, Brain, Zap } from 'lucide-react';

const benefits = [
  {
    icon: Heart,
    title: 'Better Health',
    description: 'Improve your cardiovascular health, strength, and overall wellness.',
  },
  {
    icon: Brain,
    title: 'Mental Clarity',
    description: 'Boost your mental health, reduce stress, and improve focus with regular exercise.',
  },
  {
    icon: Zap,
    title: 'More Energy',
    description: 'Experience increased energy levels and improved stamina throughout your day.',
  },
  {
    icon: Check,
    title: 'Better Results',
    description: 'Achieve your fitness goals 3x faster with our AI-powered recommendations.',
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How Strivon Makes Your Workout <span className="text-primary">Better</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Strivon combines cutting-edge technology with expert fitness guidance to help you achieve transformative results. Whether you're just starting or already crushing your goals, we have the perfect program for you.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                        <Icon className="text-primary" size={24} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{benefit.title}</h3>
                      <p className="text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-lg blur-2xl"></div>
            <div className="relative bg-card rounded-lg p-8 border border-gray-800">
              <div className="space-y-6">
                <div>
                  <div className="h-4 bg-primary/30 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-full"></div>
                </div>
                <div>
                  <div className="h-4 bg-primary/30 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                </div>
                <div>
                  <div className="h-4 bg-primary/30 rounded w-4/5 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-full"></div>
                </div>

                <div className="pt-6 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-sm">Progress</div>
                    <div className="text-primary font-bold">72%</div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
