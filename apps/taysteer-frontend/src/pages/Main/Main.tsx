import { RecipeList } from '../../components/recipe.list/Recipe.list';
import './Main.sass';
import backgroundImage from '../../assets/images/main.background.png';

export const MainPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="background-image">
        <img src={backgroundImage} alt="background image of food" />
      </div>
      <RecipeList />
    </div>
  );
};
