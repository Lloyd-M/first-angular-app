import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { Injectable } from '@angular/core';

@Injectable()
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditingChanged = new Subject<number>();
  private ingredients: Ingredient[] = [
    new Ingredient('Jerk Sauce', 2),
    new Ingredient('Chicken', 1),
    new Ingredient('Tomato', 1),
    new Ingredient('Thyme', 1),
    new Ingredient('Browning', 1),
  ];

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  updateIngredient(index: number, ingredient: Ingredient) {
    this.ingredients[index] = ingredient;
    this.ingredientsChanged.next(this.getIngredients());
  }

  removeIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.getIngredients());
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.getIngredients());
  }
  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.getIngredients());
  }
}
