import { AuthService } from './../auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { environment } from './../../../environments/environment';
import * as AuthActions from './auth.actions';
import { User } from '../user.model';

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  @Effect() authSignUp = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponse>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp',
          {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true,
          },
          {
            params: { key: environment.fireBase.APIKey },
          }
        )
        .pipe(
          map((response) => {
            return this.handleAuthentication(
              response.email,
              response.localId,
              response.idToken,
              +response.expiresIn
            );
          }),
          catchError((error) => {
            return this.handleError(error);
          })
        );
    })
  );

  @Effect() authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponse>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          },
          {
            params: { key: environment.fireBase.APIKey },
          }
        )
        .pipe(
          map((response) => {
            return this.handleAuthentication(
              response.email,
              response.localId,
              response.idToken,
              +response.expiresIn
            );
          }),
          catchError((error) => {
            return this.handleError(error);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: Date;
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return { type: '_dummy' };
      }

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );

      if (loadedUser.token) {
        this.authService.setLogoutTimer(
          loadedUser.tokenExpirationDate.getTime() - new Date().getTime()
        );
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(loadedUser.tokenExpirationDate),
          redirect: false,
        });

        // this.autoLogout(
        //   new Date(loadedUser.tokenExpirationDate).getTime() -
        //     new Date().getTime()
        // );
      }

      return { type: '_dummy' };
    })
  );

  handleAuthentication = (
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    this.authService.setLogoutTimer(expiresIn * 1000);
    return new AuthActions.AuthenticateSuccess({
      email,
      userId,
      token,
      expirationDate,
      redirect: true,
    });
  };

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (
      errorResponse.error &&
      errorResponse.error.error &&
      errorResponse.error.error.errors
    ) {
      switch (errorResponse.error.error.errors[0].message) {
        case 'EMAIL_NOT_FOUND':
        case 'INVALID_EMAIL':
          errorMessage = 'Email not found';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'Invalid password';
          break;
        case 'USER_DISABLED':
          errorMessage = 'Account disabled';
          break;
        case 'EMAIL_EXISTS':
          errorMessage = 'This email exists already';
          break;
        case 'OPERATION_NOT_ALLOWED':
          errorMessage = 'Password sign-in is disabled';
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          errorMessage =
            'We have blocked all requests from this device due to unusual activity. Try again later.';
          break;
      }
    }
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
