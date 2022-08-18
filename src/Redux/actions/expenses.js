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
import { getExpenses, postExpense, getExpensesType } from "../../Services/apis";
import history from "../../Services/history";

export const postExpenseStarted = () => {
    return {
        type: POST_EXPENSES_STARTED
    };
};

export const postExpenseSuccess = payload => {
    return {
        type: POST_EXPENSES_SUCCESSFUL,
        payload,
    };
};

export const postExpenseFailed = payload => {
    return {
        type: POST_EXPENSES_FAILED,
        payload,
    };
};

export const getExpenseTypeStarted = () => {
    return {
        type: GET_EXPENSE_TYPE_STARTED
    };
};

export const getExpenseTypeSuccess = payload => {
    return {
        type: GET_EXPENSES_TYPE_SUCCESSFUL,
        payload,
    };
};

export const getExpenseTypeFailed = payload => {
    return {
        type: GET_EXPENSES_TYPE_FAILED,
        payload,
    };
};

export const getExpenseStarted = () => {
    return {
        type: GET_EXPENSES_STARTED
    };
};

export const getExpenseSuccess = payload => {
    return {
        type: GET_EXPENSES_SUCCESSFUL,
        payload,
    };
};

export const getExpensesFailed = payload => {
    return {
        type: GET_EXPENSES_FAILED,
        payload,
    };
};

export const getAllExpenseType = () => async (dispatch) => {
    try {
        dispatch(getExpenseTypeStarted())
        const response = await getExpensesType()
        const { data } = response;
        return dispatch(getExpenseTypeSuccess(data))
    } catch (error) {
        return dispatch(getExpenseTypeFailed(error.response))
    }
}

export const getAllExpenses = () => async (dispatch) => {
    try {
        dispatch(getExpenseStarted())
        const response = await getExpenses()
        const { data } = response;
        return dispatch(getExpenseSuccess(data))
    } catch (error) {
        return dispatch(getExpensesFailed(error.response))
    }
}


export const createExpense = (payload) => async (dispatch) => {
    try {
        dispatch(postExpenseStarted())
        const response = postExpense(payload)
        const { data } = response;
        return dispatch(postExpenseSuccess(data))
    } catch (error) {
        return dispatch(postExpenseFailed(error.response))
    }
}