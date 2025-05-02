/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#2563eb", // blue-600
                secondary: "#22c55e", // green-500
                accent: "#facc15", // yellow-400
                dark: "#1f2937", // gray-800
                light: "#f3f4f6", // gray-100
            },
            fontFamily: {
                sans: ['"Inter"', "sans-serif"],
            },
        },
    },
    plugins: [],
};
