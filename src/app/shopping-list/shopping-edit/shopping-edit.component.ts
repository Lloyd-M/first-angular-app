import { AddIngredient } from './../store/shopping-list.actions';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form') shoppingListForm: NgForm;
  startedEditingSubscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.startedEditingSubscription = this.store
      .select('shoppingList')
      .subscribe((stateData) => {
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this.editedItem = stateData.editedIngredient;

          this.shoppingListForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount,
          });
        } else {
          this.editMode = false;
        }
      });
    // this.startedEditingSubscription = this.shoppingListService.startedEditingChanged.subscribe(
    //   (index: number) => {
    //     this.editMode = true;
    //     this.editedItemIndex = index;
    //     this.editedItem = this.shoppingListService.getIngredient(index);
    //     this.shoppingListForm.setValue({
    //       name: this.editedItem.name,
    //       amount: this.editedItem.amount,
    //     });
    //   }
    // );
  }

  onAdd(ingredient: Ingredient) {
    this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
    // this.shoppingListService.addIngredient(ingredient);
  }

  onUpdate(ingredient: Ingredient) {
    this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
    // this.shoppingListService.updateIngredient(index, ingredient);
  }

  onSubmit(form: NgForm) {
    const ingredient = new Ingredient(form.value.name, +form.value.amount);
    if (this.editMode) {
      this.onUpdate(ingredient);
    } else {
      this.onAdd(ingredient);
    }

    this.onClear();
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    // this.shoppingListService.removeIngredient(this.editedItemIndex);
    this.onClear();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  ngOnDestroy() {
    this.startedEditingSubscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
