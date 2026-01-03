# Jess Dog Sitting Website

A modern, responsive website for a dog sitting service built with Astro, TypeScript, and Sanity CMS.

## Tech Stack

- **Frontend**: Astro + TypeScript
- **CMS**: Sanity.io
- **Forms**: Netlify Forms (with email notifications)
- **Hosting**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd jess-dog-sitting
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with your Sanity credentials:
   ```
   PUBLIC_SANITY_PROJECT_ID=your-project-id
   PUBLIC_SANITY_DATASET=production
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Sanity CMS Setup

The Sanity Studio is located in the `jess-sits/` directory.

1. Install Sanity dependencies:
   ```bash
   cd jess-sits
   npm install
   ```

2. Start the Sanity Studio locally:
   ```bash
   npm run dev
   ```

3. Deploy the Sanity Studio:
   ```bash
   cd jess-sits
   npx sanity deploy
   ```

## Netlify Deployment

### Automatic Deployment

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Netlify will auto-detect the settings from `netlify.toml`

### Environment Variables

Add these in Netlify dashboard (Site settings > Environment variables):
- `PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
- `PUBLIC_SANITY_DATASET` - Your Sanity dataset (usually "production")

### Email Notifications for Contact Form

1. Go to your Netlify site dashboard
2. Navigate to **Forms** > **Form notifications**
3. Click **Add notification** > **Email notification**
4. Enter the email address where submissions should be sent

## Project Structure

```
jess-dog-sitting/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Section.astro
│   │   ├── Card.astro
│   │   ├── ServiceCard.astro
│   │   ├── TestimonialCard.astro
│   │   ├── CtaSection.astro
│   │   ├── ContactForm.tsx   # React (client-side interactivity)
│   │   └── LoadingImage.tsx  # React (LQIP blur-up images)
│   ├── layouts/
│   │   └── Layout.astro      # Base layout with SEO meta tags
│   ├── pages/                # File-based routing
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── services.astro
│   │   ├── pricing.astro
│   │   ├── testimonials.astro
│   │   ├── contact.astro
│   │   └── 404.astro
│   ├── lib/
│   │   └── sanity.ts         # Sanity client & queries
│   └── styles/
│       ├── global.css
│       └── variables.css
├── jess-sits/                # Sanity Studio
│   └── schemaTypes/          # Sanity schema definitions
├── public/
│   ├── fonts/
│   └── robots.txt
├── astro.config.mjs
├── netlify.toml
└── package.json
```

## Features

- 🏠 **Home**: Hero section, services preview, testimonials
- 👋 **About**: Bio, photo gallery, credentials
- 🐕 **Services**: Detailed service offerings
- 💰 **Pricing**: Service pricing and packages
- ⭐ **Testimonials**: Customer reviews and ratings
- 📧 **Contact**: Form with Netlify Forms integration
- 🔍 **SEO**: Sitemap, Open Graph, JSON-LD structured data

## Customization

### Colors

Edit `src/styles/variables.css` to customize the color scheme:

```css
:root {
  --color-primary: #C4704B;      /* Terracotta */
  --color-secondary: #3D5A4C;    /* Forest green */
  --color-background: #FDF6E3;   /* Cream */
  /* ... more variables */
}
```

### Content

All content is managed through the Sanity Studio:
- Add/edit testimonials
- Update services and pricing
- Change about page content
- Update contact information and social links

## License

Private - All rights reserved
