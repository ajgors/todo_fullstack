import { Schema } from 'express-validator';

export const userSchema: Schema = {
    username: {
        isString: {
            errorMessage: 'Username must be a string',
        },
        notEmpty: {
            errorMessage: 'Username cannot be empty',
        },
    },

    password: {
        isString: {
            errorMessage: 'Password must be a string',
        },
        notEmpty: {
            errorMessage: 'Password cannot be empty',
        },

        isLength: {
            options: { min: 5 },
            errorMessage: 'Password must be at least 5 characters long',
        },
    },
};
