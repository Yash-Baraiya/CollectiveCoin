import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as MembersActions from './members.action';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environment';

interface allMembers {
  status: string;
  members: any[];
  firstadmin: any;
}

@Injectable()
export class MembersEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private store: Store,
    private snackBar: MatSnackBar
  ) {}

  loadMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.loadMembers),
      switchMap(() =>
        this.http.get<allMembers>(`${environment.userApiUrl}/getmembers`).pipe(
          map((response: allMembers) =>
            MembersActions.loadMembersSuccess({ members: response.members })
          ),
          catchError((error) => {
            this.showErrorMessage(error.error.message);
            return of(MembersActions.loadMembersFailure({ error }));
          })
        )
      )
    )
  );

  addMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.addMember),
      switchMap(({ member }) =>
        this.http.post(`${environment.userApiUrl}/add-member`, member).pipe(
          map(() => MembersActions.addMemberSuccess({ member })),
          catchError((error) => {
            this.showErrorMessage(error.error.message);

            return of(MembersActions.addMemberFailure({ error }));
          })
        )
      )
    )
  );

  deleteMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.deleteMember),
      switchMap(({ id }) =>
        this.http
          .patch(`${environment.userApiUrl}/delete-member/${id}`, {})
          .pipe(
            map(() => MembersActions.deleteMemberSuccess({ id })),
            tap(() => {
              this.store.dispatch(MembersActions.loadMembers());
            }),
            catchError((error) => {
              this.showErrorMessage(error.error.message);
              return of(MembersActions.deleteMemberFailure({ error }));
            })
          )
      )
    )
  );

  deleteFamily$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.deleteFamily),
      switchMap(() =>
        this.http.delete(`${environment.userApiUrl}/deletefamily`, {}).pipe(
          map(() => MembersActions.deleteFamilySuccess()),
          tap(() => {
            this.router.navigate(['/login']);
          }),
          catchError((error) => {
            this.showErrorMessage(error.error.message);
            return of(MembersActions.deleteFamilyFailure({ error }));
          })
        )
      )
    )
  );

  makeAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.makeAdmin),
      switchMap(({ id }) =>
        this.http.patch(`${environment.userApiUrl}/makeadmin/${id}`, {}).pipe(
          map(() => MembersActions.makeAdminSuccess({ id })),
          tap(() => {
            this.store.dispatch(MembersActions.loadMembers());
          }),
          catchError((error) => {
            this.showErrorMessage(error.error.message);
            return of(MembersActions.makeAdminFailure({ error }));
          })
        )
      )
    )
  );

  makeEarner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.makeEarner),
      switchMap(({ id }) =>
        this.http.patch(`${environment.userApiUrl}/makeearner/${id}`, {}).pipe(
          map(() => MembersActions.makeEarnerSuccess({ id })),
          tap(() => {
            this.store.dispatch(MembersActions.loadMembers());
          }),

          catchError((error) => {
            this.showErrorMessage(error.error.message);
            return of(MembersActions.makeEarnerFailure({ error }));
          })
        )
      )
    )
  );

  emailAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.emailAdmin),
      switchMap(({ bodyData }) =>
        this.http.post(`${environment.userApiUrl}/sendmail`, bodyData).pipe(
          map(() => MembersActions.emailAdminSuccess()),
          tap(() => {
            this.store.dispatch(MembersActions.loadMembers());
          }),

          catchError((error) => {
            console.log(error.error.message);
            this.showErrorMessage(error.error.message);

            return of(MembersActions.emailAdminFailure({ error }));
          })
        )
      )
    )
  );
  private showErrorMessage(message: string) {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }
}
