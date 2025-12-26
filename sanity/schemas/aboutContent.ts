import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'aboutContent',
  title: 'About Content',
  type: 'document',
  fields: [
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'extendedBio',
      title: 'Extended Biography',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text content for the about page',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key highlights about you (e.g., "10+ years experience", "Pet First Aid Certified")',
    }),
  ],
  preview: {
    select: {
      media: 'profileImage',
    },
    prepare({ media }) {
      return {
        title: 'About Content',
        subtitle: 'Edit your about page content',
        media,
      };
    },
  },
});

