/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.02em', fontWeight: '400' }],
                sm: ['0.875rem', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '400' }],
                base: ['1rem', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '400' }],
                lg: ['1.125rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
                xl: ['1.25rem', { lineHeight: '1.35', letterSpacing: '0.02em', fontWeight: '500' }],
                '2xl': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0.01em', fontWeight: '600' }],
                '3xl': ['1.875rem', { lineHeight: '1.25', letterSpacing: '0.01em', fontWeight: '600' }],
                '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '0.005em', fontWeight: '700' }],
                '5xl': ['3rem', { lineHeight: '1.15', letterSpacing: '0.005em', fontWeight: '700' }],
                '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '0.002em', fontWeight: '700' }],
                '7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '0.001em', fontWeight: '700' }],
                '8xl': ['6rem', { lineHeight: '1', letterSpacing: '0', fontWeight: '700' }],
                '9xl': ['8rem', { lineHeight: '1', letterSpacing: '0', fontWeight: '700' }],
            },
            fontFamily: {
                heading: "helvetica-w01-roman",
                paragraph: "helvetica-w01-roman"
            },
            colors: {
                destructive: '#DC3545',
                'destructive-foreground': '#FFFFFF',
                'status-available': '#28A745',
                'status-on-trip': '#17A2B8',
                'status-in-shop': '#FFC107',
                'status-suspended': '#6C757D',
                'section-background': '#F8F9FA',
                'accent-link': '#007AFF',
                'accent-link-foreground': '#FFFFFF',
                background: '#FFFFFF',
                secondary: '#6C757D',
                foreground: '#212529',
                'secondary-foreground': '#FFFFFF',
                'primary-foreground': '#FFFFFF',
                primary: '#007AFF'
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
