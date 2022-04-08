import { createSlice  } from '@reduxjs/toolkit'

const initialState = {
  name:"",
  id:"",
  entities: [],
  loading: false,
}

export const campaignDetailSlice = createSlice({
  name: "campaignDetails",
  initialState,
  reducers: {
    addCampaignName: (state, action) => {
      state.name = action.payload;
    },
    addCampaignId: (state, action) => {
      state.id = action.payload;
    }
  },
});

export const { addCampaignName, addCampaignId } = campaignDetailSlice.actions;
export default campaignDetailSlice.reducer;