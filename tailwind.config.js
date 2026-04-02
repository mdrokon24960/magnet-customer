/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#6366f1",
                accent: "#22d3ee",
                warning: "#f59e0b",
                danger: "#f43f5e",
            }
        },
    },
    plugins: [],
}
