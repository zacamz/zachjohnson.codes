import ProjectPreview from "../components/ProjectPreview.js";
import "./Projects.css";

const projects = [
  {
    title: "Ray Johnson Artworks",
    url: "https://rayjohnsonart.works",
    description:
      "An online gallery for Ray Johnson's oil paintings — browse the work, see dimensions and prices, and find pieces still available.",
    tags: ["gallery", "art", "family"],
  },
  {
    title: "Guiding A Path",
    url: "https://guidingapath.com",
    description:
      "A ministry site for Matt and Amy Ellis, who teach Pathfinder and Adventurer honors that blend faith, creation, and hands-on learning.",
    tags: ["ministry", "pathfinders", "education"],
  },
  {
    title: "Good News Growers",
    url: "https://goodnewsgrowers.com",
    description:
      "A growing project around the good news that comes from the soil — sharing the work, people, and stories behind local food.",
    tags: ["farming", "community", "in progress"],
  },
];

function Projects() {
  return (
    <div className="Projects text-page">
      <h2>Projects</h2>
      <p className="Projects-intro">
        A few websites I have been building lately — some for family, some for
        friends, all close to home.
      </p>
      <div className="Projects-grid">
        {projects.map((project) => (
          <ProjectPreview key={project.url} {...project} />
        ))}
      </div>
    </div>
  );
}

export default Projects;
