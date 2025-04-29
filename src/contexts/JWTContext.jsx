import PropTypes from 'prop-types';
import React, { createContext, useEffect, useReducer } from 'react';
import { useDispatch as useReduxDispatch } from 'react-redux';

// third party
import { Chance } from 'chance';
import { jwtDecode } from 'jwt-decode';

// reducer - local state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer'; // local reducer
import { storeUser } from 'store/slices/account'; // redux slice

// project imports
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';
import { logout } from 'utils/api';

const chance = new Chance();

// initial state for useReducer
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

// ==============================|| HELPERS ||============================== //

function verifyToken(serviceToken) {
  if (!serviceToken) return false;

  const decoded = jwtDecode(serviceToken);
  if (!decoded.exp) throw new Error("Token does not contain 'exp' property.");

  return decoded.exp > Date.now() / 1000;
}

function setSession(serviceToken, user) {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common.Authorization;
  }
}

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export function JWTProvider({ children }) {
  const reduxDispatch = useReduxDispatch(); // ✅ Redux dispatcher
  const [state, dispatch] = useReducer(accountReducer, initialState); // ✅ Local reducer

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        let userData = JSON.parse(window.localStorage.getItem('user'));
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken, userData);
          reduxDispatch(storeUser(userData));
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: userData
            }
          });
        } else {
          dispatch({ type: LOGOUT });
          logout();
        }
      } catch (err) {
        console.error(err);
        dispatch({ type: LOGOUT });
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('/user_management/auth/login', { email, password });
    const serviceToken = response.data.access_token;
    const user = response.data;

    setSession(serviceToken, user);

    reduxDispatch(storeUser(user)); // ✅ Send user to Redux
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user
      }
    }); // ✅ Update local context state
  };

  const register = async (email, password, organizationName, moduleId, type, context_type) => {
    try {
      let url = '';
      if (context_type === 'business') {
        url = '/user_management/register/business-with-module/';
      } else {
        url = '/user_management/register/standard ';
      }
      console.log(url);
      const response = await axios.post('/user_management/register/business-with-module/', {
        email,
        password,
        business_name: organizationName,
        module_id: moduleId
      });
      if (response.status === 201 && response.statusText === 'Created') {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async (email) => {
    // Implement reset password logic
  };

  const updateProfile = () => {
    // Implement profile update logic
  };

  if (!state.isInitialized) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </JWTContext.Provider>
  );
}

JWTProvider.propTypes = {
  children: PropTypes.node
};

export default JWTContext;
