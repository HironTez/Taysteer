import './Rating.sass';

export const Rating: React.FC<{ rating: number; countOfRatings?: number }> = ({
  rating = 0,
  countOfRatings,
}) => {
  return (
    <div className={`rating rating-${Math.round(rating)}`}>
      <span className="rating-star 1"></span>
      <span className="rating-star 2"></span>
      <span className="rating-star 3"></span>
      <span className="rating-star 4"></span>
      <span className="rating-star 5"></span>
      {countOfRatings ? <div className="rating-count">({countOfRatings})</div> : null}
    </div>
  );
};
