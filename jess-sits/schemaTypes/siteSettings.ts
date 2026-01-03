import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'homepage', title: 'Homepage' },
    { name: 'bookings', title: 'Bookings' },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    // General Settings
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      group: 'general',
      initialValue: 'Jess Dog Sitting',
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'general',
      description: 'A short catchy phrase for your business',
      initialValue: "Your pup's home away from home",
    }),

    // Homepage Settings
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      group: 'homepage',
      description: 'Full-page background image for the homepage hero',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'heroBlurb',
      title: 'Hero Blurb',
      type: 'text',
      group: 'homepage',
      rows: 3,
      description: 'Text overlay on the homepage hero image',
    }),

    // Bookings Settings
    defineField({
      name: 'bookingProcess',
      title: 'How to Book',
      type: 'array',
      group: 'bookings',
      of: [
        {
          type: 'object',
          name: 'step',
          fields: [
            defineField({
              name: 'title',
              title: 'Step Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        },
      ],
      description: 'Steps explaining how to book (shown on Bookings page)',
    }),

    // Footer Settings
    defineField({
      name: 'acknowledgementOfCountry',
      title: 'Acknowledgement of Country',
      type: 'text',
      group: 'footer',
      rows: 3,
      description: 'Acknowledgement of Traditional Owners',
    }),
    defineField({
      name: 'abn',
      title: 'ABN',
      type: 'string',
      group: 'footer',
      description: 'Australian Business Number',
    }),
  ],
  preview: {
    select: {
      title: 'siteName',
    },
    prepare({ title }) {
      return {
        title: title || 'Site Settings',
        subtitle: 'Configure your site settings',
      };
    },
  },
});
