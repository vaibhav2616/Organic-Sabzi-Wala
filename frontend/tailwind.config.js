/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#2F5233", // Deep Organic Green
                secondary: "#6B4F1D", // Earth Brown
                accent: "#F9A825", // Turmeric Yellow
                background: "#F9F9F4", // Organic Cream
                'organic-green': '#2F5233',
                'organic-light': '#E8F5E9',
                'organic-cream': '#F9F9F4',
                'organic-text': '#1A1A1A',
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            }
        },
    },
    plugins: [],
}
