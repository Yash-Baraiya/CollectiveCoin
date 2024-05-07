import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as MembersActions from './members.action';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';

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
        this.http
          .get<allMembers>(
            'http://localhost:8000/api/v1/CollectiveCoin/user/getmembers'
          )
          .pipe(
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
        this.http
          .post(
            'http://localhost:8000/api/v1/CollectiveCoin/user/add-member',
            member
          )
          .pipe(
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
          .patch(
            `http://localhost:8000/api/v1/CollectiveCoin/user/delete-member/${id}`,
            {}
          )
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
        this.http
          .delete(
            `http://localhost:8000/api/v1/CollectiveCoin/user/deletefamily`,
            {}
          )
          .pipe(
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
        this.http
          .patch(
            `http://localhost:8000/api/v1/CollectiveCoin/user/makeadmin/${id}`,
            {}
          )
          .pipe(
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
        this.http
          .patch(
            `http://localhost:8000/api/v1/CollectiveCoin/user/makeearner/${id}`,
            {}
          )
          .pipe(
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
        this.http
          .post(
            `http://localhost:8000/api/v1/CollectiveCoin/user/sendmail`,
            bodyData
          )
          .pipe(
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
  private showErrorMessage(message: any) {
    this.snackBar.open(message || 'An error occurred', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
    });
  }
}
