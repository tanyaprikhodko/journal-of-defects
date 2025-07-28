import React, { useState } from 'react';
import { AuthUser, User, useAuthStore } from '../store-auth';
import { useTableStore } from '../store-zustand';
import './styles/UsersAdminModal.css';

type UsersAdminModalProps = {
  visible: boolean;
  users: AuthUser[];
  onClose: () => void;
  onSave: (user: User) => void;
  onAdd: (user: User) => void;
  onRemove: (userId: number) => void;
};

const UsersAdminModal: React.FC<UsersAdminModalProps> = ({
  visible,
  users,
  onClose,
  onSave,
  onRemove,
  onAdd,
}) => {
  // Create a stable default user inside the component
  const createDefaultUser = React.useCallback((): User => ({
    id: 0,
    name: '',
    email: '',
    secondEmail: '',
    login: '',
    password: '',
    rank: '',
    deputyId: 0,
    regionId: '',
    roleIds: [],
    isActive: true,
    isLocked: false,
    userMessage: '',
    userRoles: [],
  }), []);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userData, setUserData] = useState<User>(createDefaultUser);
  const [loading, setLoading] = useState(false);
  const isMountedRef = React.useRef(true);

  const fetchUserById = useAuthStore(state => state.fetchUserById);
  const fetchRoles = useTableStore(state => state.fetchRoles);
  const fetchDepartments = useAuthStore(state => state.fetchDepartments);
  const departments = useAuthStore(state => state.departments) || [];
  const roles = useTableStore(state => state.roles) || [];

  React.useEffect(() => {
    if (visible && isMountedRef.current) {
      const loadData = async () => {
        try {
          await Promise.all([fetchRoles(), fetchDepartments()]);
        } catch (error) {
          console.error('Error loading modal data:', error);
        }
      };
      loadData();
    }
  }, [visible, fetchRoles, fetchDepartments]); 

  // Cleanup effect to clear all data on unmount
  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleChange = React.useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!isMountedRef.current) return;
    
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setUserData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleSelectChange = React.useCallback((
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (!isMountedRef.current) return;
    
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Simple function to check if userData is default - using useMemo for stability
  const isDefaultUser = React.useMemo(() => {
    return userData.id === 0 && !userData.name && !userData.email && !userData.login;
  }, [userData.id, userData.name, userData.email, userData.login]);

  const handleRoleChange = React.useCallback((roleId: number, checked: boolean) => {
    if (isMountedRef.current) {
      setUserData((prev) => ({
        ...prev,
        roleIds: checked
          ? [...prev.roleIds, roleId]
          : prev.roleIds.filter((id) => id !== roleId),
      }));
    }
  }, []);

  const handleUserSelect = React.useCallback(async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    
    if (value === 0 || !value) {
      if (isMountedRef.current) {
        setSelectedUserId(null);
        setUserData(createDefaultUser());
      }
      return;
    }
    
    if (isMountedRef.current) {
      setSelectedUserId(value);
      setLoading(true);
    }
    
    try {
      const user = await fetchUserById(value);

      if (isMountedRef.current) {
        const preparedData = {
          ...user,
          roleIds: user?.userRoles?.map(role => role.id) || []
        };
        setUserData(preparedData as User);
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      if (isMountedRef.current) {
        setUserData(createDefaultUser());
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchUserById, createDefaultUser]);

  return (
    <div className={`modal ${visible ? 'modal-open' : ''}`}>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Управління користувачами</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-section">
            <div className="input-group">
              <label htmlFor="userSelect">Оберіть користувача</label>
              <select
                id="userSelect"
                value={selectedUserId ?? ''}
                onChange={handleUserSelect}
                className="select-input"
              >
                <option value="">Оберіть користувача</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )}

          {!loading && (
            <form className="user-form">
              <div className="input-group">
                <label htmlFor="name">Ім'я</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className="text-input"
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="text-input"
                />
              </div>

              <div className="input-group">
                <label htmlFor="secondEmail">Другий Email</label>
                <input
                  type="email"
                  id="secondEmail"
                  name="secondEmail"
                  value={userData.secondEmail}
                  onChange={handleChange}
                  disabled={loading}
                  className="text-input"
                />
              </div>

              <div className="input-group">
                <label htmlFor="login">Логін</label>
                <input
                  type="text"
                  id="login"
                  name="login"
                  value={userData.login}
                  onChange={handleChange}
                  disabled={loading}
                  className="text-input"
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Пароль</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="text-input"
                />
              </div>

              <div className="input-group">
                <label htmlFor="rank">Звання</label>
                <input
                  type="text"
                  id="rank"
                  name="rank"
                  value={userData.rank}
                  onChange={handleChange}
                  disabled={loading}
                  className="text-input"
                />
              </div>

            <div className="input-group">
              <label htmlFor="deputyId">Заступник</label>
              <select
                id="deputyId"
                name="deputyId"
                value={String(userData.deputyId)}
                onChange={handleSelectChange}
                disabled={loading}
                className="select-input"
              >
                <option value={0}>Оберіть заступника</option>
                {users
                  .filter((user) => user.id !== userData.id)
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
              </select>
            </div>

              <div className="input-group">
                <label htmlFor="roleIds">Роль</label>
                <div className="checkbox-group roles-checkbox-group">
                  {roles.map((role) => (
                    <label key={role.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        name="roleIds"
                        value={String(role.id)}
                        checked={userData.roleIds.includes(role.id)}
                        onChange={(e) => handleRoleChange(role.id, e.target.checked)}
                        disabled={loading}
                      />
                      <span className="checkbox-text">{role.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="regionId">Регіон</label>
                <select
                  id="regionId"
                  name="regionId"
                  value={userData.regionId}
                  onChange={handleSelectChange}
                  disabled={loading}
                  className="select-input"
                >
                  <option value="">Оберіть регіон</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={userData.isActive}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span className="checkbox-text">Активний</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isLocked"
                    checked={userData.isLocked}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span className="checkbox-text">Заблокований</span>
                </label>
              </div>

              <div className="input-group">
                <label htmlFor="userMessage">Повідомлення користувача</label>
                <textarea
                  id="userMessage"
                  name="userMessage"
                  value={userData.userMessage}
                  onChange={handleChange}
                  disabled={loading}
                  rows={4}
                  className="textarea-input"
                />
              </div>
            </form>
          )}
        </div>
        <div className="modal-footer">
          <button 
            className="btn btn-primary" 
            onClick={() => onAdd(userData)} 
            disabled={loading || isDefaultUser}
          >
            Додати нового користувача
          </button>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Закрити
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onSave(userData)}
            disabled={selectedUserId === null || loading}
          >
            Зберегти
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (selectedUserId !== null) {
                alert(`Видалити користувача з ID: ${selectedUserId}`);
                onRemove(selectedUserId);
              }
            }}
            disabled={selectedUserId === null || loading}
          >
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersAdminModal;
