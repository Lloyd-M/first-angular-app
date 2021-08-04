import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError, tap } from 'rxjs/operators';

import { User } from './user.model';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  constructor(
    // private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  setLogoutTimer(expirationDuration: number) {
    console.log(expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }
  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  // signUp(email: string, password: string) {
  //   return this.http
  //     .post<AuthResponse>(
  //       'https://identitytoolkit.googleapis.com/v1/accounts:signUp',
  //       {
  //         email,
  //         password,
  //         returnSecureToken: true,
  //       },
  //       {
  //         params: { key: this.apiKey },
  //       }
  //     )
  //     .pipe(
  //       catchError(this.handleError),
  //       tap((response) => {
  //         this.handleAuthentication(
  //           response.email,
  //           response.localId,
  //           response.idToken,
  //           +response.expiresIn
  //         );
  //       })
  //     );
  // }

  // login(email: string, password: string) {
  //   return this.http
  //     .post<AuthResponse>(
  //       'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
  //       {
  //         email,
  //         password,
  //         returnSecureToken: true,
  //       },
  //       {
  //         params: { key: this.apiKey },
  //       }
  //     )
  //     .pipe(
  //       catchError(this.handleError),
  //       tap((response) => {
  //         this.handleAuthentication(
  //           response.email,
  //           response.localId,
  //           response.idToken,
  //           +response.expiresIn
  //         );
  //       })
  //     );
  // }

  // logout() {
  //   this.store.dispatch(new AuthActions.Logout());
  //   // this.user.next(null);
  //   localStorage.removeItem('userData');
  //   if (this.tokenExpirationTimer) {
  //     clearTimeout(this.tokenExpirationTimer);
  //   }
  //   this.tokenExpirationTimer = null;
  // }

  // autoLogin() {
  //   const userData: {
  //     email: string;
  //     id: string;
  //     _token: string;
  //     _tokenExpirationDate: Date;
  //   } = JSON.parse(localStorage.getItem('userData'));
  //   if (!userData) {
  //     return;
  //   }

  //   const loadedUser = new User(
  //     userData.email,
  //     userData.id,
  //     userData._token,
  //     new Date(userData._tokenExpirationDate)
  //   );

  //   if (loadedUser.token) {
  //     this.store.dispatch(
  //       new AuthActions.AuthenticateSuccess({
  //         email: loadedUser.email,
  //         userId: loadedUser.id,
  //         token: loadedUser.token,
  //         expirationDate: new Date(loadedUser.tokenExpirationDate),
  //       })
  //     );
  //     // this.user.next(loadedUser);
  //     this.autoLogout(
  //       new Date(loadedUser.tokenExpirationDate).getTime() -
  //         new Date().getTime()
  //     );
  //   }
  // }

  // private handleAuthentication(
  //   email: string,
  //   localId: string,
  //   idToken: string,
  //   expiresIn: number
  // ) {
  //   const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  //   const user = new User(email, localId, idToken, expirationDate);
  //   this.store.dispatch(
  //     new AuthActions.AuthenticateSuccess({
  //       email,
  //       userId: localId,
  //       token: idToken,
  //       expirationDate,
  //     })
  //   );
  //   // this.user.next(user);
  //   this.autoLogout(expiresIn * 1000);
  //   localStorage.setItem('userData', JSON.stringify(user));
  // }
  // private handleError(errorResponse: HttpErrorResponse) {
  //   let errorMessage = 'An error occurred';
  //   if (
  //     errorResponse.error &&
  //     errorResponse.error.error &&
  //     errorResponse.error.error.errors
  //   ) {
  //     switch (errorResponse.error.error.errors[0].message) {
  //       case 'EMAIL_NOT_FOUND':
  //       case 'INVALID_EMAIL':
  //         errorMessage = 'Email not found';
  //         break;
  //       case 'INVALID_PASSWORD':
  //         errorMessage = 'Invalid password';
  //         break;
  //       case 'USER_DISABLED':
  //         errorMessage = 'Account disabled';
  //         break;
  //       case 'EMAIL_EXISTS':
  //         errorMessage = 'This email exists already';
  //         break;
  //       case 'OPERATION_NOT_ALLOWED':
  //         errorMessage = 'Password sign-in is disabled';
  //         break;
  //       case 'TOO_MANY_ATTEMPTS_TRY_LATER':
  //         errorMessage =
  //           'We have blocked all requests from this device due to unusual activity. Try again later.';
  //         break;
  //     }
  //   }
  //   return throwError(errorMessage);
  // }
}
