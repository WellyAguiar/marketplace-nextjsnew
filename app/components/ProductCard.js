// components/ProductCard.js
'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';


const ProductCard = ({ product, timeline }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, x: -100 },
      {
        opacity: 1,
        x: 0,
        rotate: 0,
        duration: 1,
        ease: 'power3.out',
        
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 700',
          end: 'bottom 550',
          scrub: true,
        },
      }
    );
  }, [timeline]);

  return (
    <Link href={`/product/${product.id}`} passHref>
      <div
        ref={cardRef}
        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center cursor-pointer"
      >
        <div className="w-full h-48 sm:h-64 md:h-72 lg:h-80 xl:h-96 bg-gray-200 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="p-4 w-full text-center">
          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
          <p className="text-gray-600">{product.description}</p>
          <button className="mt-4 bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition duration-300">
            Ver Mais
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
