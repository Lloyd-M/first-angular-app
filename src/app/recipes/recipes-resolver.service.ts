import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap, take } from 'rxjs/operators';

import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.model';

import * as fromApp from '../store/app.reducer';
import * as RecipeActions from './store/recipe.actions';
import { Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('recipes').pipe(
      take(1),
      map((recipeState) => {
        return recipeState.recipes;
      }),
      switchMap((recipes) => {
        if (recipes.length === 0) {
          this.store.dispatch(new RecipeActions.LoadRecipe());
          return this.actions$.pipe(ofType(RecipeActions.SET_RECIPES), take(1));
        } else {
          return of(recipes);
        }
      })
    );

    // return this.store
    //   .select('recipes')
    //   .pipe(
    //     map((recipeState) => {
    //       return recipeState.recipes;
    //     })
    //   )
    //   .subscribe((recipes) => {
    //     return recipes;
    //   });
    // const recipes = this.recipeService.getRecipes();
    // if (recipes.length > 0) {
    //   return recipes;
    // }
    // return this.recipeService.loadRecipes();
  }
}
