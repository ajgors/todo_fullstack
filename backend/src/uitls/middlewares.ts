import { NextFunction, Request, Response } from 'express';

export function isLoggedIn(request: Request, response: Response, next: NextFunction) {
    if (request.user) {
        return next();
    }
    return response.redirect(request.originalUrl.slice(0, 7) + '/login');
}
