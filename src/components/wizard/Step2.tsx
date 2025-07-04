import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWizard } from "./WizardContext";
import { FaCalendarAlt } from 'react-icons/fa';

const schema = z.object({
  start: z.string().min(1, "Fecha de inicio requerida"),
  end: z.string().min(1, "Fecha de fin requerida"),
});
type FormData = z.infer<typeof schema>;

export default function Step2() {
  const { data, setData, nextStep, prevStep } = useWizard();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      start: data.dates?.start || "",
      end: data.dates?.end || "",
    },
  });

  const onSubmit = (values: FormData) => {
    setData({ dates: { start: values.start, end: values.end } });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-2xl shadow-xl p-6 bg-white/70 backdrop-blur-md" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <label className="font-semibold text-blue-800 flex items-center gap-2 text-lg"><FaCalendarAlt className="text-blue-500" />¿Cuándo quieres viajar?</label>
      <div className="flex gap-2">
        <input type="date" {...register("start")}
          className="px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none text-blue-900 bg-white/80 shadow w-full transition-all" />
        <input type="date" {...register("end")}
          className="px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none text-blue-900 bg-white/80 shadow w-full transition-all" />
      </div>
      {(errors.start || errors.end) && <span className="text-red-500 text-sm animate-fade-in">{errors.start?.message || errors.end?.message}</span>}
      <div className="flex gap-2 mt-2">
        <button type="button" onClick={prevStep} className="bg-gray-100 text-blue-700 font-bold py-2 px-4 rounded-lg shadow hover:bg-gray-200 transition-all">Atrás</button>
        <button type="submit" className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all flex items-center gap-2 justify-center"><FaCalendarAlt className="text-white" />Siguiente</button>
      </div>
    </form>
  );
} 