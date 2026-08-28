function ProjectPreview({ title, url, description, tags = [] }) {
  return (
    <article className="ProjectPreview">
      <h3 className="ProjectPreview-title">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </h3>
      <a
        className="ProjectPreview-url"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {url.replace(/^https?:\/\//, "")}
      </a>
      <p className="ProjectPreview-description">{description}</p>
      {tags.length > 0 && (
        <ul className="ProjectPreview-tags">
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default ProjectPreview;
