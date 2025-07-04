import Image from "next/image";

interface GalleryProps {
  images: string[];
}

export default function Gallery({ images }: GalleryProps) {
  if (!images || images.length === 0) return null;
  return (
    <section className="mb-8">
      <h3 className="text-2xl font-bold text-cyan-800 mb-2">Imágenes del destino</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div key={i} className="relative w-full h-40">
            <Image
              src={img}
              alt={`Foto del destino ${i + 1}`}
              fill
              className="rounded-lg object-cover shadow"
              sizes="(max-width: 640px) 50vw, 33vw"
              loading="lazy"
              placeholder="empty"
            />
          </div>
        ))}
      </div>
    </section>
  );
} 