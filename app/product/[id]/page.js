'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';


const ProductPage = ({ params }) => {
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND}/src/products/${id}`;
        console.log('Fetching product from:', url);

        try {
          const res = await fetch(url);
          if (!res.ok) {
            const errorText = await res.text();
            console.error('Fetch error:', errorText);
            throw new Error('Failed to fetch product');
          }
          const data = await res.json();
          console.log('Fetched product:', data);
          setProduct(data);
        } catch (error) {
          setError(error.message);
          console.error('Error fetching product:', error);
        }
      };

      fetchProduct();
    }
  }, [id]);

  const handleSizeClick = (size) => {
    setSelectedSize(size);
    setSelectedColor(null); // Reset selected color when size changes
  };

  const handleColorClick = (color) => {
    if (isColorAvailable(color)) {
      setSelectedColor(color);
    }
  };

  const isSizeAvailable = (sizeName) => {
    return product.productVariants.some(v => v.size.name === sizeName && v.quantity > 0);
  };

  const isColorAvailable = (colorName) => {
    if (!selectedSize) return false;
    return product.productVariants.some(v => v.size.name === selectedSize && v.color.name === colorName && v.quantity > 0);
  };

  const isCombinationAvailable = (sizeName, colorName) => {
    return product.productVariants.some(v => v.size.name === sizeName && v.color.name === colorName && v.quantity > 0);
  };

  const handleAddToCart = () => {
    // Lógica para adicionar o produto ao carrinho
    console.log(`Produto: ${product.name}, Tamanho: ${selectedSize}, Cor: ${selectedColor}, Quantidade: ${quantity}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <Head>
        <title>{product ? product.name : 'Produto'} - Loja de Roupas Moderna</title>
        <meta name="description" content={product ? product.description : 'Informações do produto'} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex-1 p-4">
        {error ? (
          <p className="mt-8 text-red-500 text-center">{error}</p>
        ) : product ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-1/2">
              <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover object-center md:h-full" />
            </div>
            <div className="w-full md:w-1/2 p-6 flex flex-col space-y-4">
              <h2 className="text-3xl font-bold">{product.name}</h2>
              <p className="text-gray-700">{product.description}</p>
              <p className="text-xl font-semibold text-purple-500">R${product.price.toFixed(2)}</p>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Tamanhos disponíveis:</h3>
                <div className="flex space-x-2">
                  {product.productVariants
                    .map(variant => variant.size.name)
                    .filter((size, index, self) => self.indexOf(size) === index) // Remove duplicados
                    .map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeClick(size)}
                        className={`py-2 px-4 rounded-full transition duration-300 ${selectedSize === size ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'} ${isSizeAvailable(size) ? 'hover:bg-purple-500 hover:text-white' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={!isSizeAvailable(size)}
                      >
                        {size}
                      </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Cores disponíveis:</h3>
                <div className="flex space-x-2">
                  {product.productVariants
                    .filter(variant => variant.size.name === selectedSize)
                    .map(variant => variant.color.name)
                    .filter((color, index, self) => self.indexOf(color) === index) // Remove duplicados
                    .map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorClick(color)}
                        className={`py-2 px-4 rounded-full transition duration-300 ${selectedColor === color ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'} ${isColorAvailable(color) ? 'hover:bg-purple-500 hover:text-white' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={!isColorAvailable(color)}
                      >
                        {color}
                      </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Quantidade:</h3>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                  className="py-2 px-4 border rounded-lg w-20"
                />
              </div>

              <button
                onClick={handleAddToCart}
                className={`mt-4 py-2 px-4 rounded-full transition duration-300 ${selectedSize && selectedColor && isCombinationAvailable(selectedSize, selectedColor) ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-400 cursor-not-allowed'}`}
                disabled={!selectedSize || !selectedColor || !isCombinationAvailable(selectedSize, selectedColor)}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-8 text-center">Carregando...</p>
        )}
      </main>
    </div>
  );
};

export default ProductPage;
