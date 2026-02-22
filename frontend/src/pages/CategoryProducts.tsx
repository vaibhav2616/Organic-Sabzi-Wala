
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { ChevronLeft } from 'lucide-react';


import { ProductCard } from '../components/common/ProductCard';

const CategoryProducts = () => {
    const { slug } = useParams();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');

    useEffect(() => {
        setLoading(true);
        // Map slug to Title nicely
        setTitle(slug?.replace(/-/g, ' ').toUpperCase() || 'PRODUCTS');

        client.get(`products/?category=${slug}`)
            .then(res => {
                setProducts(res.data.data || res.data); // Handle StandardResponse or standard
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load category products", err);
                setLoading(false);
            });
    }, [slug]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white p-3 shadow-sm sticky top-0 z-10 flex items-center gap-3">
                <button onClick={() => navigate(-1)}>
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="font-bold text-lg text-gray-800 capitalize">{title.toLowerCase()}</h1>
            </div>

            {loading ? (
                <div className="p-10 text-center text-stone-400">Loading...</div>
            ) : (
                <div className="p-4">
                    {products.length === 0 && <div className="p-10 text-center text-stone-500">No products found in this category.</div>}

                    <div className="grid grid-cols-2 gap-4">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryProducts;
