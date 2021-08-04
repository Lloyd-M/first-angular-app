import { Recipe } from './../recipe.model';
import * as RecipeActions from './recipe.actions';

export interface State {
  recipes: Recipe[];
}
const initialState: State = {
  recipes: [],
};

export function recipeReducer(
  state = initialState,
  action: RecipeActions.RecipeActions
) {
  switch (action.type) {
    case RecipeActions.SET_RECIPES:
      return { ...state, recipes: action.payload };
    case RecipeActions.ADDRECIPE: {
      const recipes = state.recipes.slice();
      recipes.push(action.payload);
      return { ...state, recipes };
    }
    case RecipeActions.REMOVERECIPE: {
      const recipes = state.recipes.slice();
      recipes.splice(action.payload, 1);
      return { ...state, recipes };
    }
    case RecipeActions.UPDATERECIPE: {
      const recipes = state.recipes.slice();
      recipes[action.payload.index] = action.payload.recipe;
      return { ...state, recipes };
    }
    case RecipeActions.SAVERECIPE:
      return { ...state };
    case RecipeActions.LOADRECIPE:
      return { ...state };
    default:
      return state;
  }
}
