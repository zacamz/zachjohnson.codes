// Put your images in public/blog/ — then reference them from the site root:
//   public/blog/sunrise.jpg  →  src="/blog/sunrise.jpg"

function PhotoExample() {
  return (
    <>
      <p>
        Text first. Then a photo dropped right in the middle of the post, like
        you typed around it.
      </p>

      <img
        src="/art/08262026.png"
        alt="Example sketch — swap this path for your own file in public/blog/"
      />

      <p>
        More text after. You can add as many images as you want, anywhere in
        the JSX.
      </p>
    </>
  );
}

export default PhotoExample;
