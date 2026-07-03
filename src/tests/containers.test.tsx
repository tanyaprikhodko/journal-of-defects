import { describe, expect, it } from 'vitest';
import NotFoundPage from '../containers/NotFoundPage';
import MainView from '../containers/MainView';
import EditPage from '../containers/EditPage';
import AuthorizeContainer from '../containers/AuthorizeContainer';
import CreatePage from '../containers/CreatePage';
import HelpPage from '../containers/HelpPage';
import UserAdmin from '../containers/UserAdmin';
import DefectInfoSection from '../containers/sections/DefectInfoSection';
import AcceptanceSection from '../containers/sections/AcceptanceSection';
import MoveAndCommentsSection from '../containers/sections/MoveAndCommentsSection';
import TechnicalLeadSection from '../containers/sections/TechnicalLeadSection';
import ExploitationSection from '../containers/sections/ExploitationSection';
import EliminationSection from '../containers/sections/EliminationSection';

describe('Container and section module exports', () => {
    it('loads all containers and section components', () => {
        expect(NotFoundPage).toBeTypeOf('function');
        expect(MainView).toBeTypeOf('function');
        expect(EditPage).toBeTypeOf('function');
        expect(AuthorizeContainer).toBeTypeOf('function');
        expect(CreatePage).toBeTypeOf('function');
        expect(HelpPage).toBeTypeOf('function');
        expect(UserAdmin).toBeTypeOf('function');
        expect(DefectInfoSection).toBeTypeOf('function');
        expect(AcceptanceSection).toBeTypeOf('function');
        expect(MoveAndCommentsSection).toBeTypeOf('function');
        expect(TechnicalLeadSection).toBeTypeOf('function');
        expect(ExploitationSection).toBeTypeOf('function');
        expect(EliminationSection).toBeTypeOf('function');
    });
});
