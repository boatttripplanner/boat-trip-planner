import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWizard } from "./WizardContext";
import { FaShip } from 'react-icons/fa';

const boatTypes = [
  { value: "sailboat", label: "Velero" },
  { value: "catamaran", label: "Catamarán" },
  { value: "motorboat", label: "Lancha/Motor" },
  { value: "yacht", label: "Yate" },
];

const schema = z.object({ boatType: z.string().min(1, "Selecciona un tipo de barco") });
type FormData = z.infer<typeof schema>;

export default function Step3() {
  const { data, setData, nextStep, prevStep } = useWizard();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { boatType: data.boatType || "" },
  });

  const onSubmit = (values: FormData) => {
    setData({ boatType: values.boatType });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-2xl shadow-xl p-6 bg-white/70 backdrop-blur-md" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <label className="font-semibold text-blue-800 flex items-center gap-2 text-lg"><FaShip className="text-blue-500" />¿Qué tipo de barco prefieres?</label>
      <div className="flex flex-col gap-2">
        {boatTypes.map((b) => (
          <label key={b.value} className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2 shadow border border-blue-100 hover:bg-blue-50 transition-all cursor-pointer">
            <input type="radio" value={b.value} {...register("boatType")}
              className="accent-blue-700 w-5 h-5" />
            <span className="text-blue-900 font-semibold">{b.label}</span>
          </label>
        ))}
      </div>
      {errors.boatType && <span className="text-red-500 text-sm animate-fade-in">{errors.boatType.message}</span>}
      <div className="flex gap-2 mt-2">
        <button type="button" onClick={prevStep} className="bg-gray-100 text-blue-700 font-bold py-2 px-4 rounded-lg shadow hover:bg-gray-200 transition-all">Atrás</button>
        <button type="submit" className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all flex items-center gap-2 justify-center"><FaShip className="text-white" />Siguiente</button>
      </div>
    </form>
  );
} 