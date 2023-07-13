import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const Toggle = ({active, setActive, icon, iconColor, beforeEnable}) => {
    return (
        <div onClick={() => {
            if (!active && typeof beforeEnable === 'function') {
                beforeEnable().then(() => setActive(true)).catch(() => {});
            } else {
                setActive(!active);
            }
        }} className={'toggle ' + (active ? 'active' : '')}>
            <div className="dot"></div>
            <div className="icon"><FontAwesomeIcon style={{color: active ? iconColor : 'inherit'}} icon={icon} /></div>
        </div>
    );
};

export default Toggle;