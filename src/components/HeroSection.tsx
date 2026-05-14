import { Zap } from 'lucide-react';

interface HeroSectionProps {
  onTrainerClick: () => void;
  onSelfTrainedClick: () => void;
}

export default function HeroSection({ onTrainerClick, onSelfTrainedClick }: HeroSectionProps) {
  return (
    <section className="min-h-screen bg-gradient-to-b from-dark to-gray-900 flex items-center pt-24">
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-block mb-6">
          <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/20">
            ❚█══█❚ Welcome to Strivon
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Your Ultimate <span className="text-primary">Fitness</span> Companion
        </h1>

        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Transform your body and mind with personalized workouts, diet plans, and AI-powered progress tracking.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
          <button
            onClick={onTrainerClick}
            className="group flex items-center justify-center gap-3 bg-primary text-black font-bold py-4 px-8 rounded-lg hover:bg-primary/90 transition transform hover:scale-105 shadow-lg"
          >
            <Zap size={24} />
            <span>I'm a Trainer</span>
          </button>

          <button
            onClick={onSelfTrainedClick}
            className="group flex items-center justify-center gap-3 bg-gray-800 text-white font-bold py-4 px-8 rounded-lg border border-gray-700 hover:border-primary hover:bg-gray-700 transition transform hover:scale-105 shadow-lg"
          >
            <span>Train Myself</span>
          </button>
        </div>

        <div className="text-gray-400 text-sm">
          Join 10,000+ members already transforming their fitness journey
        </div>
      </div>
    </section>
  );
}
