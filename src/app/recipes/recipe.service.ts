import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import * as ShoppingListActions from './../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from './store/recipe.actions';

@Injectable()
export class RecipeService {
  private fireBaseURL = 'https://recipe-book-95e66.firebaseio.com/';
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];
  /* private recipes: Recipe[] = [
    new Recipe(
      'Jamaican Jerk Chicken',
      'Tasty jerk Jamaican style chicken',
      'https://i.pinimg.com/originals/fe/04/e0/fe04e01b5f3580372e0e6713e1cd5f53.jpg',
      [
        new Ingredient('Chicken', 1),
        new Ingredient('Jamaican Jerk Sauce', 1),
        new Ingredient('Rice', 1),
      ]
    ),
    new Recipe(
      'Jamaican OxTail',
      'OxTail',
      'https://i.redd.it/kaghi6m35vt31.jpg',
      [new Ingredient('OxTail', 1), new Ingredient('Rice', 1)]
    ),
  ]; */

  constructor(
    private shoppingListService: ShoppingListService,
    private http: HttpClient,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  getRecipes() {
    return this.store
      .select('recipes')
      .pipe(
        map((recipeState) => {
          return recipeState.recipes;
        })
      )
      .subscribe((recipes) => {
        return recipes;
      });
    // return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.store
      .select('recipes')
      .pipe(map((recipeState) => recipeState.recipes[index]))
      .subscribe((recipe) => {
        return recipe;
      });
    // return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    // this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.store.dispatch(new RecipeActions.AddRecipe(recipe));
    // this.recipes.push(recipe);
    // this.recipesChanged.next(this.getRecipes());
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.store.dispatch(new RecipeActions.UpdateRecipe({ index, recipe }));
    // this.recipes[index] = recipe;
    // this.recipesChanged.next(this.getRecipes());
  }

  removeRecipe(index: number) {
    this.store.dispatch(new RecipeActions.RemoveRecipe(index));
    // this.recipes.splice(index, 1);
    // this.recipesChanged.next(this.getRecipes());
  }

  saveRecipes() {
    return this.http.put<Recipe[]>(
      `${this.fireBaseURL}/recipes.json`,
      this.recipes
    );
  }

  loadRecipes() {
    return this.http.get<Recipe[]>(`${this.fireBaseURL}/recipes.json`).pipe(
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap((recipes) => {
        // this.recipes = recipes;
        this.store.dispatch(new RecipeActions.SetRecipes(recipes));
        // this.recipesChanged.next(this.getRecipes());
      })
    );
  }
}
