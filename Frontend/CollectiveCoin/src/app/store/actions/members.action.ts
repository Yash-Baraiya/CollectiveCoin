import { createAction, props } from '@ngrx/store';

export const loadMembers = createAction('[Members] Load Members');
export const loadMembersSuccess = createAction(
  '[Members] Load Members Success',
  props<{ members: any[] }>()
);
export const loadMembersFailure = createAction(
  '[Members] Load Members Failure',
  props<{ error: any }>()
);

export const addMember = createAction(
  '[Members] Add Member',
  props<{ member: any }>()
);
export const addMemberSuccess = createAction(
  '[Members] Add Member Success',
  props<{ member: any }>()
);
export const addMemberFailure = createAction(
  '[Members] Add Member Failure',
  props<{ error: any }>()
);

export const deleteMember = createAction(
  '[Members] Delete Member',
  props<{ id: string }>()
);
export const deleteMemberSuccess = createAction(
  '[Members] Delete Member Success',
  props<{ id: string }>()
);
export const deleteMemberFailure = createAction(
  '[Members] Delete Member Failure',
  props<{ error: any }>()
);

export const deleteFamily = createAction('[Members] Delete Family');
export const deleteFamilySuccess = createAction(
  '[Members] Delete Family Success'
);
export const deleteFamilyFailure = createAction(
  '[Members] Delete Family Failure',
  props<{ error: any }>()
);

export const emailAdmin = createAction(
  '[Members] Email Admin',
  props<{ bodyData: any }>()
);
export const emailAdminSuccess = createAction('[Members] Email Admin Success');
export const emailAdminFailure = createAction(
  '[Members] Email Admin Failure',
  props<{ error: any }>()
);

export const makeAdmin = createAction(
  '[Members] Make Admin',
  props<{ id: string }>()
);
export const makeAdminSuccess = createAction(
  '[Members] Make Admin Success',
  props<{ id: string }>()
);
export const makeAdminFailure = createAction(
  '[Members] Make Admin Failure',
  props<{ error: any }>()
);

export const makeEarner = createAction(
  '[Members] Make Earner',
  props<{ id: string }>()
);
export const makeEarnerSuccess = createAction(
  '[Members] Make Earner Success',
  props<{ id: string }>()
);
export const makeEarnerFailure = createAction(
  '[Members] Make Earner Failure',
  props<{ error: any }>()
);

export const cleareMemberStore = createAction('[Members] Member Store Cleared');
