/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.8rem', { lineHeight: '1.2', letterSpacing: '0.03em', fontWeight: '400' }],
                sm: ['1rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '400' }],
                base: ['1.1rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
                lg: ['1.3rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '500' }],
                xl: ['1.6rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '600' }],
                '2xl': ['2rem', { lineHeight: '1.3', letterSpacing: '0em', fontWeight: '700' }],
                '3xl': ['2.5rem', { lineHeight: '1.2', letterSpacing: '0em', fontWeight: '700' }],
                '4xl': ['3rem', { lineHeight: '1.2', letterSpacing: '0em', fontWeight: '700' }],
                '5xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '0em', fontWeight: '700' }],
                '6xl': ['4rem', { lineHeight: '1.1', letterSpacing: '0em', fontWeight: '700' }],
                '7xl': ['4.5rem', { lineHeight: '1.0', letterSpacing: '0em', fontWeight: '700' }],
                '8xl': ['5rem', { lineHeight: '1.0', letterSpacing: '0em', fontWeight: '700' }],
                '9xl': ['5.5rem', { lineHeight: '1.0', letterSpacing: '0em', fontWeight: '700' }],
            },
            fontFamily: {
                heading: "cormorantgaramond",
                paragraph: "sora"
            },
            colors: {
                destructive: '#E53935',
                'destructive-foreground': '#FFFFFF',
                'accent-gold': '#B8A07A',
                'accent-gold-foreground': '#FFFFFF',
                'muted-grey': '#A9A9A9',
                'muted-grey-foreground': '#FFFFFF',
                background: '#F8F8F8',
                secondary: '#4A4A4A',
                foreground: '#333333',
                'secondary-foreground': '#FFFFFF',
                'primary-foreground': '#FFFFFF',
                primary: '#B8A07A'
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
