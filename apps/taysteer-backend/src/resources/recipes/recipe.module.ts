import { UserModule } from './../users/user.module';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { RecipeRating } from './recipe.rating.model';
import { Recipe } from './recipe.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './recipe.comment.model';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, RecipeRating, Comment]), UserModule],
  providers: [RecipeService],
  controllers: [RecipeController]
})
export class RecipeModule {}
