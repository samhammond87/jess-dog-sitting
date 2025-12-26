import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';


export const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: '2024-01-01',
});

// Use the client-based image builder (more reliable)
const builder = imageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}

// Types for Sanity content
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface Testimonial {
  _id: string;
  name: string;
  dogName: string;
  quote: string;
  image?: SanityImage;
  rating?: number;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  price?: string;
  image?: SanityImage;
  features?: string[];
  icon?: string;
  order?: number;
}

export interface AboutContent {
  _id: string;
  bio: string;
  extendedBio?: unknown[];
  profileImage?: SanityImage;
  images?: SanityImage[];
  highlights?: string[];
}

export interface SiteSettings {
  _id: string;
  siteName?: string;
  email: string;
  phone?: string;
  location?: string;
  tagline?: string;
  heroImage?: SanityImage;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
  };
}

export interface TermsPolicy {
  _id: string;
  title: string;
  icon?: string;
  items?: string[];
  order?: number;
}

// Query functions
export async function getTestimonials(): Promise<Testimonial[]> {
  return client.fetch('*[_type == "testimonial"] | order(_createdAt desc)');
}

export async function getServices(): Promise<Service[]> {
  return client.fetch('*[_type == "service"] | order(order asc)');
}

export async function getAboutContent(): Promise<AboutContent | null> {
  return client.fetch('*[_type == "aboutContent"][0]');
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch('*[_type == "siteSettings"][0]');
}

export async function getTermsPolicies(): Promise<TermsPolicy[]> {
  return client.fetch('*[_type == "termsPolicy"] | order(order asc)');
}
