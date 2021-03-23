import React, { useState } from 'react';

const Form = (props) => {
    return (
        <form onSubmit={props.onSubmitFunc}>
            {props.children}
            <button className={props.submitButtonClassName} type="submit">{props.submitButtonText}</button>
            { props.formErrMsg !== '' && <span className="error-message">{props.formErrMsg}</span> }
        </form>
    )
};

export default Form;