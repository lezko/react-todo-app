import Toggle from 'components/Toggle';
import {useState} from 'react';
import {useSettings} from 'hooks/settings';
import {useAppDispatch} from 'store';
import {setSettings} from 'store/settingsSlice';

const SettingsPage = () => {
    const dispatch = useAppDispatch();
    const settings = useSettings();
    const [roleActive, setRoleActive] = useState(settings.confirmChangeRole);
    const [banActive, setBanActive] = useState(settings.confirmChangeBanned);
    const [deleteActive, setDeleteActive] = useState(settings.confirmDeleteTodo);
    const [allowEditingCompleted, setAllowEditingCompleted] = useState(settings.allowEditingCompleted);

    // todo complex optimization with useCallback or better extract repeated logic
    const handeChangeRole = () => {
        const nextRoleActive = !roleActive;
        setRoleActive(nextRoleActive);
        dispatch(setSettings({...settings, confirmChangeRole: nextRoleActive}));
    }

    const handleChangeBan = () => {
        const nextBanActive = !banActive;
        setBanActive(nextBanActive);
        dispatch(setSettings({...settings, confirmChangeBanned: nextBanActive}));
    }

    const handleChangeDelete = () => {
        const nextDelete = !deleteActive;
        setDeleteActive(nextDelete);
        dispatch(setSettings({...settings, confirmDeleteTodo: nextDelete}));
    }

    const handleChangeAllowEditingCompleted = () => {
        const nextAllowEditingCompleted = !allowEditingCompleted;
        setAllowEditingCompleted(nextAllowEditingCompleted);
        dispatch(setSettings({...settings, allowEditingCompleted: nextAllowEditingCompleted}));
    }

    return (
        <div className="container settings-page">
            <h2 style={{marginBottom: 10}}>Settings</h2>
            <ul className="settings">
                <li>
                    <span>Confirm before change user role</span>
                    <Toggle active={roleActive} setActive={handeChangeRole} />
                </li>
                <li>
                    <span>Confirm before ban user</span>
                    <Toggle active={banActive} setActive={handleChangeBan} />
                </li>
                <li>
                    <span>Confirm before delete todo</span>
                    <Toggle active={deleteActive} setActive={handleChangeDelete} />
                </li>
                <li>
                    <span>Allow editing completed</span>
                    <Toggle active={allowEditingCompleted} setActive={handleChangeAllowEditingCompleted} />
                </li>
            </ul>
        </div>
    );
};

export default SettingsPage;