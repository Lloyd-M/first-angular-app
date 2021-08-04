import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { User } from './../auth/user.model';
import { AuthService } from './../auth/auth.service';
import { RecipeService } from './../recipes/recipe.service';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './../auth/store/auth.actions';
import * as RecipeActions from './../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  isAuthenticated = false;
  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.isAuthenticated = !!user;
      });
  }

  onSaveRecipes() {
    this.store.dispatch(new RecipeActions.SaveRecipe());
    // this.recipeService.saveRecipes().subscribe((response) => {});
  }

  onLoadRecipes() {
    this.store.dispatch(new RecipeActions.LoadRecipe());
    // this.recipeService.loadRecipes().subscribe();
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
    // this.authService.logout();
    // this.router.navigate(['/auth']);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
