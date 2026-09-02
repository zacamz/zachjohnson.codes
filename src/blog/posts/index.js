
import CleaningMethod from "./Cleaning Method";
import Experimart from "./Experimart";

const posts = [
    {
    slug: "Cleaning-Method",
    title: "Cleaning Method",
    date: "2026-08-27",
    component: CleaningMethod,
  },
    {
    slug: "Experimart",
    title: "Experimart",
    date: "2026-08-28",
    component: Experimart,
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
