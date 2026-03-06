# Gokul's Digital Canvas

A minimal, fast, and slightly over-engineered **digital portfolio**
built with **React**, **TypeScript**, and **Vite**.\
It's designed as a clean and expressive space to showcase my work,
ideas, and inspirations through a carefully crafted UI.

The goal of this project is simple:\
**present engineering, design, and personality in one cohesive digital
canvas.**

------------------------------------------------------------------------

## Features

✨ **Light / Dark Theme Toggle**\
Smooth theme switching powered by React Context.

⚡ **Fast & Responsive**\
Built with **Vite** for extremely fast development and optimized builds.

🎨 **Modern UI with Tailwind CSS**\
Utility-first styling for a clean, minimal interface.

📱 **Fully Responsive**\
Optimized for desktop, tablet, and mobile experiences.

🏢 **Structured Work Experience**\
Timeline view grouped by company for better readability.

🛠️ **Type-Safe Codebase**\
Built entirely with **TypeScript** for maintainability and reliability.

------------------------------------------------------------------------

## Tech Stack

**Frontend**

-   React 19
-   TypeScript
-   Vite

**Styling**

-   Tailwind CSS 4

**Libraries**

-   Framer Motion
-   @radix-ui/react-icons

**Tooling**

-   ESLint
-   GitHub Actions
-   GitHub Pages

------------------------------------------------------------------------

## Project Structure

    src/
    ├── components/        # Reusable React UI components
    ├── context/           # Theme context provider
    ├── data/              # Structured portfolio data
    ├── hooks/             # Custom hooks (useTheme)
    ├── utils/             # Utility functions
    ├── assets/            # Images and static resources
    ├── App.tsx            # Root application component
    ├── main.tsx           # Entry point
    └── index.css          # Global styles (Tailwind)

------------------------------------------------------------------------

## Development

### Install dependencies

``` bash
npm install
```

### Start development server

``` bash
npm run dev
```

Open:

    http://localhost:5173

### Build for production

``` bash
npm run build
```

### Preview production build

``` bash
npm run preview
```

### Lint project

``` bash
npm run lint
```

------------------------------------------------------------------------

## Deployment

This project deploys automatically to **GitHub Pages** using **GitHub
Actions**.

### Deployment Workflow

The CI pipeline performs:

1.  Install dependencies
2.  Build the project
3.  Deploy the `dist/` output to GitHub Pages

### Enable GitHub Pages

1.  Navigate to **Repository Settings → Pages**
2.  Select **GitHub Actions** as the deployment source.

------------------------------------------------------------------------

## Live Portfolio

    https://<your-username>.github.io/digital-canvas/

Replace `<your-username>` with your GitHub username.

------------------------------------------------------------------------

## Customization

If you want to fork or adapt this project:

**Update portfolio content**

    src/data/index.ts

**Modify UI components**

    src/components/

**Theme customization**

    src/context/ThemeContext.tsx
    src/utils/styleFactory.ts

------------------------------------------------------------------------

## Performance

-   Vite enables **instant HMR** during development
-   Tailwind automatically **purges unused CSS**
-   Optimized build output for **fast loading**

------------------------------------------------------------------------

## Browser Support

Compatible with all modern browsers supporting **ES2020**.

------------------------------------------------------------------------

## Author

**Gokul**\
Software Engineer

GitHub: https://github.com/gokul-369
