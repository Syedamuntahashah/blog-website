
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/sanity/lib/sanity";
import { urlFor } from "@/sanity/lib/image";

interface Comment {
  _id: string;
  author: string;
  email: string;
  body: string;
  createdAt: string;
}

interface Blog {
  title: string;
  slug: { current: string };
  mainImage: { asset: { url: string } };
  publishedAt: string;
  comments: Comment[];
}

const query = `*[_type == "blog"]{title, slug, mainImage, publishedAt}`;
export default async function HomePage() {
  const blogs: Blog[] = await sanityClient.fetch(query);

  return (
    <div className=" bg-gray-500">
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="flex text-4xl font-bold text-center text-white mb-8">Syeda Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.slug.current}
            className="rounded-lg shadow-md p-4 bg-white"
          >
            <Image
              src={urlFor(blog.mainImage).url()}
              alt={blog.title}
              width={500}
              height={300}
              className="rounded-md w-full h-48 object-cover"
            />
            <h2 className="text-2xl font-semibold mt-4">{blog.title}</h2>
            <p className="text-gray-500 text-sm">
              {new Date(blog.publishedAt).toDateString()}
            </p>
            <Link
              href={`/${blog.slug.current}`}
              className="text-blue-500 hover:underline mt-2 block"
            >
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
    </div> 
  );
}
