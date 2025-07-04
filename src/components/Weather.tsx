interface WeatherDay {
  day: string;
  temp: number;
  desc: string;
}

interface WeatherProps {
  days: WeatherDay[];
}

export default function Weather({ days }: WeatherProps) {
  if (!days || days.length === 0) return null;
  return (
    <section className="mb-8">
      <h3 className="text-2xl font-bold text-cyan-800 mb-2">Clima (próximos 5 días)</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {days.map((d, i) => (
          <div key={i} className="bg-cyan-50 rounded-lg p-3 text-center shadow-inner">
            <div className="font-semibold text-cyan-700">{d.day}</div>
            <div className="text-2xl text-cyan-900">{d.temp}°C</div>
            <div className="text-cyan-600 text-sm">{d.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
} 