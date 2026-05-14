import { Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-dev-runtime";

export default function TrainerProtectedRoute({ children }: { children: JSX.Element }) {
    const isTrainer = localStorage.getItem("Trainer");

    if (isTrainer !== "true") {
        return <Navigate to="/" replace />;
    }

    return children;
}