import React from "react";
import Head from "next/head";
import Link from 'next/link';
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });


interface Post {
  createdAt: number;
  id: number;
  title: string;
  text: string;
  description: string;
}

interface HomeProps {
  posts: Post[],
}

export default function Home ({posts = []} : HomeProps) {
  // TODO: return something like, "posts are not available"
  if (!posts) return null;
  return (
    <>
      <Head>
        <title>20 minutes - Blogs</title>
        <meta name="description" content="20 minutes - Blogs. Check the latest blogs." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        {posts.map(post => {
          return (
            <div key={post.id} className={`${styles.post}`}>
              <h1 className={`${styles.postTitle}`}>{post.title}</h1>
              <p className={`${styles.postDescription}`}>{post.description}</p>
              <Link href={`/blog/${post.id}`} className={`${styles.postLink}`}>Read More...</Link>
            </div>
          )
        })}
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const response = await fetch('https://5ebd9842ec34e900161923e7.mockapi.io/post');
  const posts: Post[] = await response.json();
  return {
    props: { posts },
  };
}
