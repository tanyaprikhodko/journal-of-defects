import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FormData {
    defectState: string;
    number: number | null; 
    createdAt: Date | '';
    object: string;
    substation: string;
    placeOfDefect: string;
    connection: string;
    essenceOfDefect: string;
    author: string;
    techLead: string;
    responsibleRorElimination: string;
    timeOfElimination: Date | '';
    dateOfAccepting: Date | '';
    acceptedPerson: string;
    dateOfElimination: Date | '';
    eliminated: string;
    dateOfStartExploitation: Date | '';
    acceptedExploitationPerson: string;
    moveTo: string;
    comments: Array<string>;
}

interface EditPageState {
  savedForms: {
    [key: string]: FormData
  }
}

export const initialFormData: FormData = {
    defectState: '',
    number: null,
    createdAt: '',
    object: '',
    substation: '',
    placeOfDefect: '',
    connection: '',
    essenceOfDefect: '',
    author: '',
    techLead: '',
    responsibleRorElimination: '',
    timeOfElimination: '',
    dateOfAccepting: '',
    acceptedPerson: '',
    dateOfElimination: '',
    eliminated: '',
    dateOfStartExploitation: '',
    acceptedExploitationPerson: '',
    moveTo: '',
    comments: [],
}

const initialState: EditPageState = {
  savedForms: {},
};

const editPageSlice = createSlice({
  name: 'editPage',
  initialState,
  reducers: {
    resetForm(state, action: PayloadAction<{ name: string }>) {
      state.savedForms[action.payload.name] = initialFormData;
    },

    saveForm(state, action: PayloadAction<{ name: string; form: FormData }>) {
      if (!state.savedForms) state.savedForms = {};
      state.savedForms[action.payload.name] = { ...action.payload.form };
    },
}
});

// Selector to get a saved form by name
export const { resetForm, saveForm } = editPageSlice.actions;
export default editPageSlice.reducer;
