import React from 'react';

const LoginFormInput = (props) => {
    const inputOnBlur = () => {
        props.setIsInputFirstChange(false);
    }

    return (
        <div className="input">
            <label>{props.name}:</label>
            {
                !!props.inputRef ?
                <input ref={props.inputRef} type={props.inputType} name={props.name} onChange={props.onChangeFunc} onBlur={inputOnBlur}></input> :
                <input type={props.inputType} name={props.name} onChange={props.onChangeFunc} onBlur={inputOnBlur}></input>
            }
            { props.inputErrMsg !== '' && <span className="error-message">{props.inputErrMsg}</span> }
        </div>
    )
};

export default LoginFormInput;