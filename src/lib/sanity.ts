import { createClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

if (!projectId) {
  throw new Error('PUBLIC_SANITY_PROJECT_ID environment variable is required');
}

export const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: '2024-01-01',
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function hasValidAsset(image: unknown): image is SanityImageSource {
  return typeof image === 'object' && image !== null && 'asset' in image;
}

export type { SanityImageSource };

export interface Testimonial {
  _id: string;
  name: string;
  dogName: string;
  quote: string;
  image?: SanityImageSource;
  rating?: number;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  price?: string;
  image?: SanityImageSource;
  features?: string[];
  icon?: string;
  order?: number;
}

export interface AboutContent {
  _id: string;
  bio: string;
  extendedBio?: Array<{
    _key: string;
    _type: string;
    children?: Array<{ _key: string; _type: string; text: string }>;
  }>;
  profileImage?: SanityImageSource;
  profileImageLqip?: string;
  images?: SanityImageSource[];
  imagesLqip?: string[];
  highlights?: string[];
}

export interface SiteSettings {
  _id: string;
  siteName?: string;
  email: string;
  phone?: string;
  location?: string;
  tagline?: string;
  heroImage?: SanityImageSource;
  heroImageLqip?: string;
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

export async function getTestimonials(): Promise<Testimonial[]> {
  return client.fetch('*[_type == "testimonial"] | order(_createdAt desc)');
}

export async function getServices(): Promise<Service[]> {
  return client.fetch('*[_type == "service"] | order(order asc)');
}

export async function getAboutContent(): Promise<AboutContent | null> {
  return client.fetch(`
    *[_type == "aboutContent"][0]{
      ...,
      "profileImageLqip": profileImage.asset->metadata.lqip,
      "imagesLqip": images[].asset->metadata.lqip
    }
  `);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(`
    *[_type == "siteSettings"][0]{
      ...,
      "heroImageLqip": heroImage.asset->metadata.lqip
    }
  `);
}

export async function getTermsPolicies(): Promise<TermsPolicy[]> {
  return client.fetch('*[_type == "termsPolicy"] | order(order asc)');
}

