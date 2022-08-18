import './New.recipe.sass';
import React, { useEffect, useState } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useNavigate } from 'react-router-dom';
import { allowVerticalScroll } from '../../scripts/own.module';
import $ from 'jquery';

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

  // Allow vertical scroll
  useEffect(allowVerticalScroll, []);

  // Handle image file selection
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

  // Ingredients
  const initialIngredients: Ingredient[] = [
    { count: null, name: '' },
    { count: null, name: '' },
  ];

  const [ingredientList, setIngredientList] = useState(initialIngredients);

  const addIngredient = () => {
    setIngredientList([...ingredientList, { count: null, name: '' }]);
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

  // Steps
  const initialStepList: Step[] = [
    { title: '', description: '', image: null },
    { title: '', description: '', image: null },
  ];

  const [stepList, setStepList] = useState(initialStepList);

  const addStep = () => {
    setStepList([...stepList, { title: '', description: '', image: null }]);
  };

  const removeStep = (id: number) => {
    setStepList(stepList.filter((_step, index) => index !== id));
  };

  const changeStep = (id: number) => {
    const stepElem = $(`#${id}.step`);
    const step = { ...stepList[id] };
    const title = $(stepElem).find('input.title').val();
    if (title) {
      step.title = String(title);
    }
    const description = $(stepElem).find('textarea.description').val();
    if (description) {
      step.description = String(description);
    }
    const image = $(stepElem).find('input.step-image').prop('files')?.[0];
    if (image) {
      step.image = image;
    }

    const newStepList = [...stepList];
    newStepList[id] = step;
    setStepList(newStepList);
  };

  // Recipe
  const initialRecipe: Recipe = {
    title: '',
    description: '',
    image: null,
    ingredients: ingredientList,
    steps: stepList,
  };

  const [recipe, setRecipe] = useState(initialRecipe);

  const changeRecipe = () => {
    const newRecipe = { ...recipe };
    const title = $('.new-recipe .title').val();
    if (title) {
      newRecipe.title = String(title);
    }
    const description = $('.new-recipe .description').val();
    if (description) {
      newRecipe.description = String(description);
    }
    const image = $('.new-recipe .main-image').prop('files')?.[0];
    if (image) {
      newRecipe.image = image;
    }
    newRecipe.ingredients = ingredientList;
    newRecipe.steps = stepList;
    setRecipe(newRecipe);
  };

  return (
    <div className="new-recipe" onChange={changeRecipe}>
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
          placeholder="Enter the description of the recipe here"
        />
      </label>

      <div className="ingredients">
        <div className="title">Ingredients</div>
        {ingredientList.map((ingredient, index) => (
          <div
            className="ingredient"
            key={index}
            id={String(index)}
            onChange={() => {
              changeIngredient(index);
            }}
          >
            <input
              type="number"
              placeholder="Count"
              name="ingredient-count"
              className="ingredient-count"
              min="0.1"
              value={ingredient.count ?? undefined}
              onChange={() => null}
            />
            <input
              type="text"
              placeholder="Enter the name of the ingredient here"
              name="ingredient-title"
              className="ingredient-title"
              value={ingredient.name ?? undefined}
              onChange={() => null}
            />
            <button
              className="remove-ingredient"
              type="button"
              onClick={() => {
                removeIngredient(index);
              }}
            >
              &#9587;
            </button>
          </div>
        ))}
        <button
          className="add-ingredient"
          type="button"
          onClick={addIngredient}
        >
          +
        </button>
      </div>

      <div className="steps">
        <div className="title">Steps to make it</div>
        <ol className="list">
          {stepList.map((step, index) => (
            <li
              className="step"
              key={index}
              id={String(index)}
              onChange={() => {
                changeStep(index);
              }}
            >
              <input
                type="text"
                placeholder="Enter the title of the step here"
                name="step-title"
                className="title"
                value={step.title}
                onChange={() => null}
              />
              <textarea
                placeholder="Enter the description of the step here"
                name="step-description"
                className="description"
                value={step.description}
                onChange={() => null}
              />
              <input
                type="file"
                accept="image/*"
                name="step-image"
                className="image-uploading step-image"
                onChange={handleImageInput}
              />
              <button
                className="remove-step"
                type="button"
                onClick={() => {
                  removeStep(index);
                }}
              >
                &#9587;
              </button>
            </li>
          ))}
        </ol>
        <button className="add-step" type="button" onClick={addStep}>
          +
        </button>
      </div>
    </div>
  );
};
