import {FC, memo} from 'react';

interface CheckboxProps {
    checked: boolean;
    setChecked: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
    title?: string;
}

const Checkbox: FC<CheckboxProps> = memo(({checked, setChecked, disabled = false, className = '', title}) => {
    const classList = ['checkbox'];
    if (classList) {
        classList.push(className);
    }
    if (disabled) {
        classList.push('disabled');
    }
    if (checked) {
        classList.push('checked');
    }
    return (
        <div
            title={title ? title : (checked ? 'uncheck' : 'check')}
            onClick={() => setChecked(!checked)}
            className={classList.join(' ')}
        ></div>
    );
});

export default Checkbox;