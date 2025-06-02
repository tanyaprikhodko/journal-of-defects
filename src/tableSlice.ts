import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TableRow {
  Name: string;
  Age: string;
  Department: string;
}

interface TableState {
  data: TableRow[];
}

const initialState: TableState = {
  data: [
    { Name: 'John Doe', Age: '30', Department: 'HR' },
    { Name: 'Jane Smith', Age: '25', Department: 'IT' },
    { Name: 'Sam Johnson', Age: '35', Department: 'Finance' },
    { Name: 'Alice Brown', Age: '28', Department: 'Marketing' },
  ],
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setTableData(state, action: PayloadAction<TableRow[]>) {
      state.data = action.payload;
    },
    addTableRow(state, action: PayloadAction<TableRow>) {
      state.data.push(action.payload);
    },
    // Add more reducers as needed
  },
});

export const { setTableData, addTableRow } = tableSlice.actions;
export default tableSlice.reducer;
