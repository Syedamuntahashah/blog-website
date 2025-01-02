"use client";

import { useEffect, useState, use } from "react";
import { sanityClient } from "@/sanity/lib/sanity";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { PortableText } from "@portabletext/react";

interface Comment {
  _id: string;
  author: string;
  email: string;
  body: string;
  createdAt: string;
}

interface Blog {
  _id: string;
  title: string;
  slug: { current: string };
  body: any;
  mainImage: { asset: { url: string } };
  publishedAt: string;
  comments: Comment[];
}

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `*[_type == "blog" && slug.current == $slug][0]{
          _id,
          title,
          slug,
          body,
          mainImage,
          publishedAt,
          "comments": *[_type == "comment" && references(^._id)]{
            _id,
            author,
            email,
            body,
            createdAt
          }
        }`;

        const fetchedBlog = await sanityClient.fetch(query, { slug });
        setBlog(fetchedBlog);
        setComments(fetchedBlog?.comments || []);
        setLoading(false);
      } catch (error) {
        setError("Failed to load the blog. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      const newComment = {
        _type: "comment",
        author: "Anonymous User",
        email: "anonymous@example.com",
        body: comment,
        blog: { _type: "reference", _ref: blog?._id },
        createdAt: new Date().toISOString(),
      };

      const createdComment = await sanityClient.create(newComment);
      setComments([
        ...comments,
        {
          _id: createdComment._id,
          author: createdComment.author,
          email: createdComment.email,
          body: createdComment.body,
          createdAt: createdComment.createdAt,
        },
      ]);

      setComment("");
    } catch (err) {
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await sanityClient.delete(commentId);
      const updatedComments = comments.filter((c) => c._id !== commentId);
      setComments(updatedComments);
    } catch (err) {
      alert("Failed to delete comment. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-3xl font-bold text-red-500">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-3xl font-bold">Blog Not Found</h1>
        <p className="text-gray-500">The blog you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Image
        src={urlFor(blog.mainImage).url()}
        alt={blog.title}
        className="rounded-lg w-full h-64 object-cover"
        width={800}
        height={400}
      />
      <h1 className="text-4xl font-bold mt-6">{blog.title}</h1>
      <p className="text-gray-500 text-sm mt-2">
        Published on {new Date(blog.publishedAt).toDateString()}
      </p>
      <div className="mt-6 prose">
        <PortableText value={blog.body} />
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold">Comments</h3>
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="mt-4 border-b pb-4">
              <p>
                <strong>{comment.author}</strong> ({comment.email})
              </p>
              <p>{comment.body}</p>
              <p className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
              <button
                className="text-red-500 text-sm mt-1"
                onClick={() => handleDeleteComment(comment._id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
        <div className="mt-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border rounded-lg p-2"
          />
          <button
            onClick={handleAddComment}
            className="bg-slate-500 text-white px-4 py-2 mt-2 rounded-lg"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
}
