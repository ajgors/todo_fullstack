import { NextFunction, Request, Response } from 'express';

export function isLoggedIn(request: Request, response: Response, next: NextFunction) {
    if (request.user) {
        return next();
    }
    response.sendStatus(401).end;
    return;
}
