import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getApiUrl } from '../config';
import { fetchWithAuth, parseErrorResponse } from '../utils';
import { DetailedUser } from '../types';
import './styles/profile.scss';

const ProfileContainer: React.FC = () => {
    const [profile, setProfile] = useState<DetailedUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await fetchWithAuth(`${getApiUrl()}/Users/me`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    const errorMessage = await parseErrorResponse(response);
                    toast.error(errorMessage);
                    return;
                }

                const data: DetailedUser = await response.json();
                setProfile(data);
            } catch (error) {
                console.error(error);
                toast.error('Не вдалося завантажити дані профілю');
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, []);

    return (
        <div className="profile-card">
            <h2>Мій профіль</h2>
            {isLoading && <div>Завантаження...</div>}
            {!isLoading && !profile && <div>Не вдалося завантажити дані профілю.</div>}
            {profile && (
                <div>
                    <div className="profile-row">
                        <div className="profile-label">Ім'я</div>
                        <div className="profile-value">{profile.name}</div>
                    </div>
                    <div className="profile-row">
                        <div className="profile-label">Логін</div>
                        <div className="profile-value">{profile.login}</div>
                    </div>
                    <div className="profile-row">
                        <div className="profile-label">Електронна пошта</div>
                        <div className="profile-value">{profile.email}</div>
                    </div>
                    {profile.secondEmail && (
                        <div className="profile-row">
                            <div className="profile-label">Додаткова пошта</div>
                            <div className="profile-value">{profile.secondEmail}</div>
                        </div>
                    )}
                    {profile.rank && (
                        <div className="profile-row">
                            <div className="profile-label">Звання</div>
                            <div className="profile-value">{profile.rank}</div>
                        </div>
                    )}
                    <div className="profile-row">
                        <div className="profile-label">Регіон</div>
                        <div className="profile-value">{profile.regionName ?? profile.regionId}</div>
                    </div>
                    <div className="profile-row">
                        <div className="profile-label">Ролі</div>
                        <div className="profile-value">{profile.userRoles.map((r) => r.name).join(', ') || '—'}</div>
                    </div>
                    <div className="profile-row">
                        <div className="profile-label">Статус</div>
                        <div className="profile-value">{profile.isActive ? 'Активний' : 'Неактивний'}</div>
                    </div>
                </div>
            )}
            <button className="profile-back-button" onClick={() => navigate('/main-view')}>
                Назад
            </button>
            <ToastContainer position="top-center" />
        </div>
    );
};

export default ProfileContainer;
