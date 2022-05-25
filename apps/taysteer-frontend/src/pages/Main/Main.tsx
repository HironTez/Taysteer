import { RecipeList } from '../../components/recipe.list/Recipe.list';
import './Main.sass';
import backgroundImage from "../../images/main.background.png";

export const MainPage: React.FC = () => {
  return (
    <div>
      <section className="background-image">
        <img src={backgroundImage} alt="background image of food"/>
      </section>
      <RecipeList />
    </div>
  );
};
