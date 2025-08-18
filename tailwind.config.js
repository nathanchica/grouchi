/** @type {import('tailwindcss').Config} */
export default {
    content: {
        files: ['./views/**/*.html', './public/**/*.js']
    },
    theme: {
        extend: {
            fontFamily: {
                playfair: ['Playfair Display', 'serif'],
                merriweather: ['Merriweather', 'serif'],
                lora: ['Lora', 'serif']
            }
        }
    },
    plugins: []
};
