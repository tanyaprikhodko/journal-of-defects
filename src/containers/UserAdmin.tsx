import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useAuthStore } from '../store-auth';
import { useTableStore } from '../store-zustand';
import { User } from '../types';
import './styles/userAdmin.scss';
import 'react-toastify/dist/ReactToastify.css';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

type TabType = 'create' | 'edit' | 'delete';

const UserAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<TabType>('create');
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);

  const fetchUserById = useAuthStore(state => state.fetchUserById);
  const fetchUsers = useAuthStore(state => state.fetchUsers);
  const fetchRoles = useTableStore(state => state.fetchRoles);
  const fetchDepartments = useAuthStore(state => state.fetchDepartments);
  const addUser = useTableStore(state => state.addUser);
  const editUser = useTableStore(state => state.editUser);
  const deleteUser = useTableStore(state => state.deleteUser);
  
  const departments = useAuthStore(state => state.departments) || [];
  const users = useAuthStore(state => state.users) || [];
  const roles = useTableStore(state => state.roles) || [];

  const createDefaultUser = React.useCallback((): User => ({
    id: 0,
    name: '',
    email: '',
    secondEmail: '',
    login: '',
    password: '',
    rank: '',
    deputyId: null,
    regionId: '',
    roleIds: [],
    isActive: true,
    isLocked: false,
    userMessage: '',
    userRoles: [],
  }), []);

  const [userData, setUserData] = React.useState<User>(createDefaultUser());

  React.useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchRoles(), fetchDepartments(), fetchUsers()]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [fetchRoles, fetchDepartments, fetchUsers]);

  React.useEffect(() => {
    // Reset form when switching tabs
    setUserData(createDefaultUser());
    setSelectedUserId(null);
  }, [activeTab, createDefaultUser]);

  const handleChange = React.useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setUserData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleSelectChange = React.useCallback((
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleRoleChange = React.useCallback((roleId: number, checked: boolean) => {
    setUserData((prev) => ({
      ...prev,
      roleIds: checked
        ? [...prev.roleIds, roleId]
        : prev.roleIds.filter((id) => id !== roleId),
    }));
  }, []);

  const handleDeputyChange = React.useCallback((deputyId: number | null) => {
    setUserData((prev) => ({
      ...prev,
      deputyId: deputyId || null,
    }));
  }, []);

  const handleUserSelect = React.useCallback(async (userId: number) => {
    if (userId === 0 || !userId) {
      setSelectedUserId(null);
      setUserData(createDefaultUser());
      return;
    }
    
    setSelectedUserId(userId);
    setLoading(true);
    
    try {
      const user = await fetchUserById(userId);
      if (user) {
        const preparedData = {
          ...user,
          roleIds: user?.userRoles?.map(role => role.id) || []
        };
        setUserData(preparedData as User);
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      setUserData(createDefaultUser());
    } finally {
      setLoading(false);
    }
  }, [fetchUserById, createDefaultUser]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addUser(userData);
      setUserData(createDefaultUser());
      await fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error('Оберіть користувача для редагування');
      return;
    }
    try {
      setLoading(true);
      await editUser(selectedUserId, userData);
      await fetchUsers();
    } catch (error) {
      console.error('Error editing user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) {
      toast.error('Оберіть користувача для видалення');
      return;
    }
    
    if (!window.confirm(`Ви впевнені, що хочете видалити користувача "${userData.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteUser(selectedUserId);
      setUserData(createDefaultUser());
      setSelectedUserId(null);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/main-view');
  };

  return (
    <div className="user-admin-root">
      <div className="user-admin-header">
        <div className="user-admin-header__left">
          <span className="user-admin-header__icon" role="img" aria-label="users">👥</span>
          <span className="user-admin-header__title">Управління користувачами</span>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="user-admin-header__close"
          title="Закрити"
        >
          <span role="img" aria-label="close">✖️</span>
        </button>
      </div>

      <div className="user-admin-tabs">
        <button
          className={`user-admin-tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <span role="img" aria-label="create" style={{ marginRight: 8 }}>➕</span>
          Створити користувача
        </button>
        <button
          className={`user-admin-tab ${activeTab === 'edit' ? 'active' : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          <span role="img" aria-label="edit" style={{ marginRight: 8 }}>✏️</span>
          Редагувати користувача
        </button>
        <button
          className={`user-admin-tab ${activeTab === 'delete' ? 'active' : ''}`}
          onClick={() => setActiveTab('delete')}
        >
          <span role="img" aria-label="delete" style={{ marginRight: 8 }}>🗑️</span>
          Видалити користувача
        </button>
      </div>

      <div className="user-admin-content">
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}

        {/* CREATE TAB */}
        {activeTab === 'create' && (
          <form className="user-form" onSubmit={handleCreateUser}>
            <h3>Створення нового користувача</h3>
            
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="create-name">Ім'я *</label>
                <input
                  type="text"
                  id="create-name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="text-input"
                />
              </div>

              <div className="input-group">
                <label htmlFor="create-login">Логін *</label>
                <input
                  type="text"
                  id="create-login"
                  name="login"
                  value={userData.login}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="text-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="create-email">Email *</label>
                <input
                  type="email"
                  id="create-email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="text-input"
                />
              </div>

              <div className="input-group">
                <label htmlFor="create-secondEmail">Додатковий Email</label>
                <input
                  type="email"
                  id="create-secondEmail"
                  name="secondEmail"
                  value={userData.secondEmail}
                  onChange={handleChange}
                  disabled={loading}
                  className="text-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="create-password">Пароль *</label>
                <input
                  type="password"
                  id="create-password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="text-input"
                />
              </div>

              <div className="input-group">
                <label htmlFor="create-rank">Посада</label>
                <input
                  type="text"
                  id="create-rank"
                  name="rank"
                  value={userData.rank}
                  onChange={handleChange}
                  disabled={loading}
                  className="text-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="create-regionId">Регіон</label>
                <select
                  id="create-regionId"
                  name="regionId"
                  value={userData.regionId}
                  onChange={handleSelectChange}
                  disabled={loading}
                  className="select-input"
                >
                  <option value="">Оберіть регіон</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="create-deputyId">Заступник</label>
                <Autocomplete
                  id="create-deputyId"
                  options={users}
                  getOptionLabel={(option) => `${option.name} - ${option.rank || 'Без посади'}`}
                  value={users.find((user) => user.id === userData.deputyId) || null}
                  onChange={(_, value) => handleDeputyChange(value?.id || null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Оберіть заступника"
                      className="select-input"
                    />
                  )}
                  disabled={loading}
                  disableClearable={false}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Ролі</label>
              <div className="roles-checkboxes">
                {roles.map((role) => (
                  <label key={role.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={userData.roleIds.includes(role.id)}
                      onChange={(e) => handleRoleChange(role.id, e.target.checked)}
                      disabled={loading}
                    />
                    <span>{role.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={userData.isActive}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Активний</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isLocked"
                  checked={userData.isLocked}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Заблокований</span>
              </label>
            </div>

            <div className="input-group">
              <label htmlFor="create-userMessage">Повідомлення користувача</label>
              <textarea
                id="create-userMessage"
                name="userMessage"
                value={userData.userMessage}
                onChange={handleChange}
                disabled={loading}
                className="textarea-input"
                rows={3}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              <span role="img" aria-label="save" style={{ marginRight: 6 }}>💾</span>
              Створити користувача
            </button>
          </form>
        )}

        {/* EDIT TAB */}
        {activeTab === 'edit' && (
          <form className="user-form" onSubmit={handleEditUser}>
            <h3>Редагування користувача</h3>
            
            <div className="input-group">
              <label htmlFor="edit-userSelect">Оберіть користувача *</label>
              <Autocomplete
                id="edit-userSelect"
                options={users}
                getOptionLabel={(option) => option.name}
                value={users.find((user) => user.id === selectedUserId) || null}
                onChange={(_, value) => {
                  if (value) {
                    handleUserSelect(value.id);
                  } else {
                    handleUserSelect(0);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Оберіть користувача"
                    className="select-input"
                    style={{ width: '100%' }}
                  />
                )}
                disableClearable={false}
              />
            </div>

            {selectedUserId && (
              <>
                <div className="form-row">
                  <div className="input-group">
                    <label htmlFor="edit-name">Ім'я *</label>
                    <input
                      type="text"
                      id="edit-name"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="text-input"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="edit-login">Логін *</label>
                    <input
                      type="text"
                      id="edit-login"
                      name="login"
                      value={userData.login}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="text-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label htmlFor="edit-email">Email *</label>
                    <input
                      type="email"
                      id="edit-email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="text-input"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="edit-secondEmail">Додатковий Email</label>
                    <input
                      type="email"
                      id="edit-secondEmail"
                      name="secondEmail"
                      value={userData.secondEmail}
                      onChange={handleChange}
                      disabled={loading}
                      className="text-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label htmlFor="edit-password">Новий пароль (залиште порожнім, щоб не змінювати)</label>
                    <input
                      type="password"
                      id="edit-password"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                      disabled={loading}
                      className="text-input"
                      placeholder="Введіть новий пароль або залиште порожнім"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="edit-rank">Посада</label>
                    <input
                      type="text"
                      id="edit-rank"
                      name="rank"
                      value={userData.rank}
                      onChange={handleChange}
                      disabled={loading}
                      className="text-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label htmlFor="edit-regionId">Регіон</label>
                    <select
                      id="edit-regionId"
                      name="regionId"
                      value={userData.regionId}
                      onChange={handleSelectChange}
                      disabled={loading}
                      className="select-input"
                    >
                      <option value="">Оберіть регіон</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label htmlFor="edit-deputyId">Заступник</label>
                    <Autocomplete
                      id="edit-deputyId"
                      options={users}
                      getOptionLabel={(option) => `${option.name} - ${option.rank || 'Без посади'}`}
                      value={users.find((user) => user.id === userData.deputyId) || null}
                      onChange={(_, value) => handleDeputyChange(value?.id || null)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Оберіть заступника"
                          className="select-input"
                          style={{ height: '32px' }}
                        />
                      )}
                      disabled={loading}
                      disableClearable={false}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Ролі</label>
                  <div className="roles-checkboxes">
                    {roles.map((role) => (
                      <label key={role.id} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={userData.roleIds.includes(role.id)}
                          onChange={(e) => handleRoleChange(role.id, e.target.checked)}
                          disabled={loading}
                        />
                        <span>{role.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={userData.isActive}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span>Активний</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isLocked"
                      checked={userData.isLocked}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span>Заблокований</span>
                  </label>
                </div>

                <div className="input-group">
                  <label htmlFor="edit-userMessage">Повідомлення користувача</label>
                  <textarea
                    id="edit-userMessage"
                    name="userMessage"
                    value={userData.userMessage}
                    onChange={handleChange}
                    disabled={loading}
                    className="textarea-input"
                    rows={3}
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  <span role="img" aria-label="save" style={{ marginRight: 6 }}>💾</span>
                  Зберегти зміни
                </button>
              </>
            )}
          </form>
        )}

        {/* DELETE TAB */}
        {activeTab === 'delete' && (
          <div className="user-form">
            <h3>Видалення користувача</h3>
            
            <div className="input-group">
              <label htmlFor="delete-userSelect">Оберіть користувача для видалення *</label>
              <Autocomplete
                id="delete-userSelect"
                options={users}
                getOptionLabel={(option) => option.name}
                value={users.find((user) => user.id === selectedUserId) || null}
                onChange={(_, value) => {
                  if (value) {
                    handleUserSelect(value.id);
                  } else {
                    handleUserSelect(0);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Оберіть користувача"
                    className="select-input"
                    style={{ width: '100%' }}
                  />
                )}
                disableClearable={false}
              />
            </div>

            {selectedUserId && (
              <div className="user-preview">
                <h4>Деталі користувача:</h4>
                <div className="preview-row">
                  <strong>Ім'я:</strong> {userData.name}
                </div>
                <div className="preview-row">
                  <strong>Логін:</strong> {userData.login}
                </div>
                <div className="preview-row">
                  <strong>Email:</strong> {userData.email}
                </div>
                <div className="preview-row">
                  <strong>Посада:</strong> {userData.rank || 'Не вказано'}
                </div>
                <div className="preview-row">
                  <strong>Регіон:</strong> {departments.find(d => d.id === userData.regionId)?.name || 'Не вказано'}
                </div>
                <div className="preview-row">
                  <strong>Заступник:</strong> {users.find(u => u.id === userData.deputyId)?.name || 'Не вказано'}
                </div>
                <div className="preview-row">
                  <strong>Ролі:</strong> {userData.userRoles.map(r => r.name).join(', ') || 'Не вказано'}
                </div>
                <div className="preview-row">
                  <strong>Статус:</strong> 
                  <span className={userData.isActive ? 'status-active' : 'status-inactive'}>
                    {userData.isActive ? ' Активний' : ' Неактивний'}
                  </span>
                  {userData.isLocked && <span className="status-locked"> (Заблокований)</span>}
                </div>

                <div className="delete-warning">
                  <span role="img" aria-label="warning" style={{ marginRight: 8 }}>⚠️</span>
                  <strong>Увага!</strong> Після видалення користувача дані неможливо буде відновити.
                </div>

                <button 
                  type="button" 
                  className="delete-btn" 
                  onClick={handleDeleteUser}
                  disabled={loading}
                >
                  <span role="img" aria-label="delete" style={{ marginRight: 6 }}>🗑️</span>
                  Видалити користувача
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default UserAdmin;
