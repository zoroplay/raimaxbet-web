import {
    GET_EXPENSES_STARTED,
    GET_EXPENSES_SUCCESSFUL,
    GET_EXPENSES_FAILED,
    POST_EXPENSES_STARTED,
    POST_EXPENSES_SUCCESSFUL,
    POST_EXPENSES_FAILED,
    GET_EXPENSE_TYPE_STARTED,
    GET_EXPENSES_TYPE_SUCCESSFUL,
    GET_EXPENSES_TYPE_FAILED
} from '../types'

const initialState = {
   expense : [],//guest
    expenseType: [],
    newExpense: {},
    loading: false,
    createLoading: false
};

export const expenseReducer = (state = initialState, action) => {
    switch(action.type) {
      case  POST_EXPENSES_STARTED:
        return {
          ...state,
          createLoading: true
        }
      case POST_EXPENSES_SUCCESSFUL: 
        return {
          ...state,
          createLoading: false,
          newExpense: action.payload
        }
      case POST_EXPENSES_FAILED:
        return {
          ...state,
          createLoading: false,
          error: action.payload
        }
        case GET_EXPENSES_STARTED:
          return {
            ...state,
            loading: true
          }
        case GET_EXPENSES_SUCCESSFUL: 
          return {
            ...state,
            loading: false,
            expense: action.payload
          }
        case GET_EXPENSES_FAILED:
          return {
            ...state,
            loading: false,
            error: action.payload
          }
        case GET_EXPENSE_TYPE_STARTED:
        return {
          ...state,
          loading: true
        }
        case GET_EXPENSES_TYPE_SUCCESSFUL: 
          return {
            ...state,
            loading: false,
            expenseType: action.payload
          }
        case GET_EXPENSES_TYPE_FAILED:
          return {
            ...state,
            loading: false,
            error: action.payload
          }
    }
      return state;
}