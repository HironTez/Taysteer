import { RecipeList } from '../../components/recipe.list/Recipe.list';
import './Main.sass';
import backgroundImage from '../../assets/images/main.background.png';
import { useEffect } from 'react';
import { allowVerticalScroll } from '../../scripts/own.module';

export const MainPage: React.FC = () => {
  useEffect(allowVerticalScroll);

  return (
    <div className="page-container">
      <img src={backgroundImage} alt="wallpaper with food" className="background-image"/>
      <RecipeList />
    </div>
  );
};
