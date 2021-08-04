import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from './../shared/placeholder.directive';
import { AuthService } from './auth.service';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;
  private storeSubscription: Subscription;
  private closeAlertSubscription: Subscription;

  constructor(
    // private authService: AuthService,
    // private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.storeSubscription = this.store
      .select('auth')
      .subscribe((authState) => {
        this.isLoading = authState.loading;
        this.error = authState.authError;

        if (this.error) {
          this.showErrorAlert(this.error);
        }
      });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    // this.error = null;
    // this.isLoading = true;
    // let authObs = new Observable<AuthResponse>();

    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      // authObs = this.authService.login(email, password);
      this.store.dispatch(new AuthActions.LoginStart({ email, password }));
    } else {
      // authObs = this.authService.signUp(email, password);
      this.store.dispatch(new AuthActions.SignupStart({ email, password }));
    }

    form.reset();

    // authObs.subscribe(
    // (response) => {
    // this.isLoading = false;
    // console.log(response);
    // this.router.navigate(['/recipes']);
    // },
    // (errorResponse) => {
    // this.isLoading = false;
    // this.error = errorResponse;
    // this.showErrorAlert(errorResponse);
    // }
    // );
  }

  onAlertClose() {
    this.store.dispatch(new AuthActions.ClearError());
    // this.error = null;
  }

  ngOnDestroy() {
    if (this.closeAlertSubscription) {
      this.closeAlertSubscription.unsubscribe();
    }
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }

  private showErrorAlert(errorMessage: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.alertMessage = errorMessage;
    this.closeAlertSubscription = componentRef.instance.alertClose.subscribe(
      () => {
        this.closeAlertSubscription.unsubscribe();
        hostViewContainerRef.clear();
        this.onAlertClose();
      }
    );
  }
}
