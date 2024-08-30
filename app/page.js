'use client';

import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import ProductCard from './components/ProductCard';
import LoadingAnimation from './components/LoadingAnimation';
import gsap from 'gsap';
import TextRotator from './components/TextRotator';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timelineRef = useRef(gsap.timeline({ paused: true }));

  useEffect(() => {
    const fetchProducts = async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND}/src/products?categories=homem,mulher,unissex`;
      console.log('Fetching products from:', url);

      try {
        const res = await fetch(url);
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Fetch error:', errorText);
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        console.log('Fetched data:', data);
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length) {
      timelineRef.current.play();
    }
  }, [products]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <Head>
        <title>Loja de Roupas Moderna</title>
        <meta name="description" content="A melhor loja de roupas com as últimas tendências da moda." />
      </Head>

      {loading ? (
        <LoadingAnimation />
      ) : (
        <main className="container mx-auto flex-1 p-4">
          <section className="max-h-screen min-w-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              <TextRotator
                texts={['Nova Coleção de Verão 2024', 'Descubra as últimas tendências', 'Compre agora com descontos especiais']}
                interval={5000}
                Tag="h2"
                className="text-4xl font-bold mb-4 justify-center"
              />
              <TextRotator
                texts={[
                  'Descubra as últimas tendências da moda com nossa nova coleção de verão.',
                  'Navegue por nossa incrível seleção de roupas.',
                  'Aproveite as ofertas especiais desta temporada.',
                  'Estilos que combinam com você em qualquer ocasião.'
                ]}
                interval={5000}
                Tag="p"
                className="mb-8 justify-center"
              />
              <a href="#" className="bg-white text-purple-500 font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-gray-200 transition duration-300">
                Comprar Agora
              </a>
            </div>
          </section>

          {error ? (
            <p className="mt-8 text-red-500 text-center">{error}</p>
          ) : (
            <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </section>
          )}
        </main>
      )}
    </div>
  );
}
