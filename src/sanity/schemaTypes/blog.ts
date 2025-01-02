import { defineType } from 'sanity';

export default defineType({
  name: 'blog',
  type: 'document',
  title: 'Blog Post',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title', maxLength: 96 } },
    { name: 'body', type: 'array', title: 'Body', of: [{ type: 'block' }] },
    { name: 'mainImage', type: 'image', title: 'Main Image', options: { hotspot: true } },
    { name: 'publishedAt', type: 'datetime', title: 'Published At' },
    {
      name: 'comments',
      title: 'Comments',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'author', type: 'string', title: 'Author'},
            { name: 'email', type: 'string', title: 'Email' },
            { name: 'body', type: 'text', title: 'Comment' },
            { name: 'createdAt', type: 'datetime', title: 'Created At'},
          ],
        },
      ],
    },
  ],
});


