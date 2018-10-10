import {
    CREATE_PAYMENT_REQUESTING,
    CREATE_PAYMENT_SUCCESS,
    UPDATE_RESUME_REQUESTING,
    UPDATE_RESUME_SUCCESS
} from '../constants/claims';

export const createPayment = (id, data, userId) => ({
    type: CREATE_PAYMENT_REQUESTING,
    id,
    data,
    userId
});

export const createPaymentSuccess = payment => ({
    type: CREATE_PAYMENT_SUCCESS,
    payment
});

export const updateReserve = (id, data, userId) => ({
    type: UPDATE_RESUME_REQUESTING,
    id,
    data,
    userId
});

export const updateResumeSuccess = resume => ({
    type: UPDATE_RESUME_SUCCESS,
    resume
});
