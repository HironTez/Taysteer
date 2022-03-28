import { ConnectionOptions } from 'typeorm';
import { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DATABASE } from '../../../configs/common/config';
import { Recipe } from './resources/recipes/recipe.model';
import { RecipeRater } from './resources/recipes/recipe.rater.model';
import { User } from './resources/users/user.model';
import { UserRater } from './resources/users/user.rater.model';
import { Comment } from './resources/recipes/recipe.comment.model';

export const connectionOptions = {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE,
  migrationsRun: false,
  synchronize: true,
  logging: false,
  keepConnectionAlive: true,
  autoReconnect: true,
  reconnectTries: 100,
  reconnectionInterval: 2000,
  entities: [User, UserRater, Recipe, RecipeRater, Comment]
} as ConnectionOptions;
