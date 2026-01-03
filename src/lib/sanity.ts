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

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface BookingStep {
  _key: string;
  title: string;
  description?: string;
}

export interface SiteSettings {
  _id: string;
  siteName?: string;
  email: string;
  phone?: string;
  tagline?: string;
  heroImage?: SanityImageSource;
  heroImageLqip?: string;
  heroBlurb?: string;
  bookingProcess?: BookingStep[];
  acknowledgementOfCountry?: string;
  abn?: string;
}

export interface TermsPolicy {
  _id: string;
  title: string;
  icon?: string;
  items?: string[];
  order?: number;
}

export interface GalleryImage {
  _id: string;
  image: SanityImageSource;
  imageLqip?: string;
  caption?: string;
  order?: number;
}

export interface BookingQuestion {
  _id: string;
  questionText: string;
  description?: string;
  questionType: 'text' | 'textarea' | 'number' | 'checkbox' | 'radio' | 'checkboxes' | 'select';
  options?: string[];
  required: boolean;
  group?: 'contact' | 'dog-info' | 'medical' | 'behavior' | 'care' | 'emergency' | 'other';
  order: number;
}

export interface ServiceType {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order?: number;
}

// ============================================
// FETCH FUNCTIONS
// ============================================

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

export async function getGalleryImages(): Promise<GalleryImage[]> {
  return client.fetch(`
    *[_type == "galleryImage"] | order(order asc) {
      _id,
      image,
      "imageLqip": image.asset->metadata.lqip,
      caption,
      order
    }
  `);
}

export async function getBookingQuestions(): Promise<BookingQuestion[]> {
  return client.fetch('*[_type == "bookingQuestion"] | order(order asc)');
}

export async function getServiceTypes(): Promise<ServiceType[]> {
  return client.fetch('*[_type == "serviceType"] | order(order asc)');
}
