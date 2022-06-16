import { useEffect } from 'react';
import { Recipe } from '../../components/recipe/Recipe';
import './Recipe.sass';

export const RecipePage: React.FC = () => {
  useEffect(() => {
    document.body.style.overflowY = "auto";
    return () => {
      document.body.style.overflowY = "hidden";
    };
  }, []);

  return (
    <div>
        <Recipe />
    </div>
  );
};
