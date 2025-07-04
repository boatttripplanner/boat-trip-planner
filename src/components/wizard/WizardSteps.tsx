import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import ReviewAndConfirm from "./ReviewAndConfirm";
import { useWizard } from "./WizardContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaShip, FaCalendarAlt, FaHeart, FaCheckCircle } from 'react-icons/fa';

const steps = [
  { label: "Destino", icon: <FaShip className="w-5 h-5" /> },
  { label: "Fechas", icon: <FaCalendarAlt className="w-5 h-5" /> },
  { label: "Barco", icon: <FaShip className="w-5 h-5" /> },
  { label: "Intereses", icon: <FaHeart className="w-5 h-5" /> },
  { label: "Resumen", icon: <FaCheckCircle className="w-5 h-5" /> },
];

interface WizardStepsProps {
  onGenerate?: (data: any) => void;
}

export default function WizardSteps({ onGenerate }: WizardStepsProps) {
  const { step } = useWizard();
  return (
    <div className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl p-6" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', fontFamily: 'Montserrat, Arial, sans-serif' }}>
      {/* Indicador de progreso */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((s, i) => (
          <div key={s.label} className="flex-1 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mb-1 transition-colors duration-300 text-lg shadow-lg border-2 ${step === i+1 ? 'bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 border-blue-700 scale-110' : step > i+1 ? 'bg-blue-300 border-blue-300' : 'bg-blue-100 border-blue-100'}`}>{s.icon}</div>
            <span className={`text-xs mt-1 ${step === i+1 ? 'text-blue-700 font-bold' : 'text-blue-400'}`}>{s.label}</span>
          </div>
        ))}
      </div>
      {/* Línea de progreso */}
      <div className="relative h-2 mb-8 bg-blue-100 rounded-full overflow-hidden">
        <motion.div
          className="absolute h-2 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-300 rounded-full shadow"
          initial={{ width: 0 }}
          animate={{ width: `${((step-1)/(steps.length-1))*100}%` }}
          transition={{ duration: 0.4 }}
          style={{ top: 0, left: 0 }}
        />
      </div>
      {/* Animación de pasos */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
          {step === 5 && <ReviewAndConfirm onGenerate={onGenerate} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 