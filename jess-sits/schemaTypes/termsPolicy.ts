import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'termsPolicy',
  title: 'Terms & Policies',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g., "Cancellation Policy", "Booking Policy"',
    }),
    defineField({
      name: 'icon',
      title: 'Icon Emoji',
      type: 'string',
      description: 'An emoji for this section (e.g., ❌, 📅, 🐕)',
      initialValue: '📋',
    }),
    defineField({
      name: 'items',
      title: 'Policy Items',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Each bullet point in this policy section',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which sections appear (lower = first)',
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
      title: 'title',
      icon: 'icon',
    },
    prepare({ title, icon }) {
      return {
        title: `${icon || '📋'} ${title}`,
      };
    },
  },
});

