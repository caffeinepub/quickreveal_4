/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        void: '#050507',
        d1: '#09090D',
        d2: '#0D0D13',
        d3: '#121219',
        d4: '#17171F',
        d5: '#1C1C26',
        'nexus-gold': '#F2D06B',
        'nexus-gold-w': '#ECC97A',
        'nexus-gold-soft': '#E8C49A',
        'nexus-blue': '#5B7FFF',
        'nexus-flash': '#00E07A',
        'nexus-alert': '#FF3D5A',
        t1: '#F4F4F8',
        t2: '#9898B4',
        t3: '#54546C',
        t4: '#2E2E3E',
        background: '#050507',
        foreground: '#F4F4F8',
        card: {
          DEFAULT: '#0D0D13',
          foreground: '#F4F4F8',
        },
        border: '#1C1C26',
        primary: {
          DEFAULT: '#F2D06B',
          foreground: '#050507',
        },
        secondary: {
          DEFAULT: '#121219',
          foreground: '#F4F4F8',
        },
        muted: {
          DEFAULT: '#121219',
          foreground: '#54546C',
        },
        accent: {
          DEFAULT: '#F2D06B',
          foreground: '#050507',
        },
        destructive: {
          DEFAULT: '#FF3D5A',
          foreground: '#F4F4F8',
        },
        ring: '#F2D06B',
        input: '#17171F',
        popover: {
          DEFAULT: '#0D0D13',
          foreground: '#F4F4F8',
        },
      },
      borderRadius: {
        // shadcn-required tokens — must stay as CSS variable references
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // NEXUS-specific tokens with unique names that don't conflict
        'nexus-sm':   '10px',
        'nexus-md':   '16px',
        'nexus-lg':   '22px',
        'nexus-xl':   '28px',
        'nexus-2xl':  '36px',
        pill:         '9999px',
        card:         '28px',
        service:      '22px',
      },
      boxShadow: {
        'nexus-gold':    '0 0 0 1px rgba(242,208,107,0.25), 0 8px 32px rgba(242,208,107,0.12), 0 24px 64px rgba(0,0,0,0.5)',
        'nexus-gold-sm': '0 4px 16px rgba(242,208,107,0.2), 0 0 0 1px rgba(242,208,107,0.15)',
        'nexus-flash':   '0 0 0 1px rgba(0,224,122,0.25), 0 8px 24px rgba(0,224,122,0.12)',
        'nexus-card':    '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.04)',
        'nexus-card-lg': '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'rise-in':        'riseIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'drop-in':        'dropIn 0.3s ease forwards',
        'reveal-blur':    'revealBlur 0.5s ease forwards',
        'expand-in':      'expandIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'breathe-gold':   'breatheGold 3s ease infinite',
        'breathe-flash':  'breatheFlash 1.5s ease infinite',
        'shimmer-flow':   'shimmerFlow 1.5s ease infinite',
        'float-gentle':   'floatGentle 4s ease infinite',
        'success-pop':    'successPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'gradient-drift': 'gradientDrift 5s ease infinite',
        'orbe-float':     'orbeFloat 12s ease infinite',
        'count-beat':     'countBeat 2s ease infinite',
        'grow-bar':       'growBar 0.6s ease forwards',
        'draw-check':     'drawCheck 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        confetti:         'confetti 1s ease forwards',
        'slide-up':       'slideUp 0.3s ease forwards',
        'scale-in':       'scaleIn 0.3s ease forwards',
        'progress-bar':   'progressBar 2.5s ease forwards',
      },
      keyframes: {
        riseIn: {
          '0%':   { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
          '60%':  { opacity: '1', transform: 'translateY(-2px) scale(1.005)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        dropIn: {
          '0%':   { opacity: '0', transform: 'translateY(-12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        revealBlur: {
          '0%':   { opacity: '0', filter: 'blur(12px)', transform: 'scale(0.96)' },
          '100%': { opacity: '1', filter: 'blur(0)', transform: 'scale(1)' },
        },
        expandIn: {
          '0%':   { opacity: '0', transform: 'scale(0.88)' },
          '70%':  { opacity: '1', transform: 'scale(1.03)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        breatheGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(242,208,107,0), 0 0 20px rgba(242,208,107,0.15)' },
          '50%':       { boxShadow: '0 0 0 8px rgba(242,208,107,0), 0 0 40px rgba(242,208,107,0.30)' },
        },
        breatheFlash: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,224,122,0), 0 0 16px rgba(0,224,122,0.20)' },
          '50%':       { boxShadow: '0 0 0 6px rgba(0,224,122,0), 0 0 32px rgba(0,224,122,0.40)' },
        },
        shimmerFlow: {
          '0%':   { backgroundPosition: '-400% 0' },
          '100%': { backgroundPosition: '400% 0' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-6px)' },
        },
        orbeFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':       { transform: 'translate(20px, -15px) scale(1.05)' },
          '66%':       { transform: 'translate(-10px, 10px) scale(0.97)' },
        },
        successPop: {
          '0%':   { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '50%':  { transform: 'scale(1.15) rotate(3deg)', opacity: '1' },
          '75%':  { transform: 'scale(0.95) rotate(-1deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        goldRain: {
          '0%':   { transform: 'translateY(0) rotate(var(--r, 0deg)) scaleX(1)', opacity: '1' },
          '100%': { transform: 'translateY(-350px) rotate(calc(var(--r, 0deg) + 540deg)) scaleX(-1)', opacity: '0' },
        },
        gradientDrift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':       { backgroundPosition: '100% 50%' },
        },
        countBeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':       { transform: 'scale(1.04)' },
        },
        growBar: {
          from: { height: '0' },
          to:   { height: 'var(--bar-height)' },
        },
        drawCheck: {
          to: { strokeDashoffset: '0' },
        },
        confetti: {
          '0%':   { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-200px) rotate(720deg)', opacity: '0' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to:   { transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { transform: 'scale(0.8)', opacity: '0' },
          to:   { transform: 'scale(1)', opacity: '1' },
        },
        progressBar: {
          from: { width: '0%' },
          to:   { width: '100%' },
        },
      },
      maxWidth: {
        app: '430px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
