import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'bookingQuestion',
  title: 'Booking Question',
  type: 'document',
  fields: [
    defineField({
      name: 'questionText',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Helper Text',
      type: 'string',
      description: 'Optional description shown below the question',
    }),
    defineField({
      name: 'questionType',
      title: 'Question Type',
      type: 'string',
      options: {
        list: [
          { title: 'Short Text', value: 'text' },
          { title: 'Long Text', value: 'textarea' },
          { title: 'Number', value: 'number' },
          { title: 'Checkbox (Yes/No)', value: 'checkbox' },
          { title: 'Single Choice (Radio)', value: 'radio' },
          { title: 'Multi-Select (Checkboxes)', value: 'checkboxes' },
          { title: 'Dropdown (Select)', value: 'select' },
        ],
        layout: 'radio',
      },
      initialValue: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'options',
      title: 'Answer Options',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add options for radio/checkboxes/select questions',
      hidden: ({ parent }) =>
        !['radio', 'checkboxes', 'select'].includes(parent?.questionType ?? ''),
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      description: 'Must this question be answered?',
      initialValue: false,
    }),
    defineField({
      name: 'group',
      title: 'Section/Group',
      type: 'string',
      description: 'Group related questions together (e.g., "Dog Info", "Medical", "Behavior")',
      options: {
        list: [
          { title: 'Contact Details', value: 'contact' },
          { title: 'Dog Information', value: 'dog-info' },
          { title: 'Medical & Health', value: 'medical' },
          { title: 'Behavior & Personality', value: 'behavior' },
          { title: 'Care Requirements', value: 'care' },
          { title: 'Emergency & Vet', value: 'emergency' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order within the form (lower = first)',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'By Group',
      name: 'groupAsc',
      by: [
        { field: 'group', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'questionText',
      type: 'questionType',
      group: 'group',
      required: 'required',
    },
    prepare({ title, type, group, required }) {
      const typeEmoji: Record<string, string> = {
        text: '📝',
        textarea: '📄',
        number: '🔢',
        checkbox: '☑️',
        radio: '🔘',
        checkboxes: '☑️☑️',
        select: '📋',
      };
      return {
        title: `${required ? '* ' : ''}${title}`,
        subtitle: `${typeEmoji[type] || '❓'} ${type}${group ? ` • ${group}` : ''}`,
      };
    },
  },
});

