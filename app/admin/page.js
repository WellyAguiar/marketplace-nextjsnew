'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import LoadingAnimation from '../components/LoadingAnimation';

const sizes = ['PP', 'P', 'M', 'G', 'GG'];
const colors = ['Vermelho', 'Azul', 'Verde', 'Amarelo', 'Preto', 'Branco'];
const categories = ['homem', 'mulher', 'unissex'];

export default function Admin() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState('new'); // 'new' for new product, 'stock' for stock increment
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    size: '',
    color: '',
    quantity: '',
    image: null
  });
  const [stockData, setStockData] = useState({
    productId: '',
    size: '',
    color: '',
    quantity: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND}/src/products?categories=homem,mulher,unissex`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false); // Certifique-se de definir o loading como false após buscar os dados
      }
    };

    fetchProducts();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleStockChange = (e) => {
    const { name, value } = e.target;
    setStockData({ ...stockData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { name, description, price, category, size, color, quantity, image } = formData;
    if (!name || !description || !price || !category || !size || !color || !image) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('description', description);
    formDataToSend.append('price', price);
    formDataToSend.append('category', category);
    formDataToSend.append('size', size);
    formDataToSend.append('color', color);
    formDataToSend.append('quantity', quantity);
    formDataToSend.append('image', image);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/src/products/create`, {
        method: 'POST',
        body: formDataToSend
      });
      if (!res.ok) {
        throw new Error('Erro ao cadastrar produto');
      }
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();

    const { productId, size, color, quantity } = stockData;
    if (!productId || !size || !color || !quantity) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/src/products/increment-stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, size, color, quantity })
      });
      if (!res.ok) {
        throw new Error('Erro ao incrementar estoque');
      }
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <Head>
        <title>Admin - Gerenciar Produtos</title>
      </Head>

      {loading ? (
        <LoadingAnimation />
      ) : (
        <main className="container mx-auto flex-1 p-4">
          <h2 className="text-2xl font-bold mb-4">Gerenciar Produtos</h2>
          <div className="flex justify-between mb-4">
            <button className={`py-2 px-4 rounded ${mode === 'new' ? 'bg-purple-500 text-white' : 'bg-gray-300'}`} onClick={() => setMode('new')}>
              Cadastrar Novo Produto
            </button>
            <button className={`py-2 px-4 rounded ${mode === 'stock' ? 'bg-purple-500 text-white' : 'bg-gray-300'}`} onClick={() => setMode('stock')}>
              Incrementar Estoque
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          {mode === 'new' ? (
            <form onSubmit={handleFormSubmit} className="bg-white p-4 rounded-lg shadow-lg space-y-4">
              <div>
                <label className="block text-gray-700">Nome:</label>
                <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2" />
              </div>
              <div>
                <label className="block text-gray-700">Descrição:</label>
                <textarea name="description" value={formData.description} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2"></textarea>
              </div>
              <div>
                <label className="block text-gray-700">Preço:</label>
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2" />
              </div>
              <div>
                <label className="block text-gray-700">Categoria:</label>
                <select name="category" value={formData.category} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2">
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Tamanho:</label>
                <select name="size" value={formData.size} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2">
                  <option value="">Selecione um tamanho</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Cor:</label>
                <select name="color" value={formData.color} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2">
                  <option value="">Selecione uma cor</option>
                  {colors.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Quantidade:</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2" />
              </div>
              <div>
                <label className="block text-gray-700">Imagem:</label>
                <input type="file" name="image" onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2" />
              </div>
              <div>
                <button type="submit" className="bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition duration-300">Cadastrar</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleStockSubmit} className="bg-white p-4 rounded-lg shadow-lg space-y-4">
              <div>
                <label className="block text-gray-700">Produto:</label>
                <select name="productId" value={stockData.productId} onChange={handleStockChange} className="w-full border border-gray-300 rounded p-2">
                  <option value="">Selecione um produto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Tamanho:</label>
                <select name="size" value={stockData.size} onChange={handleStockChange} className="w-full border border-gray-300 rounded p-2">
                  <option value="">Selecione um tamanho</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Cor:</label>
                <select name="color" value={stockData.color} onChange={handleStockChange} className="w-full border border-gray-300 rounded p-2">
                  <option value="">Selecione uma cor</option>
                  {colors.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Quantidade:</label>
                <input type="number" name="quantity" value={stockData.quantity} onChange={handleStockChange} className="w-full border border-gray-300 rounded p-2" />
              </div>
              <div>
                <button type="submit" className="bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition duration-300">Incrementar Estoque</button>
              </div>
            </form>
          )}
        </main>
      )}
    </div>
  );
}
