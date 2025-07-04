import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWizard } from "./WizardContext";
import { FaHeart } from 'react-icons/fa';

const interestsList = [
  { value: "relax", label: "Relax" },
  { value: "party", label: "Fiesta" },
  { value: "family", label: "Familia" },
  { value: "diving", label: "Buceo" },
  { value: "romantic", label: "Romántico" },
  { value: "adventure", label: "Aventura" },
];

const schema = z.object({ interests: z.array(z.string()).min(1, "Selecciona al menos un interés") });
type FormData = z.infer<typeof schema>;

export default function Step4() {
  const { data, setData, nextStep, prevStep } = useWizard();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { interests: data.interests || [] },
  });

  const onSubmit = (values: FormData) => {
    setData({ interests: values.interests });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-2xl shadow-xl p-6 bg-white/70 backdrop-blur-md" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <label className="font-semibold text-blue-800 flex items-center gap-2 text-lg"><FaHeart className="text-pink-500" />¿Qué tipo de experiencia buscas?</label>
      <div className="flex flex-col gap-2">
        {interestsList.map((i) => (
          <label key={i.value} className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2 shadow border border-blue-100 hover:bg-blue-50 transition-all cursor-pointer">
            <input type="checkbox" value={i.value} {...register("interests")}
              className="accent-pink-600 w-5 h-5" />
            <span className="text-blue-900 font-semibold">{i.label}</span>
          </label>
        ))}
      </div>
      {errors.interests && <span className="text-red-500 text-sm animate-fade-in">{errors.interests.message}</span>}
      <div className="flex gap-2 mt-2">
        <button type="button" onClick={prevStep} className="bg-gray-100 text-blue-700 font-bold py-2 px-4 rounded-lg shadow hover:bg-gray-200 transition-all">Atrás</button>
        <button type="submit" className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all flex items-center gap-2 justify-center"><FaHeart className="text-white" />Siguiente</button>
      </div>
    </form>
  );
} 