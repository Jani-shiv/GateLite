/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RefreshTokenDto } from '../models/RefreshTokenDto';
import type { SendOtpDto } from '../models/SendOtpDto';
import type { VerifyOtpDto } from '../models/VerifyOtpDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthService {

    /**
     * Send OTP to phone number
     * @returns any OTP sent successfully
     * @throws ApiError
     */
    public static authControllerSendOtp({
requestBody,
}: {
requestBody: SendOtpDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/otp/send',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                429: `Too many requests`,
            },
        });
    }

    /**
     * Verify OTP and get tokens
     * @returns any OTP verified, tokens returned
     * @throws ApiError
     */
    public static authControllerVerifyOtp({
requestBody,
}: {
requestBody: VerifyOtpDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/otp/verify',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid or expired OTP`,
            },
        });
    }

    /**
     * Refresh access token
     * @returns any New tokens returned
     * @throws ApiError
     */
    public static authControllerRefresh({
requestBody,
}: {
requestBody: RefreshTokenDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid refresh token`,
            },
        });
    }

    /**
     * Revoke tokens for current device
     * @returns any Tokens revoked
     * @throws ApiError
     */
    public static authControllerRevoke(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/revoke',
        });
    }

    /**
     * Get current user profile
     * @returns any User profile
     * @throws ApiError
     */
    public static authControllerMe(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me',
        });
    }

}
