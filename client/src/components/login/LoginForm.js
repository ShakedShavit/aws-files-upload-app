import React, { useContext, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { loginUserInDB, signupUserInDB } from '../../server/db/user';
import Form from '../main/Form';
import LoginFormInput from './LoginFormInput';
import { saveUserOnCookie } from '../../cookies/userDataCookies';
import { LoginContext } from '../../context/loginContext';
import { loginAction } from '../../actions/loginActions';

const LoginForm = (props) => {
    const { dispatchUserData } = useContext(LoginContext);

    const [formErrMsg, setFormErrMsg] = useState('');
    const [usernameErrMsg, setUsernameErrMsg] = useState('');
    const [passwordErrMsg, setPasswordErrMsg] = useState('');
    const [passwordRepeatErrMsg, setPasswordRepeatErrMsg] = useState('');
    const [isUsernameInputFirstChange, setIsUsernameInputFirstChange] = useState(true);
    const [isPasswordInputFirstChange, setIsPasswordInputFirstChange] = useState(true);
    const [isRepeatedPasswordInputFirstChange, setIsRepeatedPasswordInputFirstChange] = useState(true);

    const passwordInputEl = useRef(null);

    const history = useHistory();

    const usernameInputOnChange = (e) => {
        if (isUsernameInputFirstChange) return;
        getIsUsernameInputValid(e.target.value.trim());
    }
    const getIsUsernameInputValid = (inputValue) => {
        if (inputValue === '') return setUsernameErrMsg('username cannot be empty');
        if (!(/.*[a-zA-Z].*/.test(inputValue))) return setUsernameErrMsg('username must contain at least one letter');
        if (inputValue.includes(' ')) return setUsernameErrMsg('username cannot contain spaces');
        
        setUsernameErrMsg('');
        return true;
    }

    const passwordInputOnChange = () => {
        if (isPasswordInputFirstChange) return;
        getIsPasswordInputValid();
    }
    const getIsPasswordInputValid = () => {
        const password = passwordInputEl.current.value;

        if (password === '') return setPasswordErrMsg('password cannot be empty');
        if (password.includes(' ')) return setPasswordErrMsg('password cannot contain spaces');
        if (!(/.*[a-zA-Z].*/.test(password))) return setPasswordErrMsg('password must contain at least one letter');
        if (password.length < 6) return setPasswordErrMsg('password cannot be shorter than 6 characters');

        setPasswordErrMsg('');
        return true;
    }

    const repeatPasswordInputOnChange = (e) => {
        if (isRepeatedPasswordInputFirstChange) return;
        getIsRepeatedPasswordInputValid(e.target.value);
    }
    const getIsRepeatedPasswordInputValid = (inputValue) => {
        const password = passwordInputEl.current.value;
        if (inputValue !== password) return setPasswordRepeatErrMsg('passwords do not match');

        setPasswordRepeatErrMsg('');
        return true;
    }


    const checkInputsOnSubmit = (e) => {
        e.preventDefault();
    
        setFormErrMsg('');
    
        const username = e.target[0].value.trim();
        const password = e.target[1].value;
        
        const isUsernameValid = getIsUsernameInputValid(username);
        const isPasswordValid = getIsPasswordInputValid(password);
        const isRepeatedPasswordValid = props.isSignupForm ? getIsRepeatedPasswordInputValid(e.target[2].value) : true;
        if (!isUsernameValid || !isPasswordValid || !isRepeatedPasswordValid) return setFormErrMsg('Check inputs errors');

        loginOrSignupInDB(username, password);
    }

    const loginOrSignupInDB = (username, password) => {
        if (props.isSignupForm) {
            signupUserInDB(username, password)
            .then((res) => {
                loginInSite(res);
            })
            .catch((err) => {
                console.log(err);
                setFormErrMsg(err.message);
            });
        } else {
            loginUserInDB(username, password)
            .then((res) => {
                loginInSite(res);
            })
            .catch((err) => {
                console.log(err);
                setFormErrMsg(err.message);
            });
        }
    }

    const loginInSite = (res) => {
        console.log(res)
        dispatchUserData(loginAction({ user: res.user, token: res.token }));
        saveUserOnCookie(res);
        history.push('/home');
    }

    return (
        <Form formErrMsg={formErrMsg} submitButtonText={props.isSignupForm ? 'Signup': 'Login'} onSubmitFunc={checkInputsOnSubmit} submitButtonClassName='login-button'>
            <LoginFormInput
                name={'username'}
                inputType={'text'}
                onChangeFunc={usernameInputOnChange}
                setIsInputFirstChange={setIsUsernameInputFirstChange}
                inputErrMsg={usernameErrMsg}
             />

            <LoginFormInput
                inputRef={passwordInputEl}
                name={'password'}
                inputType={'password'}
                onChangeFunc={passwordInputOnChange}
                setIsInputFirstChange={setIsPasswordInputFirstChange}
                inputErrMsg={passwordErrMsg}
             />

            {
                props.isSignupForm &&
                <LoginFormInput
                    name={'repeat-password'}
                    inputType={'password'}
                    onChangeFunc={repeatPasswordInputOnChange}
                    setIsInputFirstChange={setIsRepeatedPasswordInputFirstChange}
                    inputErrMsg={passwordRepeatErrMsg}
                />
            }
        </Form>
    )
};

export default LoginForm;