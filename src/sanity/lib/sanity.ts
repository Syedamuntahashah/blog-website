import { createClient } from 'next-sanity';

export const sanityClient = createClient({
  projectId: 'dulpnnoa', // Replace with your Sanity project ID
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
});
