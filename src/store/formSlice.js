import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fields: [],
  isDarkMode: false,
};

const savedState = localStorage.getItem('formBuilderState');
const parsedState = savedState ? JSON.parse(savedState) : initialState;

export const formSlice = createSlice({
  name: 'form',
  initialState: parsedState,
  reducers: {
    addField: (state, action) => {
      state.fields.push(action.payload);
      localStorage.setItem('formBuilderState', JSON.stringify(state));
    },
    updateField: (state, action) => {
      const index = state.fields.findIndex((f) => f.id === action.payload.id);
      if (index !== -1) {
        state.fields[index] = { ...state.fields[index], ...action.payload };
        localStorage.setItem('formBuilderState', JSON.stringify(state));
      }
    },
    removeField: (state, action) => {
      state.fields = state.fields.filter((f) => f.id !== action.payload);
      localStorage.setItem('formBuilderState', JSON.stringify(state));
    },
    reorderFields: (state, action) => {
      state.fields = action.payload;
      localStorage.setItem('formBuilderState', JSON.stringify(state));
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem('formBuilderState', JSON.stringify(state));
    },
  },
});

export const { addField, updateField, removeField, reorderFields, toggleDarkMode } = formSlice.actions;

export default formSlice.reducer;
