import { Action, createReducer, on } from '@ngrx/store';
import * as MembersActions from '../../store/actions/members.action';

export interface MembersState {
  members: any[];
  loading: boolean;
  error: any;
}

export interface AppState {
  members: MembersState;
}

const initialState: MembersState = {
  members: [],
  loading: false,
  error: null,
};

export const membersReducer = createReducer(
  initialState,
  on(MembersActions.loadMembers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MembersActions.loadMembersSuccess, (state, { members }) => ({
    ...state,
    members: members,
  })),
  on(MembersActions.loadMembersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(MembersActions.addMemberSuccess, (state, { member }) => ({
    ...state,
  })),
  on(MembersActions.deleteMemberSuccess, (state, { id }) => ({
    ...state,
    members: state.members.filter((member) => member._id !== id),
  })),
  on(MembersActions.deleteFamilySuccess, (state) => ({
    ...state,
    members: [],
  })),
  on(MembersActions.makeAdminSuccess, (state, { id }) => ({
    ...state,
    members: state.members.map((member) => {
      if (id === member._id) {
        console.log(member);
        return { ...member, role: member.role === 'user' ? 'admin' : 'user' };
      }

      return member;
    }),
  })),
  on(MembersActions.makeEarnerSuccess, (state, { id }) => ({
    ...state,
    members: state.members.map((member) => {
      if (member._id === id) {
        return { ...member, isEarning: !member.isEarning };
      }
      return member;
    }),
  })),
  on(MembersActions.emailAdminSuccess, (state) => ({
    ...state,
    members: state.members,
  })),
  on(MembersActions.emailAdminFailure, (state) => ({
    ...state,
    members: state.members,
  }))
);

export function reducer(state: MembersState | undefined, action: Action) {
  return membersReducer(state, action);
}
