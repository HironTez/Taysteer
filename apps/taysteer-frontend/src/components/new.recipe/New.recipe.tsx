import './New.recipe.sass';
import React from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useNavigate } from 'react-router-dom';

export const NewRecipe: React.FC = () => {
  const { account } = useTypedSelector((state) => state.account);
  const navigate = useNavigate();

  if (!account) {
    navigate('/');
  }

  return (
    <form className="new-recipe">
      <input className="image-uploading rounded main-image" type="file" accept="image/*" name="main photo"></input>
    </form>
  );
};
