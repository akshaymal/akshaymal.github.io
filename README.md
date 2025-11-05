# Akshay Malhotra - Personal Portfolio

A modern, minimalist personal portfolio website showcasing my professional identity with a clean design and custom branding.

## About

This is my personal website hosted on Vercel, featuring a welcoming landing page with my custom AM monogram logo and a warm, inviting color palette.

## Features

- Custom AM monogram logo with transparent background
- Responsive design that works seamlessly on mobile and desktop
- Custom Google Fonts integration (Almarai and Alex Brush)
- Warm color palette featuring teal, cream, gold, burgundy, and maroon
- Optimized static site generation for fast loading
- Type-safe development with TypeScript

## Technologies Used

### Core Framework
- **Next.js 14.2.18** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5.0** - Type-safe JavaScript

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **PostCSS 8.4** - CSS transformations
- **Autoprefixer 10.4** - Automatic vendor prefixing
- **Google Fonts** - Custom typography (Almarai & Alex Brush)

### Development Tools
- **ESLint** - Code linting
- **Next.js Image Optimization** - Automatic image optimization

## Project Structure

```
.
├── app/
│   ├── fonts.ts          # Google Fonts configuration
│   ├── globals.css       # Global styles and Tailwind directives
│   ├── layout.tsx        # Root layout with metadata
│   └── page.tsx          # Home page component
├── public/
│   └── assets/
│       └── logo.png      # AM monogram logo (transparent)
├── tailwind.config.ts    # Tailwind configuration with custom colors
└── next.config.js        # Next.js configuration
```

## Color Palette

- **Teal** (#335C67) - Primary accent
- **Cream** (#FFF3B0) - Background
- **Gold** (#E09F3E) - Highlight
- **Burgundy** (#9E2A2B) - Secondary accent
- **Maroon** (#540B0E) - Deep accent

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/akshaymal/akshaymalhotra.dev.git

# Navigate to the project directory
cd akshaymalhotra.dev

# Install dependencies
npm install
```

### Development

```bash
# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site in your browser.

### Build

```bash
# Create an optimized production build
npm run build

# Start the production server
npm start
```

## Deployment

This site is deployed on Vercel and automatically builds and deploys when changes are pushed to the main branch. Vercel provides:
- Automatic deployments on git push
- Preview deployments for pull requests
- Edge network for fast global delivery
- Built-in CI/CD pipeline

## License

This project is private and proprietary.

---

Built with Next.js, React, and Tailwind CSS
