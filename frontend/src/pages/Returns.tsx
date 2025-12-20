const Returns = () => {
    return (
        <div className="min-h-screen bg-organic-cream dark:bg-gray-900 pt-20 pb-24 px-4 transition-colors">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
                <h1 className="text-3xl font-serif font-bold text-organic-text dark:text-gray-100 mb-6">Return & Refund Policy</h1>

                <div className="space-y-6 text-stone-600 dark:text-gray-300 text-sm leading-relaxed">
                    <p>
                        At Organic Sabzi Wala, we take pride in the freshness and quality of our produce. However, if you are not satisfied with your purchase, we are here to help.
                    </p>

                    <section>
                        <h2 className="text-lg font-bold text-organic-text dark:text-white mb-2">1. Eligibility for Returns</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Perishable items (vegetables, fruits, dairy) must be reported within 24 hours of delivery.</li>
                            <li>Non-perishable items must be returned within 3 days of delivery.</li>
                            <li>Items must be unused and in their original packaging (if applicable).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-organic-text dark:text-white mb-2">2. Refund Process</h2>
                        <p>
                            Once your return request is approved, we will initiate a refund to your original payment method or wallet within 5-7 business days.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-organic-text dark:text-white mb-2">3. Damaged or Missing Items</h2>
                        <p>
                            If you receive a damaged item or if an item is missing from your order, please contact our support team immediately with photos of the damaged product.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-organic-text dark:text-white mb-2">4. Contact Us</h2>
                        <p>
                            For any return-related queries, please email us at support@organicsabziwala.com or call us at +91 98765 43210.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Returns;
