import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import axiosInstance from '../config/axiosConfig';

interface AuthState {
  isLogin: boolean;
  token: string | null;
  role: string | null;
  account: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
  };
  isLoading: boolean;
}

interface AuthContextProps {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface DecodedToken extends JwtPayload {
  exp: number;
}

const initialState: AuthState = {
  isLogin: !!localStorage.getItem('token'),
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role'),
  account: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
  },
  isLoading: false,
};

type AuthAction =
  | { type: 'LOGIN'; payload: { token: string; role: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_ACCOUNT'; payload: any }
  | { type: 'REFRESH_TOKEN';  payload: { token: string; role: string } }
  | { type: 'START_LOADING' }
  | { type: 'STOP_LOADING' };

const AuthContext = createContext<AuthContextProps>({
  state: initialState,
  dispatch: () => null,
});

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLogin: true,
        token: action.payload.token,
        role: action.payload.role,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        role: "",
        isLogin: false,
      };
    case 'SET_ACCOUNT':
      return {
        ...state,
        account: action.payload,
        isLoading: false,
      };
    case 'REFRESH_TOKEN':
      return {
        ...state,
        isLogin: true,
        token: action.payload.token,
        role: action.payload.role,
        isLoading: false,
      };
    case 'START_LOADING':
      return {
        ...state,
        isLoading: true,
      };
    case 'STOP_LOADING':
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Provider component
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkTokenExpirationAndRefresh = async () => {

      if (!state.token) {
        return;
      }

      const isTokenNearlyExpired = (token: string): boolean => {
        const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
        if (!decodedToken.exp) {
          return false;
        }

        const expirationTime = decodedToken.exp * 1000;
        const timeUntilExpiration = expirationTime - Date.now();
        if (timeUntilExpiration < 0) {
          localStorage.clear();
          dispatch({ type: 'LOGOUT' });
          return false;
        }

        const tenMinutesInMillis = 10 * 60 * 1000; // 10 minutes in milliseconds
        return timeUntilExpiration < tenMinutesInMillis;
      };

      if (isTokenNearlyExpired(state.token)) {
        dispatch({ type: 'START_LOADING' });

        await axiosInstance.post(`/courtstar/auth/refresh`, { token: state.token })
          .then(res => {
            const dataObj = res.data;
            const newToken = dataObj.data.token;
            const role = dataObj.data.role;
            localStorage.setItem('token', newToken);
            localStorage.setItem('role', role);
            dispatch({ type: 'REFRESH_TOKEN', payload: { token: newToken, role: role } });

            // Fetch account details with the new token
            axiosInstance.get('/courtstar/account/myInfor')
              .then(res => {
                dispatch({ type: 'SET_ACCOUNT', payload: res.data.data });
              })
              .catch(err => {
                console.log(err.message);
                localStorage.clear();
                dispatch({ type: 'LOGOUT' });
              })
              .finally(()=>{})
          })
          .catch(error => {
            console.log(error.message);
            localStorage.clear();
            dispatch({ type: 'LOGOUT' });
          })
          .finally(
            () => {
              dispatch({ type: 'STOP_LOADING' });
            }
          );
      }
    };

    checkTokenExpirationAndRefresh();

    const tokenCheckInterval = setInterval(checkTokenExpirationAndRefresh, 60 * 1000); // Check every minute

    return () => clearInterval(tokenCheckInterval);
  }, [state.token]);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};

// Custom hook
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
