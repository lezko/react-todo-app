const Checkbox = ({checked, setChecked, disabled = false, className = '', title}) => {
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
};

export default Checkbox;