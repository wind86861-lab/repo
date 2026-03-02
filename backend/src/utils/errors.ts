export class AppError extends Error {
    public statusCode: number;
    public code: string;
    public details?: any;

    constructor(message: string, statusCode: number, code: string, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const ErrorCodes = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    DUPLICATE_ERROR: 'DUPLICATE_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
};
