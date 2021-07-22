import * as Actions from '../types';

const initialState = {
    success: false,
    error  : {
        username: null,
        password: null,
        confirm_password: null,
    },
    loading: false,
};

const login = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.LOGIN_SUCCESS:
        {
            return {
                ...initialState,
                success: true,
                loading: false,
            };
        }
        case Actions.LOADING:
        {
            return {
                ...initialState,
                loading: !state.loading
            };
        }
        case Actions.LOGIN_ERROR:
        {
            return {
                success: false,
                error  : action.payload,
                loading: false,
            };
        }
        default:
        {
            return state
        }
    }
};

export default login;
