import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/help.scss';
import selectREM from '../assets/help_images/selectREM.png';
import selectUser from '../assets/help_images/selectUser.png';
import typePassword from '../assets/help_images/typePassword.png';
import verifyTable from '../assets/help_images/verifyTable.png';
import editJournal from '../assets/help_images/editJournal.png';
import selectAction from '../assets/help_images/selectAction.png';
import selectJournalAfretAction from '../assets/help_images/selectJournalAfretAction.png';
import refresh from '../assets/help_images/refresh.png';
import navigateBetweenPages from '../assets/help_images/navigateBetweenPages.png';
import search from '../assets/help_images/search.png';
import sortByColumn from '../assets/help_images/sortByColumn.png';
import sortAscDesc from '../assets/help_images/sortAscDesc.png';
import filter from '../assets/help_images/filter.png';
import filterIndicator from '../assets/help_images/filterIndicator.png';
import clickCreate from '../assets/help_images/clickCreate.png';
import newJournalCreation from '../assets/help_images/newJournalCreation.png';
import newJournalInTable from '../assets/help_images/newJournalInTable.png';
import usersBtn from '../assets/help_images/usersBtn.png';
import createUser from '../assets/help_images/createUser.png';
import editUser from '../assets/help_images/editUser.png';
import deleteUser from '../assets/help_images/deleteUser.png';

type GuideSection = {
    title: string;
    howToTitle: string;
    intro: string;
    steps: {
        text: string;
        image: string;
        alt: string;
        extraImages?: {
            image: string;
            alt: string;
        }[];
    }[];
};

const guideSections: GuideSection[] = [
    {
        title: '1. Вхід до системи',
        howToTitle: 'Як увійти в систему',
        intro: 'Виконайте кроки нижче, щоб авторизуватися в Журналі дефектів.',
        steps: [
            {
                text: 'Відкрийте сторінку входу та оберіть РЕМ у полі списку.',
                image: selectREM,
                alt: 'Крок 1: вибір РЕМ',
            },
            {
                text: 'Після вибору РЕМ оберіть користувача зі списку доступних користувачів.',
                image: selectUser,
                alt: 'Крок 2: вибір користувача',
            },
            {
                text: 'Введіть пароль та натисніть Увійти.',
                image: typePassword,
                alt: 'Крок 3: введення пароля',
            },
            {
                text: 'Після успішного входу перевірте, що відкрилась головна сторінка таблиці.',
                image: verifyTable,
                alt: 'Крок 4: перехід на головну сторінку',
            },
        ],
    },
    {
        title: '2. Робота з головною таблицею',
        howToTitle: 'Як працювати з головною таблицею',
        intro: 'Ці кроки допоможуть швидко знайти потрібний запис та виконати дію.',
        steps: [
            {
                text: 'На головній сторінці перегляньте список записів та знайдіть потрібний рядок.',
                image: verifyTable,
                alt: 'Крок 1: перегляд таблиці',
            },
            {
                text: 'Якщо просто клікнути по рядку, одразу відкриється сторінка редагування.',
                image: editJournal,
                alt: 'Крок 2: швидкий перехід у редагування',
            },
            {
                text: 'Для іншої дії спочатку натисніть потрібну кнопку у хедері (наприклад, Створити копію або Видалити).',
                image: selectAction,
                alt: 'Крок 3: вибір дії у хедері',
            },
            {
                text: 'Після цього виберіть потрібний рядок у таблиці.',
                image: selectJournalAfretAction,
                alt: 'Крок 4: вибір рядка після вибору дії',
            },
            {
                text: 'Скористайтесь кнопкою Оновити, якщо потрібно повторно завантажити дані.',
                image: refresh,
                alt: 'Крок 5: оновлення таблиці',
            },
            {
                text: 'Перемикайте сторінки кнопками вперед/назад.',
                image: navigateBetweenPages,
                alt: 'Крок 6: пагінація таблиці',
            },
        ],
    },
    {
        title: '3. Пошук, сортування та фільтри',
        howToTitle: 'Як шукати, сортувати та фільтрувати записи',
        intro: 'Використовуйте пошук і фільтри, щоб швидко отримати потрібну вибірку.',
        steps: [
            {
                text: 'Введіть текст у поле Пошук, щоб знайти записи за ключовими словами.',
                image: search,
                alt: 'Крок 1: використання пошуку',
            },
            {
                text: 'Відкрийте панель сортування та оберіть колонку і напрямок сортування.',
                image: sortByColumn,
                alt: 'Крок 2: налаштування сортування',
                extraImages: [
                    {
                        image: sortAscDesc,
                        alt: 'Крок 2: вибір напряму сортування',
                    },
                ],
            },
            {
                text: 'Натисніть Фільтр, заповніть потрібні критерії та застосуйте їх.',
                image: filter,
                alt: 'Крок 3: застосування фільтрів',
            },
            {
                text: 'Перевірте індикатор активного фільтра та результат у таблиці.',
                image: filterIndicator,
                alt: 'Крок 4: перевірка результату фільтрації',
            },
        ],
    },
    {
        title: '4. Створення запису',
        howToTitle: 'Як створити новий запис дефекту',
        intro: 'Дотримуйтесь послідовності дій, щоб коректно створити дефект.',
        steps: [
            {
                text: 'Натисніть кнопку Створити у верхній панелі.',
                image: clickCreate,
                alt: 'Крок 1: відкриття форми створення',
            },
            {
                text: 'Заповніть обʼєкт, підстанцію, місце дефекту та технічний опис. Перевірте коректність даних та натисніть зберегти.',
                image: newJournalCreation,
                alt: 'Крок 2: заповнення полів форми та збереження',
            },
            {
                text: 'Переконайтесь, що новий запис зʼявився у головній таблиці.',
                image: newJournalInTable,
                alt: 'Крок 3: перевірка створеного запису',
            },
        ],
    },
    {
        title: '6. Керування користувачами',
        howToTitle: 'Як керувати користувачами (для адміністратора)',
        intro: 'Розділ Користувачі дозволяє підтримувати облікові записи системи.',
        steps: [
            {
                text: 'Відкрийте розділ Користувачі з головної сторінки.',
                image: usersBtn,
                alt: 'Крок 1: відкриття розділу користувачів',
            },
            {
                text: 'На вкладці Створити заповніть дані нового користувача та призначте ролі.',
                image: createUser,
                alt: 'Крок 2: створення користувача',
            },
            {
                text: 'На вкладці Редагувати оберіть користувача та змініть потрібні поля.',
                image: editUser,
                alt: 'Крок 3: редагування користувача',
            },
            {
                text: 'На вкладці Видалити оберіть користувача і підтвердіть видалення.',
                image: deleteUser,
                alt: 'Крок 4: видалення користувача',
            },
        ],
    },
];

