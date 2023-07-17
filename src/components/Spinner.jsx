import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

const Spinner = ({size = 20, ...props}) => {
    const className = 'spinner ' + (props.className || '');
    return <FontAwesomeIcon style={{width: size, height: size}} className={className} icon={faSpinner} />
};

export default Spinner;