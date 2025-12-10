import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTableStore } from '../store-zustand';
import { useAuthStore } from '../store-auth';
import './styles/filtersModal.css';
import { FiltersModalProps } from '../types/components';


const FiltersModal: React.FC<FiltersModalProps> = ({
  open,
  onClose,
  onApply,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Parse filters from URL on mount
  const getFiltersFromUrl = () => {
    const filtersJson = searchParams.get('filters');
    if (filtersJson) {
      try {
        return JSON.parse(decodeURIComponent(filtersJson));
      } catch (e) {
        console.error('Error parsing filters from URL:', e);
        return {};
      }
    }
    return useTableStore.getState().appliedFilters || {};
  };

  const [values, setValues] = useState<{ [key: string]: string }>(getFiltersFromUrl());
  const objectTypes = useTableStore(state => state.objectTypes);
  const lookupPlaces = useTableStore(state => state.lookupPlaces);
  const users = useAuthStore(state => state.users);
  const substations = useTableStore(state => state.substations);

  const fetchObjectTypes = useTableStore(state => state.fetchObjectTypes);
  const fetchLookupPlaces = useTableStore(state => state.fetchLookupPlaces);
  const fetchUsers = useAuthStore(state => state.fetchUsers);
  const fetchSubstations = useTableStore(state => state.fetchSubstations);
  const setFilters = useTableStore(state => state.setFilters);
  const resetFilters = useTableStore(state => state.resetFilters);

  React.useEffect(() => {
    fetchObjectTypes();
    fetchLookupPlaces();
    fetchUsers();
    fetchSubstations();
  }, [fetchObjectTypes, fetchLookupPlaces, fetchUsers, fetchSubstations]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: typeof value === 'string' ? value : String(value),
    }));
  };

  // Update URL with filters
  const updateFiltersInUrl = (filters: { [key: string]: string }) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    // Remove empty filter values
    const cleanedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as { [key: string]: string });

    if (Object.keys(cleanedFilters).length > 0) {
      newSearchParams.set('filters', encodeURIComponent(JSON.stringify(cleanedFilters)));
    } else {
      newSearchParams.delete('filters');
    }
    
    // Reset to page 1 when applying filters
    newSearchParams.set('page', '1');
    
    setSearchParams(newSearchParams);
  };

  let isOpen = open;

  const handleApply = () => {
    setFilters(values);
    updateFiltersInUrl(values);
    onClose();
    isOpen = false;
    onApply();
  };

  const handleReset = () => {
    setValues({});
    resetFilters();
    
    // Remove filters from URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('filters');
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
    
    onApply();
  };

  return (
    <div className={`modal-backdrop ${isOpen ? 'open' : ''}`} onClick={() => {isOpen = false; onClose();}}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Фільтри</h2>
          <button
            onClick={() => {isOpen = false; onClose();}}
            className="close-button"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="form-container">
          <div className="form-field">
            <label htmlFor="Condition">Стан дефекту</label>
            <select
              id="Condition"
              name="Condition"
              value={values.Condition ?? ''}
              onChange={(e) => handleChange(e)}
              className="form-select"
            >
              <option value="">Всі стани</option>
              <option value="Внесений">Внесений</option>
              <option value="Розглянутий технічним керівником">
                Розглянутий технічним керівником
              </option>
              <option value="Прийнятий до виконання">
                Прийнятий до виконання
              </option>
              <option value="Усунутий">Усунутий</option>
              <option value="Протермінований">Протермінований</option>
              <option value="Прийнятий в експлуатацію">
                Прийнятий в експлуатацію
              </option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="Order">Номер</label>
            <input
              id="Order"
              name="Order"
              type="number"
              value={values.Order ?? ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="DateOfRegistration">Дата реєстрації</label>
            <input
              id="DateOfRegistration"
              name="DateOfRegistration"
              type="date"
              value={values.DateOfRegistration ?? ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="ObjectType">Тип об'єкта</label>
            <select
              id="ObjectType"
              name="ObjectType"
              value={values.ObjectType ?? ''}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Всі типи</option>
              {objectTypes && objectTypes.map((type: { id?: number; type: string }) => (
                <option key={type.id ?? type.type ?? type} value={type.id ?? type.type ?? type}>
                  {type.type}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="ObjectNumber">Номер об'єкта</label>
            <input
              id="ObjectNumber"
              name="ObjectNumber"
              type="number"
              value={values.ObjectNumber ?? ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          {/* Lookup Place select */}
          <div className="form-field">
            <label htmlFor="Place">Місце</label>
            <select
              id="Place"
              name="Place"
              value={values.Place ?? ''}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Всі місця</option>
              {lookupPlaces && lookupPlaces.map((place: { id?: number; name: string }) => (
                <option key={place.id ?? place.name ?? place} value={place.id ?? place.name ?? place}>
                  {place.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="Connection">Приєднання</label>
            <input
              id="Connection"
              name="Connection"
              value={values.Connection ?? ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="Description">Суть дефекту</label>
            <input
              id="Description"
              name="Description"
              value={values.Description ?? ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="MessageAuthor">Автор повідомлення</label>
            <select
              id="MessageAuthor"
              name="MessageAuthor"
              value={values.MessageAuthor ?? ''}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Всі автори</option>
              {users && users.map((user: { id: number; name: string }) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="Responsible">Відповідальний за усунення</label>
            <select
              id="Responsible"
              name="Responsible"
              value={values.Responsible ?? ''}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Всі відповідальні</option>
              {users && users.map((user: { id: number; name: string }) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="CompletionTerm">Термін виконання</label>
            <input
              id="CompletionTerm"
              name="CompletionTerm"
              type="date"
              value={values.CompletionTerm ?? ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="TechnicalManager">Технічний керівник</label>
            <select
              id="TechnicalManager"
              name="TechnicalManager"
              value={values.TechnicalManager ?? ''}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Всі керівники</option>
              {users && users.map((user: { id: number; name: string }) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="DateOfAcception">Дата прийняття</label>
            <input
              id="DateOfAcception"
              name="DateOfAcception"
              type="date"
              value={values.DateOfAcception ?? ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="AcceptionAuthor">Прийняв в експлуатацію</label>
            <select
              id="AcceptionAuthor"
              name="AcceptionAuthor"
              value={values.AcceptionAuthor ?? ''}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Всі</option>
              {users && users.map((user: { id: number; name: string }) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="DateOfCompletion">Дата виконання</label>
            <input
              id="DateOfCompletion"
              name="DateOfCompletion"
              type="date"
              value={values.DateOfCompletion ?? ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="CompletionAuthor">Виконав</label>
            <select
              id="CompletionAuthor"
              name="CompletionAuthor"
              value={values.CompletionAuthor ?? ''}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Всі</option>
              {users && users.map((user: { id: number; name: string }) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="ConfirmationAuthor">Прийняв до виконання</label>
            <select
              id="ConfirmationAuthor"
              name="ConfirmationAuthor"
              value={values.ConfirmationAuthor ?? ''}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Всі</option>
              {users && users.map((user: { id: number; name: string }) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="DateOfConfirmation">Дата прийняття до виконання</label>
            <input
              id="DateOfConfirmation"
              name="DateOfConfirmation"
              type="date"
              value={values.DateOfConfirmation ?? ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="Substation">Підстанція</label>
            <select
              id="Substation"
              name="Substation"
              value={values.Substation ?? ''}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Всі підстанції</option>
              {substations && substations.map((substation: { id?: string; name: string }) => (
                <option key={substation.id ?? substation.name ?? substation} value={substation.id ?? substation.name ?? substation}>
                  {substation.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleReset} className="btn btn-danger">Скинути</button>
          <button onClick={handleApply} className="btn btn-primary">
            Застосувати
          </button>
          <button onClick={onClose} className="btn btn-secondary">Закрити</button>
        </div>
      </div>
    </div>
  );
};

export default FiltersModal;