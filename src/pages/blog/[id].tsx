import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useParams } from 'next/navigation';
import { Inter } from "next/font/google";
import styles from "@/styles/Blog.module.css";

const inter = Inter({ subsets: ["latin"] });


interface Post {
  createdAt: number;
  id: number;
  title: string;
  text: string;
  description: string;
}

interface Comment {
  id: number,
  postId: number,
  name: string,
  text: string,
  createdAt: number,
}

interface BlogProps {
  post: Post,
}

export default function Blog ({post} : BlogProps) {
  const params = useParams<{ id: string }>();
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (params.id) {
      fetch(`https://5ebd9842ec34e900161923e7.mockapi.io/post/${params.id}/comments`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then((comments: Comment[]) => setComments(comments || []))
        .catch(err => console.error(err));
    }
  }, [params.id]);

  const handleOnAddComment = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const commentText = formData.get('text');
    const commentName = formData.get('name');
    console.log(commentName, commentText);
    // TODO: add a comment, clear input values, etc.
  }

  // TODO: return something like, "post is not available"
  if (!post) return null;

  const createdAt = post.createdAt
    ? new Date(post.createdAt*1000).toLocaleDateString('de-CH', {year: "numeric", month: "numeric", day: "numeric"})
    : null;
  return (
    <>
      <Head>
        <title>20 Minutes - Blog</title>
        <meta name="description" content="20 Minutes - Blog." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
       <div key={post.id} className={`${styles.post}`}>
          <h1 className={`${styles.postTitle}`}>{post.title}</h1>
          {!!createdAt && (
            <p className={`${styles.postDate}`}>{createdAt}</p>
          )}
          <p className={`${styles.postText}`}>{post.text}</p>
          <h3>Comments ({comments.length})</h3>
          {!!comments?.length && comments.map(comment => {
            return (
              <div key={comment.id} className={`${styles.comment}`}>
                <p>{comment.name || 'Unknown'}</p>
                <p>{comment.text}</p>
              </div>
            )
          })}
          <form onSubmit={handleOnAddComment} className={`${styles.commentForm}`}>
            <h3>Add a comment</h3>
            <label htmlFor="commentName" className={`${styles.commentLabel}`}>Name</label>
            <input type="text" id="commentName" name="name" defaultValue="" className={`${styles.inputField}`}></input>
            <label htmlFor="commentText" className={`${styles.commentLabel}`}>Text*</label>
            <textarea id="commentText" name="text" defaultValue="" required className={`${styles.textField}`}></textarea>
            <button type="submit" className={`${styles.button}`}>Submit</button>
          </form>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const response = await fetch(`https://5ebd9842ec34e900161923e7.mockapi.io/post/${context?.params?.id || ''}`);
  const post: Post = await response.json();
  return {
    props: { post },
  };
}
