import './Edit.profile.sass';
import React, { useEffect, useState } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useNavigate, useParams } from 'react-router-dom';
import {
  allowVerticalScroll,
  exec,
  popup,
  urlToObject,
} from '../../scripts/own.module';
import $ from 'jquery';
import { useActions } from '../../hooks/useAction';
import { Loading } from '../loading.spinner/Loading.spinner';

export const EditProfile: React.FC = () => {
  const { userId } = useParams();

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
      $(target).css('backgroundColor', 'transparent');
      $(target).addClass('selected');
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      $(target).css('backgroundImage', 'none');
      $(target).css('backgroundColor', '#FCD767');
      $(target).removeClass('selected');
    }
  };

  const { profile: oldProfile, loading: oldProfileLoading } = useTypedSelector(
    (state) => state.profile
  );

  // On pld profile load
  useEffect(() => {
    if (oldProfile && !oldProfileLoading) {
      exec(async () => {
        const image = await urlToObject(oldProfile.image);
        setProfile({
          ...oldProfile,
          ...{ image: image, password: '', passwordRepeat: '' },
        });

        // Set main image
        if (image) {
          const dataTransfer = new DataTransfer();
          const mainImage = $('.edit-profile .main-image');
          const mainImageElem = mainImage.get(0) as HTMLInputElement;
          dataTransfer.items.add(image);
          mainImageElem.files = dataTransfer.files;
          handleImageInput(mainImageElem);
        }
      });
    }
  }, [oldProfile, oldProfileLoading]);

  // NewRecipeT
  const initialProfile: EditProfileT = {
    name: '',
    login: '',
    password: '',
    passwordRepeat: '',
    description: '',
    image: null,
  };

  const [profile, setProfile] = useState(initialProfile);

  const changeProfile = () => {
    const newProfile = { ...profile };
    const name = $('.edit-profile .name').val();
    newProfile.name = String(name);
    const login = $('.edit-profile .login').val();
    newProfile.login = String(login);
    const password = $('.edit-profile .password').val();
    newProfile.password = String(password);
    const passwordRepeat = $('.edit-profile .password.password-repeat').val();
    newProfile.passwordRepeat = String(passwordRepeat);
    const description = $('.edit-profile .description').val();
    newProfile.description = String(description);
    const image = $('.edit-profile .main-image').prop('files')?.[0];
    newProfile.image = image;
    setProfile(newProfile);
  };

  const validateProfile = () => {
    if (!profile.name || profile.name.length > 50)
      return {
        success: false,
        message: 'Title must contain between 1 and 50 characters',
      };
    if (!profile.login || profile.login.length > 50)
      return {
        success: false,
        message: 'Login must contain between 1 and 50 characters',
      };
    if (profile.password !== profile.passwordRepeat)
      return {
        success: false,
        message: 'Passwords do not match',
      };
    if (!profile.password || profile.password.length > 50)
      return {
        success: false,
        message: 'Password must contain between 1 and 50 characters',
      };
    if (!profile.description || profile.description.length > 500)
      return {
        success: false,
        message: 'Description must contain between 1 and 500 characters',
      };
    if (!profile.image) return { success: false, message: 'Image is required' };
    return { success: true };
  };

  const submitRecipe = () => {
    const validationResult = validateProfile();
    if (validationResult.success && userId) {
      // Set main data
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('login', profile.name);
      formData.append('password', profile.password);
      formData.append('description', profile.description);
      formData.append('image', profile.image ?? '');

      fetchUpdateProfile(formData, userId);
    } else {
      popup(
        validationResult.message ??
          'Error on recipe validating. Please check the data',
        'error'
      );
    }
  };

  const {
    profile: responseProfile,
    loading: responseProfileLoading,
    error: responseProfileError,
  } = useTypedSelector((state) => state.updateProfile);

  const { fetchUpdateProfile } = useActions();

  useEffect(() => {
    // On success redirect to profile page
    if (responseProfile && !responseProfileLoading && !responseProfileError) {
      navigate(`/recipes/${responseProfile.id}`);
      window.location.reload();
      // On error show popup
    } else if (responseProfileError) {
      popup(responseProfileError, 'error');
    }
  }, [navigate, responseProfile, responseProfileError, responseProfileLoading]);

  return (
    <div className="edit-profile" onChange={changeProfile}>
      <input
        className="image-uploading rounded main-image"
        type="file"
        accept="image/*"
        name="main photo"
        onChange={handleImageInput}
        placeholder="Select your photo..."
      ></input>
      <label className="name-container">
        Name
        <input
          className="name"
          name="name"
          type="text"
          placeholder="Enter your name"
          value={profile.name}
          onChange={() => null}
        />
      </label>
      <label className="username-container">
        Login
        <input
          className="login"
          name="login"
          type="text"
          placeholder="Enter your new login"
          value={profile.login}
          onChange={() => null}
        />
      </label>
      <label className="password-container">
        Password
        <input
          className="password"
          name="password"
          type="password"
          placeholder="Enter your new password"
          onChange={() => null}
        />
      </label>
      <label className="password-container repeat">
        Password
        <input
          className="password password-repeat"
          name="password-repeat"
          type="password"
          placeholder="Repeat your password"
          onChange={() => null}
        />
      </label>
      <label className="description-container">
        Description
        <textarea
          className="description"
          name="description"
          placeholder="Enter the description here"
          value={profile.description}
          onChange={() => null}
        />
      </label>

      <div className="action">
        <a className="cancel" href="/">
          Cancel
        </a>
        <button className="submit" type="button" onClick={submitRecipe}>
          Submit
        </button>
      </div>
      {(responseProfileLoading || oldProfileLoading) && (
        <div className="loading">
          <Loading />
        </div>
      )}
    </div>
  );
};