const roleDescriptions = [
    {
        role: 'Адміністратор',
        description:
            'Має повний доступ до журналу: перегляд, створення, редагування, видалення записів і керування користувачами.',
    },
    {
        role: 'Старший диспетчер / Диспетчер',
        description:
            'Працює з записами журналу у межах доступних етапів: створення, обробка, зміна стану та контроль виконання.',
    },
    {
        role: 'Технічний керівник',
        description:
            'Призначає відповідальних, визначає терміни усунення та вносить технічні рішення у записах.',
    },
    {
        role: 'Виконавець',
        description:
            'Оновлює інформацію щодо фактичного усунення дефектів і бере участь у завершальних етапах обробки запису.',
    },
    {
        role: 'Перегляд всіх журналів',
        description:
            'Має режим лише читання: може переглядати записи, але не може їх змінювати або видаляти.',
    },
];

const HelpPage: React.FC = () => {
    const navigate = useNavigate();
    const isAuthenticated = Boolean(localStorage.getItem('accessToken'));

    return (
        <div className="help-page-root">
            <header className="help-page-header">
                <div>
                    <h1>Довідка</h1>
                    <p>Коротка інструкція з користування застосунком Журнал дефектів.</p>
                </div>
                <button
                    type="button"
                    className="help-page-back-btn"
                    onClick={() => navigate(isAuthenticated ? '/main-view' : '/login')}
                >
                    Повернутись
                </button>
            </header>

            <main className="help-page-content">
                <section className="help-page-card help-page-note">
                    <h2>Що можна робити в системі</h2>
                    <ul>
                        <li>Переглядати журнал дефектів по сторінках</li>
                        <li>Шукати і фільтрувати записи</li>
                        <li>Створювати нові дефекти</li>
                        <li>Редагувати записи відповідно до ролі</li>
                        <li>Додавати коментарі до записів</li>
                        <li>Керувати користувачами (для адміністратора)</li>
                    </ul>
                    <p>
                        Зображення нижче є тимчасовими прикладами. Ви можете замінити їх на реальні скріншоти у будь-який момент.
                    </p>
                </section>

                <section className="help-page-card help-page-roles">
                    <h2>Ролі користувачів</h2>
                    <p className="help-page-roles-intro">
                        Рівень доступу в системі залежить від ролі. Нижче наведено короткий опис можливостей кожної ролі.
                    </p>
                    <ul className="help-page-roles-list">
                        {roleDescriptions.map((item) => (
                            <li key={item.role}>
                                <strong>{item.role}:</strong> {item.description}
                            </li>
                        ))}
                    </ul>
                </section>

                {guideSections.map((item, index) => (
                    <details key={item.title} className="help-page-card help-page-collapsible" open={index === 0}>
                        <summary className="help-page-summary">
                            <div>
                                <h3>{item.title}</h3>
                                <h4 className="help-page-howto-title">{item.howToTitle}</h4>
                            </div>
                        </summary>
                        <div className="help-page-collapsible-content">
                            <div className="help-page-text">
                                <p>{item.intro}</p>
                            </div>
                            <ol className="help-page-steps-list">
                                {item.steps.map((step) => (
                                    <li key={step.alt} className="help-page-step-item">
                                        <p className="help-page-step-text">{step.text}</p>
                                        <div className="help-page-image-group">
                                            <img src={step.image} alt={step.alt} className="help-page-image" loading="lazy" />
                                            {step.extraImages?.map((extra) => (
                                                <img
                                                    key={extra.alt}
                                                    src={extra.image}
                                                    alt={extra.alt}
                                                    className="help-page-image"
                                                    loading="lazy"
                                                />
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </details>
                ))}
            </main>
        </div>
    );
};

export default HelpPage;
