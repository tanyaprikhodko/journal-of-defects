export const ROLES = {
    ADMIN: 'Адміністратор',
    DISPATCHER: 'Диспетчер',
    SENIOR_DISPATCHER: 'Старший диспетчер',
    TECH_LEAD: 'Технічний керівник',
    EXECUTOR: 'Виконавець',
    OBSERVER: 'Перегляд всіх журналів',
} as const;

export const CONDITIONS = {
    REGISTERED: 'Внесений',
    REVIEWED_BY_TECH_LEAD: 'Розглянутий технічним керівником',
    ACCEPTED_FOR_EXECUTION: 'Прийнятий до виконання',
    ELIMINATED: 'Усунутий',
    OVERDUE: 'Протермінований',
    ACCEPTED_INTO_OPERATION: 'Прийнятий в експлуатацію',
} as const;
