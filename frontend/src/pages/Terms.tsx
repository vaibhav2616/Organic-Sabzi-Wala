const Terms = () => {
    return (
        <div className="min-h-screen bg-organic-cream dark:bg-gray-900 pt-20 pb-24 px-4 transition-colors">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
                <h1 className="text-3xl font-serif font-bold text-organic-text dark:text-gray-100 mb-6">Terms & Conditions</h1>

                <div className="space-y-6 text-stone-600 dark:text-gray-300 text-sm leading-relaxed">
                    <p>
                        Welcome to Organic Sabzi Wala. By accessing our website and placing an order, you agree to be bound by the following terms and conditions.
                    </p>

                    <section>
                        <h2 className="text-lg font-bold text-organic-text dark:text-white mb-2">1. General Info</h2>
                        <p>
                            These terms apply to all products ordered from Organic Sabzi Wala. We reserve the right to change these terms at any time without prior notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-organic-text dark:text-white mb-2">2. Pricing & Availability</h2>
                        <p>
                            All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes. Prices and availability of products are subject to change without notice. In case of a pricing error, we reserve the right to cancel the order.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-organic-text dark:text-white mb-2">3. Delivery</h2>
                        <p>
                            We strive to deliver fresh produce within 24 hours of harvest. Delivery times are estimates and may vary due to traffic, weather, or other unforeseen circumstances.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-organic-text dark:text-white mb-2">4. Quality Guarantee</h2>
                        <p>
                            If you are not satisfied with the quality of any product, please report it within 24 hours of delivery for a replacement or refund.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
