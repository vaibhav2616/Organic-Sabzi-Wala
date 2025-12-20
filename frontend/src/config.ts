// Configuration for External APIs
export const config = {
    // WooCommerce / VasyERP API Keys
    // Replace with your actual keys
    consumerKey: import.meta.env.VITE_WC_CONSUMER_KEY || 'ck_placeholder_12345',
    consumerSecret: import.meta.env.VITE_WC_CONSUMER_SECRET || 'cs_placeholder_67890',

    // API URL
    apiUrl: import.meta.env.VITE_API_URL || 'https://api.organicsabziwala.com',
};
