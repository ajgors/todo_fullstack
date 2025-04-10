import type { Schema } from 'express-validator';

export const idSchema: Schema = {
    id: {
        isUUID: {
            errorMessage: 'User ID must be a valid UUID',
        },
        notEmpty: {
            errorMessage: 'User ID cannot be empty',
        },
    },
};
