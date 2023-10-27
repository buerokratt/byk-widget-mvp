import { createSlice } from '@reduxjs/toolkit';
import { endChat } from './chat-slice';

export interface WidgetState {
  showConfirmationModal: boolean;
}

const initialState: WidgetState = {
  showConfirmationModal: false,
};

export const widgetSlice = createSlice({
  name: 'widget',
  initialState,
  reducers: {
    showConfirmationModal: (state) => {
      state.showConfirmationModal = true;
    },
    closeConfirmationModal: (state) => {
      state.showConfirmationModal = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(endChat.pending, (state) => {
      state.showConfirmationModal = false;
    });
  },
});

export const { showConfirmationModal, closeConfirmationModal } = widgetSlice.actions;

export default widgetSlice.reducer;
