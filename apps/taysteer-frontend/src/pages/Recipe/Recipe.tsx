import { Recipe } from '../../components/recipe/Recipe';
import './Recipe.sass';

export const RecipePage: React.FC = () => {
  return (
    <div>
      <section className="recipe-container">
        <Recipe />
      </section>
    </div>
  );
};
