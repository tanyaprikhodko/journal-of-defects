import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";

// type FilterValues = {
//   Condition?: number;
//   Order?: number;
//   DateOfRegistration?: string;
//   ObjectType?: number;
//   ObjectNumber?: number;
//   Place?: number;
//   Connection?: string;
//   Description?: string;
//   MessageAuthor?: number;
//   Responsible?: number;
//   CompletionTerm?: string;
//   TechnicalManager?: number;
//   DateOfAcception?: string;
//   AcceptionAuthor?: number;
//   DateOfCompletion?: string;
//   CompletionAuthor?: number;
//   ConfirmationAuthor?: number;
//   DateOfConfirmation?: string;
//   Substation?: number;
//   ItemsPerPage?: number;
// };

type FiltersModalProps = {
  open: boolean;
  onClose: () => void;
  onApply: (filters: { [key: string]: string  }) => void;
};

const initialValues = {};

const FiltersModal: React.FC<FiltersModalProps> = ({
  open,
  onClose,
  onApply,
}) => {
  const [values, setValues] = useState<{ [key: string]: string }>(initialValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: typeof value === "string" ? value : String(value),
    }));
  };

  const handleApply = () => {
    onApply(values);
    onClose();
  };

  const handleReset = () => {
    setValues(initialValues);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          maxWidth: 600,
          maxHeight: "80vh",
          my: "10vh",
          mx: "auto",
        }}
      >
        <Typography variant="h6" mb={2}>
          Filter Options
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxHeight: "50vh",
            overflowY: "auto",
            justifyContent: "space-between",
            padding: "8px",
          }}
        >
          <TextField
            select
            label="Стан дефекту"
            name="Condition"
            value={values.Condition ?? ""}
            onChange={handleChange}
            fullWidth
            placeholder="Оберіть стан дефекту"
            style={{ flex: "1 1 45%" }}
          >
            <option value="">
              Всі стани
            </option>
            <option value="Внесений">Внесений</option>
            <option value="Розглянутий технічним керівником">Розглянутий технічним керівником</option>
            <option value="Прийнятий до виконання">Прийнятий до виконання</option>
            <option value="Усунутий">Усунутий</option>
            <option value="Протермінований">Протермінований</option>
            <option value="Прийнятий в експлуатацію">Прийнятий в експлуатацію</option>
          </TextField>
          <TextField
            label="Номер"
            name="Order"
            type="number"
            value={values.Order ?? ""}
            onChange={handleChange}
            fullWidth
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Дата реєстрації"
            name="DateOfRegistration"
            type="date"
            value={values.DateOfRegistration ?? ""}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Тип об'єкта"
            name="ObjectType"
            type="number"
            value={values.ObjectType ?? ""}
            onChange={handleChange}
            fullWidth
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Номер об'єкта"
            name="ObjectNumber"
            type="number"
            value={values.ObjectNumber ?? ""}
            onChange={handleChange}
            fullWidth
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Місце"
            name="Place"
            type="number"
            value={values.Place ?? ""}
            onChange={handleChange}
            fullWidth
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="З'єднання"
            name="Connection"
            value={values.Connection ?? ""}
            onChange={handleChange}
            fullWidth
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Суть дефекту"
            name="Description"
            value={values.Description ?? ""}
            onChange={handleChange}
            fullWidth
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Автор повідомлення"
            name="MessageAuthor"
            type="number"
            value={values.MessageAuthor ?? ""}
            onChange={handleChange}
            fullWidth
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Відповідальний"
            name="Responsible"
            type="number"
            value={values.Responsible ?? ""}
            onChange={handleChange}
            fullWidth
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Термін виконання"
            name="CompletionTerm"
            type="date"
            value={values.CompletionTerm ?? ""}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Технічний керівник"
            name="TechnicalManager"
            type="number"
            value={values.TechnicalManager ?? ""}
            onChange={handleChange}
            fullWidth
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Дата прийняття"
            name="DateOfAcception"
            type="date"
            value={values.DateOfAcception ?? ""}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Прийняв"
            name="AcceptionAuthor"
            type="number"
            value={values.AcceptionAuthor ?? ""}
            onChange={handleChange}
            fullWidth
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Дата виконання"
            name="DateOfCompletion"
            type="date"
            value={values.DateOfCompletion ?? ""}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Виконав"
            name="CompletionAuthor"
            type="number"
            value={values.CompletionAuthor ?? ""}
            onChange={handleChange}
            fullWidth
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Confirmation Author"
            name="ConfirmationAuthor"
            type="number"
            value={values.ConfirmationAuthor ?? ""}
            onChange={handleChange}
            fullWidth
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Date Of Confirmation"
            name="DateOfConfirmation"
            type="date"
            value={values.DateOfConfirmation ?? ""}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Підстанція"
            name="Substation"
            type="number"
            value={values.Substation ?? ""}
            onChange={handleChange}
            fullWidth
            style={{ flex: "1 1 45%" }}
          />
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