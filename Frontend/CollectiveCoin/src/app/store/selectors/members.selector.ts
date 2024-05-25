import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MembersState } from './../reducer/members.reducer';

export const selectMembersState =
  createFeatureSelector<MembersState>('members');

export const selectMembers = createSelector(
  selectMembersState,
  (state: MembersState) => state.members
);
