import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/types/database';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group block relative overflow-hidden rounded-xl aspect-[4/3] bg-gray-100"
    >
      {category.image_url ? (
        <Image
          src={category.image_url}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-lg">{category.name}</h3>
      </div>
    </Link>
  );
}
