import './Rating.sass';

export const Rating: React.FC<{ rating: number }> = ({ rating = 0 }) => {
  return (
    <div className={`rating rating-${rating}`}>
      <span className="rating-star 1"></span>
      <span className="rating-star 2"></span>
      <span className="rating-star 3"></span>
      <span className="rating-star 4"></span>
      <span className="rating-star 5"></span>
    </div>
  );
};
