import { ConnectionOptions } from 'typeorm';
import {
  POSTGRES_URL,
} from '../../../configs/common/config';
import { Recipe } from './resources/recipes/recipe.model';
import { RecipeRating } from './resources/recipes/recipe.rating.model';
import { User } from './resources/users/user.model';
import { Comment } from './resources/recipes/recipe.comment.model';

export const connectionOptions = {
  type: 'postgres',
  url: POSTGRES_URL,
  migrationsRun: false,
  synchronize: true,
  logging: false,
  keepConnectionAlive: true,
  autoReconnect: true,
  reconnectTries: 100,
  reconnectionInterval: 2000,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [User, Recipe, RecipeRating, Comment],
} as ConnectionOptions;
