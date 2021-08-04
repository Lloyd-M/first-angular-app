import { Ingredient } from 'src/app/shared/ingredient.model';
import { Action } from '@ngrx/store';
import { Recipe } from '../recipe.model';

export const SET_RECIPES = '[Recipes] Set recipes';
export const GETRECIPES = '[Recipes] Get recipes';
export const GETRECIPE = '[Recipes] Get recipe';
export const ADDRECIPE = '[Recipes] Add recipe';
export const UPDATERECIPE = '[Recipes] Update recipe';
export const REMOVERECIPE = '[Recipes] Remove recipe';
export const SAVERECIPE = '[Recipes] Save recipe';
export const LOADRECIPE = '[Recipes] Load recipe';

export class SetRecipes implements Action {
  readonly type = SET_RECIPES;
  constructor(public payload: Recipe[]) {}
}
export class GetRecipes implements Action {
  readonly type = GETRECIPES;
}
export class GetRecipe implements Action {
  readonly type = GETRECIPE;
  constructor(public payload: number) {}
}
export class AddRecipe implements Action {
  readonly type = ADDRECIPE;
  constructor(public payload: Recipe) {}
}
export class UpdateRecipe implements Action {
  readonly type = UPDATERECIPE;
  constructor(public payload: { index: number; recipe: Recipe }) {}
}
export class RemoveRecipe implements Action {
  readonly type = REMOVERECIPE;
  constructor(public payload: number) {}
}
export class SaveRecipe implements Action {
  readonly type = SAVERECIPE;
}
export class LoadRecipe implements Action {
  readonly type = LOADRECIPE;
}

export type RecipeActions =
  | SetRecipes
  | GetRecipes
  | GetRecipe
  | AddRecipe
  | UpdateRecipe
  | RemoveRecipe
  | SaveRecipe
  | LoadRecipe;
