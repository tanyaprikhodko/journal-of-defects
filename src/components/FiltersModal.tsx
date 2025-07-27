import React, { useState } from 'react';
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import { useTableStore } from '../store-zustand';
import { useAuthStore } from '../store-auth';


type FiltersModalProps = {
  open: boolean;
  onClose: () => void;
  onApply: (filters: { [key: string]: string }) => void;
};

const initialValues = {};

const FiltersModal: React.FC<FiltersModalProps> = ({
  open,
  onClose,
  onApply,
}) => {

  const [values, setValues] = useState<{ [key: string]: string }>(initialValues);
  const objectTypes = useTableStore(state => state.objectTypes);
  const lookupPlaces = useTableStore(state => state.lookupPlaces);
  const users = useAuthStore(state => state.users);
  const substations = useTableStore(state => state.substations);

  const fetchObjectTypes = useTableStore(state => state.fetchObjectTypes);
  const fetchLookupPlaces = useTableStore(state => state.fetchLookupPlaces);
  const fetchUsers = useAuthStore(state => state.fetchUsers);
  const fetchSubstations = useTableStore(state => state.fetchSubstations);

  React.useEffect(() => {
    fetchObjectTypes();
    fetchLookupPlaces();
    fetchUsers();
    fetchSubstations();
  }, [fetchObjectTypes, fetchLookupPlaces, fetchUsers, fetchSubstations]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: typeof value === 'string' ? value : String(value),
    }));
  };

  let isOpen = open;

  const handleApply = () => {
    onApply(values);
    isOpen = false;
  };

  const handleReset = () => {
    setValues(initialValues);
    onClose();
    isOpen = false;
  };

  return (
    <Modal open={isOpen} onClose={() => (isOpen = false, onClose())}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          maxWidth: 600,
          maxHeight: '80vh',
          my: '10vh',
          mx: 'auto',
        }}
      >
        <Typography
          variant="h6"
          mb={2}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          Filter Options
          <Button
            onClick={() => {isOpen = false; onClose();}}
            sx={{
              color: '#000',
              fontSize: 24,
              marginLeft: 'auto',
            }}
            aria-label="Close"
          >
            ×
          </Button>
        </Typography>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxHeight: '50vh',
            overflowY: 'auto',
            justifyContent: 'space-between',
            padding: '8px',
          }}
        >
          <TextField
            select
            label="Стан дефекту"
            name="Condition"
            value={values.Condition ?? ''}
            onChange={handleChange}
            fullWidth
            placeholder="Оберіть стан дефекту"
            style={{ flex: '1 1 45%' }}
          >
            <MenuItem value="">Всі стани</MenuItem>
            <MenuItem value="Внесений">Внесений</MenuItem>
            <MenuItem value="Розглянутий технічним керівником">
              Розглянутий технічним керівником
            </MenuItem>
            <MenuItem value="Прийнятий до виконання">
              Прийнятий до виконання
            </MenuItem>
            <MenuItem value="Усунутий">Усунутий</MenuItem>
            <MenuItem value="Протермінований">Протермінований</MenuItem>
            <MenuItem value="Прийнятий в експлуатацію">
              Прийнятий в експлуатацію
            </MenuItem>
          </TextField>
          <TextField
            label="Номер"
            name="Order"
            type="number"
            value={values.Order ?? ''}
            onChange={handleChange}
            fullWidth
            style={{ flex: '1 1 45%' }}
          />
          <TextField
            label="Дата реєстрації"
            name="DateOfRegistration"
            type="date"
            value={values.DateOfRegistration ?? ''}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ flex: '1 1 45%' }}
          />
          <TextField
            select
            label="Тип об'єкта"
            name="ObjectType"
            value={values.ObjectType ?? ''}
            onChange={handleChange}
            fullWidth
            style={{ flex: '1 1 45%' }}
            placeholder="Оберіть тип об'єкта"
          >
            <MenuItem value="">Всі типи</MenuItem>
            {objectTypes && objectTypes.map((type: { id?: number; type: string }) => (
              <MenuItem key={type.id ?? type.type ?? type} value={type.id ?? type.type ?? type}>
                {type.type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Номер об'єкта"
            name="ObjectNumber"
            type="number"
            value={values.ObjectNumber ?? ''}
            onChange={handleChange}
            fullWidth
            style={{ flex: '1 1 45%' }}
          />
          {/* Lookup Place select */}
          <TextField
            select
            label="Місце"
            name="Place"
            value={values.Place ?? ''}
            onChange={handleChange}
            fullWidth
            style={{ flex: '1 1 45%' }}
            placeholder="Оберіть місце"
          >
            <MenuItem value="">Всі місця</MenuItem>
            {lookupPlaces && lookupPlaces.map((place: { id?: number; name: string }) => (
              <MenuItem key={place.id ?? place.name ?? place} value={place.id ?? place.name ?? place}>
                {place.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Приєднання"
            name="Connection"
            value={values.Connection ?? ''}
            onChange={handleChange}
            fullWidth
            style={{ flex: '1 1 45%' }}
          />
          <TextField
            label="Суть дефекту"
            name="Description"
            value={values.Description ?? ''}
            onChange={handleChange}
            fullWidth
            style={{ flex: '1 1 45%' }}
          />
          <TextField
            select
            label="Автор повідомлення"
            name="MessageAuthor"
            value={values.MessageAuthor ?? ''}
            onChange={handleChange}
            fullWidth
            style={{ flex: '1 1 45%' }}
            placeholder="Оберіть автора"
          >
            <MenuItem value="">Всі автори</MenuItem>
            {users && users.map((user: { id: number; name: string }) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Відповідальний за усунення"
            name="Responsible"
            value={values.Responsible ?? ''}
            onChange={handleChange}
            fullWidth
            style={{ flex: '1 1 45%' }}
            placeholder="Оберіть відповідального"
          >
            <MenuItem value="">Всі відповідальні</MenuItem>
            {users && users.map((user: { id: number; name: string }) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Термін виконання"
            name="CompletionTerm"
            type="date"
            value={values.CompletionTerm ?? ''}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ flex: '1 1 45%' }}
          />
          <TextField
            select
            label="Технічний керівник"
            name="TechnicalManager"
            value={values.TechnicalManager ?? ''}
            onChange={handleChange}
            fullWidth
            style={{ flex: '1 1 45%' }}
            placeholder="Оберіть технічного керівника"
          >
            <MenuItem value="">Всі керівники</MenuItem>
            {users && users.map((user: { id: number; name: string }) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Дата прийняття"
            name="DateOfAcception"
            type="date"
            value={values.DateOfAcception ?? ''}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ flex: '1 1 45%' }}
          />
          <TextField
            select
            label="Прийняв в експлуатацію"
            name="AcceptionAuthor"
            value={values.AcceptionAuthor ?? ''}
            onChange={handleChange}
            fullWidth
            style={{ flex: '1 1 45%' }}
            placeholder="Оберіть прийнявшого"
          >
            <MenuItem value="">Всі</MenuItem>
            {users && users.map((user: { id: number; name: string }) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Дата виконання"
            name="DateOfCompletion"
            type="date"
            value={values.DateOfCompletion ?? ''}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ flex: '1 1 45%' }}
          />
          <TextField
            select
            label="Виконав"
            name="CompletionAuthor"
            value={values.CompletionAuthor ?? ''}
            onChange={handleChange}
            fullWidth
            style={{ flex: '1 1 45%' }}
            placeholder="Оберіть виконавця"
          >
            <MenuItem value="">Всі</MenuItem>
            {users && users.map((user: { id: number; name: string }) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Прийняв до виконання"
            name="ConfirmationAuthor"
            value={values.ConfirmationAuthor ?? ''}
            onChange={handleChange}
            fullWidth
            style={{ flex: '1 1 45%' }}
            placeholder="Оберіть підтверджуючого"
          >
            <MenuItem value="">Всі</MenuItem>
            {users && users.map((user: { id: number; name: string }) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Дата прийняття до виконання"
            name="DateOfConfirmation"
            type="date"
            value={values.DateOfConfirmation ?? ''}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ flex: '1 1 45%' }}
          />
          <TextField
            select
            label="Підстанція"
            name="Substation"
            value={values.Substation ?? ''}
            onChange={handleChange}
            fullWidth
            style={{ flex: '1 1 45%' }}
            placeholder="Оберіть підстанцію"
          >
            <MenuItem value="">Всі підстанції</MenuItem>
            {substations && substations.map((substation: { id?: string; name: string }) => (
              <MenuItem key={substation.id ?? substation.name ?? substation} value={substation.id ?? substation.name ?? substation}>
                {substation.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <Box
          mt={3}
          display="flex"
          justifyContent="flex-end"
          gap={2}
          width="100%"
        >
          <Button onClick={handleReset}>Reset</Button>
          <Button variant="contained" onClick={handleApply}>
            Apply
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FiltersModal;