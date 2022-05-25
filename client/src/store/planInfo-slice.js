import { createSlice } from '@reduxjs/toolkit';

const planInfoSlice = createSlice({
  name: 'planInfo',
  initialState: { planInfo: [] },
  reducers: {
    checkPlanInfo(state) {
      state.planInfo = sessionStorage.getItem('planInfo');
    },
    setPlanInfo(state, action) {
      console.log('action.payload', action.payload);
      state.planInfo = action.payload;
    },
  },
});

export const planInfoActions = planInfoSlice.actions;

export default planInfoSlice;
