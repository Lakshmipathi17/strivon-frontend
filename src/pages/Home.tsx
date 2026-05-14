import LandingHeader from '../components/LandingHeader';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import BenefitsSection from '../components/BenefitsSection';
import FooterSection from '../components/FooterSection';
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    const handleTrainerMode = () => {
        navigate("/trainer");
    };

    const handleSelfTrainedMode = () => {
        navigate("/self-trained-details");
    };

    return (
        <div className="min-h-screen bg-dark">
            <LandingHeader />
            <HeroSection 
                onTrainerClick={handleTrainerMode}
                onSelfTrainedClick={handleSelfTrainedMode}
            />
            <FeaturesSection />
            <BenefitsSection />
            <FooterSection />
        </div>
    );
}