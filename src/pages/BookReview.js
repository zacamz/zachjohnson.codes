import { useState } from "react";
import "./BookReview.css";

function BookReview() {
  const [open, setOpen] = useState(false);
  const [cardSide, setCardSide] = useState("front");

  return (
    <div className="BookReview text-page">
      {!open ? (
        <button
          type="button"
          className="BookReview-cover-button"
          onClick={() => setOpen(true)}
          aria-label="Open typewritten review"
        >
          <img
            className="BookReview-cover"
            src="/book-review/cover.png"
            alt="Cover of The World-Ending Fire: The Essential Wendell Berry"
          />
        </button>
      ) : (
        <div className="BookReview-review">
          <button
            type="button"
            className="BookReview-back"
            onClick={() => {
              setOpen(false);
              setCardSide("front");
            }}
            aria-label="Back to cover"
          >
            ←
          </button>
          <img
            className="BookReview-page"
            src="/book-review/review.png"
            alt="Typewritten review of The World-Ending Fire"
          />
          <button
            type="button"
            className="BookReview-card-button"
            onClick={() =>
              setCardSide((side) => (side === "front" ? "back" : "front"))
            }
            aria-label={
              cardSide === "front"
                ? "Flip card to read the thank-you note"
                : "Flip card to the front"
            }
          >
            <img
              className="BookReview-card"
              src={
                cardSide === "front"
                  ? "/book-review/card-front.png"
                  : "/book-review/card-back.png"
              }
              alt={
                cardSide === "front"
                  ? "Hand-drawn broadfork card: Broad Fork kind of folk"
                  : "Handwritten thank-you note to Mr. Berry"
              }
            />
          </button>
          <img
            className="BookReview-response"
            src="/book-review/WendellBerryResponse.png"
            alt="Handwritten reply from Wendell Berry"
          />
        </div>
      )}
    </div>
  );
}

export default BookReview;
