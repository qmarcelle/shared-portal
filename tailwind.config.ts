import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      height: {
        '18': '4.5rem',
      },
      rotate: {
        '270': '270deg',
      },
      inset: {
        '72px': '72px',
      },
      width: {
        '18': '4.5rem',
      },
      colors: {
        primary: '#005EB9',
        'primary-focus': '#00497E',
        'primary-content': '#ffffff',
        secondary: '#5DC1FD',
        'secondary-focus': '#E7F6FF',
        'secondary-content': '#ffffff',
        neutral: '#333333',
        'base-100': '#FFFFFF',
        'base-200': '#F2F2F2',
        info: '#067DAC',
        success: '#508316',
        'success-content': '#ffffff',
        warning: '#FFA500',
        'warning-content': '#ffffff',
        error: '#EB001B',
        'error-content': '#ffffff',
      },
      fontFamily: {
        base: ['Univers-45', 'sans-serif'],
        'app-bold': ['Univers-65', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        default: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        full: '9999px',
        large: '12px',
      },
      boxShadow: {
        soft: '0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08)',
        hard: '0 4px 6px rgba(0,0,0,.3), 0 2px 4px rgba(0,0,0,.06)',
        inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
      },
    },
  },
  //plugins: [require('flowbite/plugin')],
};
export default config;
