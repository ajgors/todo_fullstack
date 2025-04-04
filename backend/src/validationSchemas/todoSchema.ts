import { Schema } from 'express-validator';

export const todoSchema: Schema = {
    title: {
        isString: {
            errorMessage: 'Title must be a string',
        },
        notEmpty: {
            errorMessage: 'Title cannot be empty',
        },
    },

    context: {
        isString: {
            errorMessage: 'Context must be a string',
        },
        notEmpty: {
            errorMessage: 'Context cannot be empty',
        },
    },

    checked: {
        isBoolean: {
            errorMessage: 'Checked must be a boolean',
        },
    },
};
