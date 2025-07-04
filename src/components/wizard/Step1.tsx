import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWizard } from "./WizardContext";
import { useState, useEffect, useRef } from "react";
import { FaShip } from 'react-icons/fa';

const schema = z.object({ destination: z.string().min(2, "El destino es obligatorio") });
type FormData = z.infer<typeof schema>;

export default function Step1() {
  const { data, setData, nextStep } = useWizard();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { destination: data.destination || "" },
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputValue = watch("destination");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!inputValue || inputValue.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/destinations?q=${encodeURIComponent(inputValue)}`);
        const data = await res.json();
        setSuggestions(data.destinations || []);
        setShowDropdown(true);
      } catch {
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [inputValue]);

  const onSubmit = (values: FormData) => {
    setData({ destination: values.destination });
    nextStep();
  };

  const handleSuggestionClick = (s: string) => {
    setValue("destination", s);
    setShowDropdown(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 relative rounded-2xl shadow-xl p-6 bg-white/70 backdrop-blur-md" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <label className="font-semibold text-blue-800 flex items-center gap-2 text-lg"><FaShip className="text-blue-500" />¿A dónde quieres navegar?</label>
      <input
        {...register("destination")}
        className="px-4 py-3 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none text-blue-900 text-lg bg-white/80 shadow transition-all"
        placeholder="Ej: Croacia, Ibiza, Grecia..."
        autoFocus
        autoComplete="off"
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
      />
      {loading && <span className="text-blue-400 text-sm animate-pulse">Buscando destinos...</span>}
      {errors.destination && <span className="text-red-500 text-sm animate-fade-in">{errors.destination.message}</span>}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 top-24 left-0 w-full bg-white/90 border border-blue-200 rounded-xl shadow-2xl max-h-48 overflow-y-auto animate-fade-in">
          {suggestions.map((s) => (
            <li
              key={s}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-blue-800 transition-all"
              onMouseDown={() => handleSuggestionClick(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
      <button type="submit" className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition-all text-lg shadow-lg mt-2 flex items-center gap-2 justify-center"><FaShip className="text-white" />Siguiente</button>
    </form>
  );
} 