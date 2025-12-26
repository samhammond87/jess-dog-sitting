import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'jess-dog-sitting',
  title: 'Jess Dog Sitting CMS',

  // Replace with your actual project ID and dataset
  projectId: 'your-project-id',
  dataset: 'production',

  plugins: [deskTool()],

  schema: {
    types: schemaTypes,
  },
});

