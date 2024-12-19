/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // add in our custom font that we've linked to in index.html, by placing in extends it doesn't overwrite all of the other standard options (ie if we set color in the 'theme' object directly we would lose access to all of the predefined colours!)
      fontFamily: {
        // you can make it a named font by providing a name (like pizza_font) or you can override a standard font family such as sans, as we do here
        mono: ['"Roboto Mono", monospace'],
      },
      height: {
        //set screen height to dvh (dynamic viewport height) to be responsive when on a mobile phone
        screen: "100dvh",
      },
    },
  },
  plugins: [],
};
