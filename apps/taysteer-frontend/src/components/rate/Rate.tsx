import { range } from '../../scripts/own.module';
import './Rate.sass';
import $ from 'jquery';

export const Rate: React.FC<{
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
}> = ({ rating, setRating }) => {

  const changeDisplayedRating = (from: number, to: number) => {
    const elem = $('.rate');
    elem.removeClass(`rating-${from}`);
    elem.addClass(`rating-${to}`);
  };

  return (
    <div className={`rate rating-${rating}`}>
      {range(1, 5).map((i) => (
        <span
          key={i}
          className={`rating-star rating-star-${i}`}
          onClick={() => setRating(i)}
          onMouseEnter={() => changeDisplayedRating(rating, i)}
          onMouseLeave={() => changeDisplayedRating(i, rating)}
        ></span>
      ))}
    </div>
  );
};
