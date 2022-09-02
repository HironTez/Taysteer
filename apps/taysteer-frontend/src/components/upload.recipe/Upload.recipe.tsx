import './Upload.recipe.sass';
import React, { useEffect, useState } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useNavigate } from 'react-router-dom';
import { allowVerticalScroll, popup } from '../../scripts/own.module';
import $ from 'jquery';
import { useActions } from '../../hooks/useAction';
import { Loading } from '../loading.spinner/Loading.spinner';

export const UploadRecipe: React.FC<{
  oldRecipe?: NewRecipeT | null;
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

  // NewIngredientTs
  const initialNewIngredientTs: NewIngredientT[] = [
    { count: null, name: '' },
    { count: null, name: '' },
  ];

  const [ingredientList, setNewIngredientTList] = useState(initialNewIngredientTs);

  const addNewIngredientT = () => {
    setNewIngredientTList([...ingredientList, { count: null, name: '' }]);
  };

  const removeNewIngredientT = (id: number) => {
    setNewIngredientTList(
      ingredientList.filter((_ingredient, index) => index !== id)
    );
  };

  const changeNewIngredientT = (id: number) => {
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

    const newNewIngredientTList = [...ingredientList];
    newNewIngredientTList[id] = ingredient;
    setNewIngredientTList(newNewIngredientTList);
  };

  // NewStepTs
  const initialNewStepTList: NewStepT[] = [
    { title: '', description: '', image: null },
    { title: '', description: '', image: null },
  ];

  const [stepList, setNewStepTList] = useState(initialNewStepTList);

  const addNewStepT = () => {
    setNewStepTList([...stepList, { title: '', description: '', image: null }]);
  };

  const removeNewStepT = (id: number) => {
    setNewStepTList(stepList.filter((_step, index) => index !== id));
  };

  const changeNewStepT = (id: number) => {
    const stepElem = $(`#${id}.step`);
    const step = { ...stepList[id] };
    const title = $(stepElem).find('input.title').val();
    step.title = String(title);
    const description = $(stepElem).find('textarea.description').val();
    step.description = String(description);
    const image = $(stepElem).find('input.step-image').prop('files')?.[0];
    step.image = image;

    const newNewStepTList = [...stepList];
    newNewStepTList[id] = step;
    setNewStepTList(newNewStepTList);
  };

  // If it's a recipe updating
  const [oldRecipeLoaded, setOldRecipeLoaded] = useState(false);

  useEffect(() => {
    if (oldRecipe && oldRecipeId && !oldRecipeLoading && !oldRecipeLoaded) {
      setRecipe(oldRecipe);
      setNewIngredientTList(oldRecipe.ingredients);
      setNewStepTList(oldRecipe.steps);

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

  // NewRecipeT
  const initialRecipe: NewRecipeT = {
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
          message: 'NewIngredientT count must be between 0 and 1,000,000',
        };
      if (!ingredient.name || ingredient.name.length > 100)
        return {
          success: false,
          message: 'NewIngredientT name must be between 1 and 100 characters',
        };
    }
    for (const step of recipe.steps) {
      if (!step.title || step.title.length > 100)
        return {
          success: false,
          message: 'NewStepT title must be between 1 and 100 characters',
        };
      if (!step.description || step.description.length > 500)
        return {
          success: false,
          message: 'NewStepT description must be between 1 and 500 characters',
        };
      if (!step.image)
        return { success: false, message: 'NewStepT image is required' };
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

      const newNewStepTs: {
        [key: number]: { title: string; description: string };
      } = {};
      const stepImages = [];

      // Set steps
      for (const step of recipe.steps) {
        const index = recipe.steps.indexOf(step);

        newNewStepTs[index] = {
          title: step.title,
          description: step.description,
        };
        stepImages.push(step.image ?? '');
      }

      formData.append('steps', JSON.stringify(newNewStepTs));

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
        <div className="title">NewIngredientTs</div>
        {ingredientList.map((ingredient, index) => (
          <div
            className="ingredient"
            key={index}
            id={String(index)}
            onChange={() => {
              changeNewIngredientT(index);
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
                removeNewIngredientT(index);
              }}
            >
              &#9587;
            </button>
          </div>
        ))}
        <button
          className="add-ingredient"
          type="button"
          onClick={addNewIngredientT}
        >
          +
        </button>
      </div>

      <div className="steps">
        <div className="title">NewStepTs to make it</div>
        <ol className="list">
          {stepList.map((step, index) => (
            <li
              className="step"
              key={index}
              id={String(index)}
              onChange={() => {
                changeNewStepT(index);
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
                  removeNewStepT(index);
                }}
              >
                &#9587;
              </button>
            </li>
          ))}
        </ol>
        <button className="add-step" type="button" onClick={addNewStepT}>
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
