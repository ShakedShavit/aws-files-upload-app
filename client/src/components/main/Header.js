import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { logoutAction } from '../../actions/loginActions';
import { LoginContext } from '../../context/loginContext';
import { deleteUserFromCookie } from '../../cookies/userDataCookies';
import Modal from './Modal';

const Header = () => {
    const { userDataState, dispatchUserData } = useContext(LoginContext);

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [areButtonHidden, setAreButtonHidden] = useState(false);
    const [logoutModalMainText, setLogoutModalMainText] = useState('Are you sure you want to logout?');

    const openLogoutModalOnClick = () => {
        setIsLogoutModalOpen(true);
    }

    const logout = () => {
        dispatchUserData(logoutAction());
        deleteUserFromCookie();

        setAreButtonHidden(true);
        setLogoutModalMainText('Goodbye. See you soon!');

        setTimeout(() => {
            setIsLogoutModalOpen(false);
        }, 1800);
    }

    return (
        <div className="header-wrapper">
            {
                !!userDataState.user ?
                <>
                    <span className="user-name">{userDataState.user.username}</span>
                    <button className="logout-button" onClick={openLogoutModalOnClick}>Logout</button>
                </> :
                <NavLink to="/login">Login</NavLink>
            }
            
            {
                isLogoutModalOpen &&
                <Modal
                    setIsModalOpen={setIsLogoutModalOpen}
                    mainText={logoutModalMainText}
                    confirmFunc={logout}
                    areButtonHidden={areButtonHidden}
                >
                </Modal>
            }
        </div>
    )
};

export default Header;