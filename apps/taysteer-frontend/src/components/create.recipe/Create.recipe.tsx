import './Create.recipe.sass';
import React, { useEffect, useState } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useNavigate } from 'react-router-dom';
import { allowVerticalScroll, popup } from '../../scripts/own.module';
import $ from 'jquery';
import { useActions } from '../../hooks/useAction';
import { Loading } from '../loading.spinner/Loading.spinner';

export const UploadRecipe: React.FC<{
  oldRecipe?: Recipe | null;
  oldRecipeId?: string;
  oldRecipeLoading?: boolean;
}> = ({ oldRecipe, oldRecipeId, oldRecipeLoading }) => {
  const { account, loading: accountLoading } = useTypedSelector(
    (state) => state.account
  );
  const navigate = useNavigate();

  const [firstRun, setFirstRun] = useState(true);

  useEffect(() => {
    if (firstRun) {
      setFirstRun(false);
    }
  }, [firstRun]);

  // Exit if not logged in
  useEffect(() => {
    if (!account && !accountLoading && !firstRun) {
      navigate('/login');
    }
  }, [account, firstRun, accountLoading, navigate]);

  // Allow vertical scroll
  useEffect(allowVerticalScroll, []);

  // Handle image file selection
  const handleImageInput = (
    e: React.ChangeEvent<HTMLInputElement> | HTMLInputElement
  ) => {
    const target = e instanceof HTMLInputElement ? e : e.target;

    const file = target.files?.[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      $(target).css('backgroundImage', `url("${reader.result}")`);
      $(target).addClass('selected');
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      $(target).css('backgroundImage', 'none');
      $(target).removeClass('selected');
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
    } else {
      ingredient.count = null;
    }
    const name = $(ingredientElem).find('input.ingredient-title').val();
    ingredient.name = String(name);

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
    step.title = String(title);
    const description = $(stepElem).find('textarea.description').val();
    step.description = String(description);
    const image = $(stepElem).find('input.step-image').prop('files')?.[0];
    step.image = image;

    const newStepList = [...stepList];
    newStepList[id] = step;
    setStepList(newStepList);
  };

  // If it's a recipe updating
  const [oldRecipeLoaded, setOldRecipeLoaded] = useState(false);

  useEffect(() => {
    if (oldRecipe && oldRecipeId && !oldRecipeLoading && !oldRecipeLoaded) {
      setRecipe(oldRecipe);
      setIngredientList(oldRecipe.ingredients);
      setStepList(oldRecipe.steps);

      if (
        ingredientList === oldRecipe.ingredients &&
        stepList === oldRecipe.steps
      ) {
        // Set main image
        if (oldRecipe.image) {
          const dataTransfer = new DataTransfer();
          const mainImage = $('.new-recipe .main-image');
          const mainImageElem = mainImage.get(0) as HTMLInputElement;
          dataTransfer.items.add(oldRecipe.image);
          mainImageElem.files = dataTransfer.files;
          handleImageInput(mainImageElem);
        }

        // Set step images
        oldRecipe.steps.forEach((_step, index) => {
          const image = oldRecipe.steps[index].image;
          if (image) {
            const dataTransfer = new DataTransfer();
            const stepImage = $(`.new-recipe .steps .step .step-image`)[index];
            const stepImageElem = stepImage as HTMLInputElement;
            dataTransfer.items.add(image);
            stepImageElem.files = dataTransfer.files;
            handleImageInput(stepImageElem);
          }
        });

        setOldRecipeLoaded(true);
      }
    }
  }, [
    oldRecipe,
    oldRecipeLoaded,
    oldRecipeId,
    oldRecipeLoading,
    ingredientList,
    stepList,
  ]);

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
    newRecipe.title = String(title);
    const description = $('.new-recipe .description').val();
    newRecipe.description = String(description);
    const image = $('.new-recipe .main-image').prop('files')?.[0];
    newRecipe.image = image;
    setRecipe(newRecipe);
  };

  // Update recipe on ingredients or steps change
  useEffect(() => {
    const newRecipe = { ...recipe };
    newRecipe.ingredients = ingredientList;
    newRecipe.steps = stepList;
    setRecipe(newRecipe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredientList, stepList]);

  const validateRecipe = () => {
    if (!recipe.title || recipe.title.length > 50)
      return {
        success: false,
        message: 'Title must be between 1 and 50 characters',
      };
    if (!recipe.description || recipe.description.length > 500)
      return {
        success: false,
        message: 'Description must be between 1 and 500 characters',
      };
    if (!recipe.image) return { success: false, message: 'Image is required' };
    for (const ingredient of recipe.ingredients) {
      if (
        ingredient.count === null ||
        ingredient.count > 1_000_000 ||
        ingredient.count < 0
      )
        return {
          success: false,
          message: 'Ingredient count must be between 0 and 1,000,000',
        };
      if (!ingredient.name || ingredient.name.length > 100)
        return {
          success: false,
          message: 'Ingredient name must be between 1 and 100 characters',
        };
    }
    for (const step of recipe.steps) {
      if (!step.title || step.title.length > 100)
        return {
          success: false,
          message: 'Step title must be between 1 and 100 characters',
        };
      if (!step.description || step.description.length > 500)
        return {
          success: false,
          message: 'Step description must be between 1 and 500 characters',
        };
      if (!step.image)
        return { success: false, message: 'Step image is required' };
    }
    return { success: true };
  };

  const submitRecipe = () => {
    if (validateRecipe().success) {
      // Set main data
      const formData = new FormData();
      formData.append('title', recipe.title);
      formData.append('description', recipe.description);
      formData.append('image', recipe.image ?? '');
      formData.append('ingredients', JSON.stringify(recipe.ingredients));

      const newSteps: {
        [key: number]: { title: string; description: string };
      } = {};
      const stepImages = [];

      // Set steps
      for (const step of recipe.steps) {
        const index = recipe.steps.indexOf(step);

        newSteps[index] = {
          title: step.title,
          description: step.description,
        };
        stepImages.push(step.image ?? '');
      }

      formData.append('steps', JSON.stringify(newSteps));

      // Set step images
      for (const image of stepImages) {
        const index = stepImages.indexOf(image);
        formData.append(`stepImage${index + 1}`, image);
      }

      fetchUploadRecipe(formData, oldRecipeLoaded, oldRecipeId);
    } else {
      popup(
        validateRecipe().message ??
          'Error on recipe validating. Please check the data',
        'error'
      );
    }
  };

  const {
    recipe: responseRecipe,
    loading: responseRecipeLoading,
    error: responseRecipeError,
  } = useTypedSelector((state) => state.uploadRecipe);

  const { fetchUploadRecipe } = useActions();

  useEffect(() => {
    // On success redirect to recipe page
    if (responseRecipe && !responseRecipeLoading && !responseRecipeError) {
      navigate(`/recipes/${responseRecipe.id}`);
      // On error show popup
    } else if (responseRecipeError) {
      popup(responseRecipeError, 'error');
    }
  }, [navigate, responseRecipe, responseRecipeError, responseRecipeLoading]);

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
          value={recipe.title}
          onChange={() => null}
        />
      </label>
      <label className="description-container">
        Description
        <textarea
          className="description"
          name="description"
          placeholder="Enter the description of the recipe here"
          value={recipe.description}
          onChange={() => null}
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
              value={ingredient.count ?? ''}
              onChange={() => null}
            />
            <input
              type="text"
              placeholder="Enter the name of the ingredient here"
              name="ingredient-title"
              className="ingredient-title"
              value={ingredient.name}
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
      <div className="action">
        <a className="cancel" href="/">
          Cancel
        </a>
        <button className="submit" type="button" onClick={submitRecipe}>
          Submit
        </button>
      </div>
      {(responseRecipeLoading || oldRecipeLoading) && (
        <div className="loading">
          <Loading />
        </div>
      )}
    </div>
  );
};
