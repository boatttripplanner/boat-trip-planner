import AnimatedButton from "@/components/AnimatedButton";

interface PremiumNoticeProps {
  isPremiumUser: boolean;
}

export default function PremiumNotice({ isPremiumUser }: PremiumNoticeProps) {
  if (isPremiumUser) return null;
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-lg mb-8 flex items-center gap-4">
      <span className="text-yellow-700 font-semibold">Funcionalidad premium</span>
      <AnimatedButton className="ml-auto bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-4 rounded transition-colors">Mejorar cuenta</AnimatedButton>
    </div>
  );
} 