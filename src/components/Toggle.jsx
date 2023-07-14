import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const Toggle = ({active, title, setActive, icon, iconColor = 'white', beforeChange}) => {
    return (
        <div
            title={title || (active ? 'disable' : 'enable')}
            onClick={() => {
            if (typeof beforeChange === 'function') {
                beforeChange().then(() => setActive(!active)).catch(() => {
                });
            } else {
                setActive(!active);
            }
        }} className={'toggle ' + (active ? 'active' : '')}>
            <div className="dot" style={{
                backgroundColor: active && !icon ? iconColor : '#494d4d'
            }}></div>
            <div className="icon">
                {icon && <FontAwesomeIcon style={{color: active ? iconColor : 'inherit'}} icon={icon} />}
            </div>
        </div>
    );
};

export default Toggle;