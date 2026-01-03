import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'serviceType',
  title: 'Service Type',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      description: 'Short description of the service',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon (Emoji)',
      type: 'string',
      description: 'An emoji to represent this service (e.g., 🐕‍🦺, 🌳, 🏠, 🎄)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which services appear (lower = first)',
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
      description: 'description',
    },
    prepare({ title, icon, description }) {
      return {
        title: `${icon || '❓'} ${title}`,
        subtitle: description,
      };
    },
  },
});

