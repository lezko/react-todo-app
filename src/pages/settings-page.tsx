import Toggle from 'components/Toggle';
import {useState} from 'react';
import {useSettings} from 'hooks/settings';
import {useAppDispatch} from 'store';
import {setSettings} from 'store/settingsSlice';

const SettingsPage = () => {
    const dispatch = useAppDispatch();
    const settings = useSettings();
    console.log(settings);
    const [roleActive, setRoleActive] = useState(settings.confirmChangeRole);
    const [banActive, setBanActive] = useState(settings.confirmChangeBanned);
    const [deleteActive, setDeleteActive] = useState(settings.confirmDeleteTodo);

    const handeChangeRole = () => {
        const nextRoleActive = !roleActive;
        setRoleActive(nextRoleActive);
        dispatch(setSettings({...settings, confirmChangeRole: nextRoleActive}));
        // partiallySaveSettingsToLocalStorage({confirmChangeRole: nextRoleActive});
    }

    const handleChangeBan = () => {
        const nextBanActive = !banActive;
        setBanActive(nextBanActive);
        dispatch(setSettings({...settings, confirmChangeBanned: nextBanActive}));
        // partiallySaveSettingsToLocalStorage({confirmChangeBanned: nextBanActive});
    }

    const handleChangeDelete = () => {
        const nextDelete = !deleteActive;
        setDeleteActive(nextDelete);
        dispatch(setSettings({...settings, confirmDeleteTodo: nextDelete}));
        // partiallySaveSettingsToLocalStorage({confirmDeleteTodo: nextDelete});
    }

    return (
        <div className="container settings-page" style={{textAlign: 'center'}}>
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
            </ul>
        </div>
    );
};

export default SettingsPage;