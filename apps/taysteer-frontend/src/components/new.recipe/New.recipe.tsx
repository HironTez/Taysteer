import './New.recipe.sass';
import React, { useEffect, useState } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useNavigate } from 'react-router-dom';
import { allowVerticalScroll } from '../../scripts/own.module';
import $ from 'jquery';

interface ingredients {
  count: number | null;
  name: string | null;
}

export const NewRecipe: React.FC = () => {
  const { account, loading } = useTypedSelector((state) => state.account);
  const navigate = useNavigate();

  const [firstRun, setFirstRun] = useState(true);

  // Exit if not logged in
  useEffect(() => {
    if (!account && !loading && !firstRun) {
      navigate('/login');
    } else {
      setFirstRun(true);
    }
  }, [account, firstRun, loading, navigate]);

  useEffect(allowVerticalScroll, []);

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      $(e.target).css('backgroundImage', `url("${reader.result}")`);
      $(e.target).addClass('selected');
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      $(e.target).css('backgroundImage', 'none');
      $(e.target).removeClass('selected');
    }
  };

  const newIngredientElem = (id = 0) => (
    <div
      className="ingredient"
      key={id}
      id={String(id)}
      onChange={() => {
        changeIngredient(id);
      }}
    >
      <input
        type="number"
        placeholder="Count"
        name="ingredient-count"
        className="ingredient-count"
        min="0.1"
      />
      <input
        type="text"
        placeholder="Ingredient"
        name="ingredient-title"
        className="ingredient-title"
      />
      <button
        className="remove-ingredient"
        type="button"
        onClick={() => {
          removeIngredient(id);
        }}
      >
        &#9587;
      </button>
    </div>
  );

  const initialIngredients: ingredients[] = [
    { count: null, name: null },
    { count: null, name: null },
  ];

  const [ingredientList, setIngredientList] = useState(initialIngredients);

  // useEffect(() => {
  //   console.log(ingredientList);
  // }, [ingredientList]);

  const addIngredient = () => {
    setIngredientList([...ingredientList, { count: null, name: null }]);
  };

  const removeIngredient = (id: number) => {
    setIngredientList(
      ingredientList.filter((_ingredient, index) => index !== id)
    );
  };

  const changeIngredient = (id: number) => {
    const ingredientElem = $(`.ingredient#${id}`);
    const ingredient = { ...ingredientList[id] };
    const count = $(ingredientElem).find('input.ingredient-count').val();
    if (count) {
      ingredient.count = Number(count);
    }
    const name = $(ingredientElem).find('input.ingredient-title').val();
    if (name) {
      ingredient.name = String(name);
    }

    const newIngredientList = [...ingredientList];
    newIngredientList[id] = ingredient;
    setIngredientList(newIngredientList);
  };

  return (
    <div className="new-recipe">
      <input
        className="image-uploading rounded main-image"
        type="file"
        accept="image/*"
        name="main photo"
        onChange={handleImageInput}
      ></input>
      <label className="title-container">
        Title
        <input
          className="title"
          name="title"
          type="text"
          placeholder="Enter the title of the recipe"
        />
      </label>
      <label className="description-container">
        Description
        <textarea
          className="description"
          name="description"
          placeholder="Enter the description of the recipe"
        />
      </label>

      <div className="ingredients">
        <div className="title">Ingredients</div>
        {ingredientList.map((_ingredient, index) => newIngredientElem(index))}
        <button
          className="add-ingredient"
          type="button"
          onClick={addIngredient}
        >
          +
        </button>
      </div>

      {/* <div className="steps">
        <div className="title">Steps to make it</div>
        <ol className="list">
          {Object.keys(recipe.steps).map((stepKey, index) => {
            const step = recipe.steps[stepKey];
            return (
              <li className="step" key={`step-${index}`}>
                <div className="title">{step.title}</div>
                <div className="description">{step.description}</div>
                <img
                  src={step.image}
                  alt="A step of the recipe"
                  className="step-image"
                />
              </li>
            );
          })}
        </ol>
      </div> */}
    </div>
  );
};
