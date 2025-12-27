# Jess Dog Sitting Website

A modern, responsive website for a dog sitting service built with React, TypeScript, and Sanity CMS.

## Tech Stack

- **Frontend**: React + Vite + TypeScript
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
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Sanity project credentials.

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

3. Update your Sanity project ID in `.env`:
   ```
   VITE_SANITY_PROJECT_ID=your-actual-project-id
   VITE_SANITY_DATASET=production
   ```

4. Deploy the Sanity Studio:
   ```bash
   cd jess-sits
   npx sanity deploy
   ```

## Netlify Deployment

### Automatic Deployment

1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Netlify will auto-detect the settings from `netlify.toml`

### Environment Variables

Add these in Netlify dashboard (Site settings > Build & deploy > Environment):
- `VITE_SANITY_PROJECT_ID` - Your Sanity project ID
- `VITE_SANITY_DATASET` - Your Sanity dataset (usually "production")

### Email Notifications for Contact Form

1. Go to your Netlify site dashboard
2. Navigate to **Forms** > **Form notifications**
3. Click **Add notification** > **Email notification**
4. Enter the email address where submissions should be sent
5. Customize the notification template if desired

## Project Structure

```
jess-dog-sitting/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Header.module.css
│   │   ├── Footer.tsx
│   │   └── Footer.module.css
│   ├── pages/             # Page components
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── Testimonials.tsx
│   │   └── Contact.tsx
│   ├── lib/
│   │   └── sanity.ts      # Sanity client configuration
│   ├── styles/
│   │   └── variables.css  # CSS custom properties
│   ├── App.tsx            # Main app with routing
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── jess-sits/             # Sanity Studio
│   └── schemaTypes/       # Sanity schema definitions
├── public/
├── netlify.toml           # Netlify configuration
└── package.json
```

## Features

- 🏠 **Home**: Hero section, services preview, testimonials
- 👋 **About**: Bio, photo gallery, credentials
- 🐕 **Services**: Detailed service offerings with pricing
- ⭐ **Testimonials**: Customer reviews and ratings
- 📧 **Contact**: Form with Netlify Forms integration

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

Once Sanity is set up, all content can be managed through the Sanity Studio:
- Add/edit testimonials
- Update services and pricing
- Change about page content
- Update contact information

## Google Calendar Integration (Future)

To add Google Calendar integration:

1. Create a Google Cloud project and enable Calendar API
2. Use Calendly or Cal.com embed for easy booking
3. Or implement a custom solution with the Google Calendar API

## License

Private - All rights reserved
