# Gokul’s Digital Canvas

A minimal, fast, and slightly over‑engineered digital resume built with **React**, **TypeScript**, and **Vite**, wrapped in a minimal, theme‑toggled UI.

## Features

✨ **Light/Dark Theme Toggle** – Seamless theme switching with React Context  
⚡ **Fast & Responsive** – Built with Vite for lightning-fast dev experience  
🎨 **Tailwind CSS** – Modern, utility-first styling  
📱 **Mobile-Friendly** – Responsive design that looks great on all devices  
🏢 **Organized Work Experience** – Timeline view grouped by company  
🛠️ **Type-Safe** – Full TypeScript support for reliable code

## Stack

- **React 19** + **TypeScript** – Modern React with type safety
- **Vite 7** – Lightning-fast build tool and dev server
- **Tailwind CSS 4** – Utility-first CSS framework
- **@radix-ui/react-icons** – Icon library
- **ESLint** – Code linting and quality checks
- **GitHub Actions** – Automated CI/CD and deploys to GitHub Pages

## Project Structure

```
src/
├── components/        # React components (Bio, WorkExperience, etc.)
├── context/          # Theme context provider
├── data/             # Structured resume data
├── hooks/            # Custom hooks (useTheme)
├── utils/            # Utilities (groupByCompany, styleFactory)
├── assets/           # Images and icons
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles with Tailwind

```

## Development

### Install dependencies:

```bash
npm install
```

### Start dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production:

```bash
npm run build
```

### Preview production build:

```bash
npm run preview
```

### Lint:

```bash
npm run lint
```

## Deployment

This project is deployed automatically via **GitHub Actions** to **GitHub Pages**.

### Deployment Setup

1. Ensure your repository has GitHub Pages enabled:
   - Go to **Settings** → **Pages**
   - Set source to `gh-pages` branch (or configure via Actions)

2. The workflow (if set up) will:
   - Build the project on `npm run build`
   - Deploy the `dist/` folder to GitHub Pages

### Manual Deployment

To deploy manually:

```bash
npm run build
npm run deploy  # (if configured in package.json)
```

Or use GitHub CLI:

```bash
gh pages deploy dist
```

### Live URL

Your resume will be available at:

```
https://<your-username>.github.io/digital-resume/
```

(Update with your actual repository name if different)

## Customization

- **Resume Data**: Edit `src/data/index.ts` to update work experience, skills, and contact info
- **Colors & Theme**: Modify `src/tailwind.config.js` for custom color tokens
- **Components**: All components are in `src/components/` – modify as needed
- **Hooks**: Theme logic lives in `src/context/ThemeContext.tsx` and `src/hooks/useTheme.ts`

## Performance

- Built with Vite for instant HMR (Hot Module Replacement)
- Tailwind CSS purges unused styles
- Optimized for fast load times and smooth interactions

## Browser Support

Works on all modern browsers that support ES2020.
