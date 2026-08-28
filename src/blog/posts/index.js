import Hello from "./hello";
import FarmMorning from "./farm-morning";
import BlankSlate from "./blank-slate";

const posts = [
  {
    slug: "hello",
    title: "Hello",
    date: "2026-08-01",
    component: Hello,
  },
  {
    slug: "farm-morning",
    title: "Farm Morning",
    date: "2026-08-15",
    component: FarmMorning,
  },
  {
    slug: "blank-slate",
    title: "Blank Slate",
    date: "2026-08-27",
    component: BlankSlate,
  },
];

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug);
}

export function getPostIndex(slug) {
  return posts.findIndex((post) => post.slug === slug);
}

export function getLatestPost() {
  return posts[posts.length - 1];
}

export function getRandomSlug(currentIndex) {
  if (posts.length <= 1) {
    return posts[0].slug;
  }

  let index = currentIndex;
  while (index === currentIndex) {
    index = Math.floor(Math.random() * posts.length);
  }
  return posts[index].slug;
}

export default posts;
