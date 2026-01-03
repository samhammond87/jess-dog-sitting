import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption for the image',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which images appear (lower = first)',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      media: 'image',
      caption: 'caption',
    },
    prepare({ media, caption }) {
      return {
        title: caption || 'Gallery Image',
        media,
      };
    },
  },
});

