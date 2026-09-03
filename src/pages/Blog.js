import { useParams, useNavigate } from "react-router-dom";
import posts, {
  getLatestPost,
  getPostBySlug,
  getPostIndex,
  getRandomSlug,
} from "../blog/posts";
import BlogLikeButton from "../components/BlogLikeButton";
import "./Blog.css";

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Blog() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const resolvedSlug = slug ?? getLatestPost().slug;
  const post = getPostBySlug(resolvedSlug);
  const currentIndex = getPostIndex(resolvedSlug);

  if (!post) {
    return (
      <div className="Blog text-page">
        <p className="Blog-missing">No post here.</p>
      </div>
    );
  }

  const PostContent = post.component;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < posts.length - 1;

  const goTo = (targetSlug) => {
    navigate(`/Blog/${targetSlug}`);
  };

  return (
    <div className="Blog text-page">
      <nav className="Blog-nav" aria-label="Blog navigation">
        <button
          type="button"
          disabled={!hasPrevious}
          onClick={() => goTo(posts[currentIndex - 1].slug)}
        >
          last
        </button>
        <button
          type="button"
          onClick={() => goTo(getRandomSlug(currentIndex))}
        >
          random
        </button>
        <button
          type="button"
          disabled={!hasNext}
          onClick={() => goTo(posts[currentIndex + 1].slug)}
        >
          next
        </button>
      </nav>

      <header className="Blog-header">
        <h2 className="Blog-title">{post.title}</h2>
        <time className="Blog-date" dateTime={post.date}>
          {formatDate(post.date)}
        </time>
      </header>

      <div className="Blog-content">
        <PostContent />
      </div>

      <footer className="Blog-footer">
        <BlogLikeButton slug={post.slug} />
        <a
          className="Blog-email"
          href={`mailto:zach@zachjohnson.codes?subject=${encodeURIComponent(post.title)}`}
        >
          email me
        </a>
      </footer>
    </div>
  );
}

export default Blog;
