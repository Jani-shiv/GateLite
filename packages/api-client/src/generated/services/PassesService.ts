/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePassDto } from '../models/CreatePassDto';
import type { VerifyCodeDto } from '../models/VerifyCodeDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PassesService {

    /**
     * Create a pre-approval pass
     * @returns any 
     * @throws ApiError
     */
    public static passesControllerCreate({
requestBody,
}: {
requestBody: CreatePassDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/passes',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get all passes for current user's flat
     * @returns any 
     * @throws ApiError
     */
    public static passesControllerFindAll(): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/passes',
        });
    }

    /**
     * Get pass details
     * @returns any 
     * @throws ApiError
     */
    public static passesControllerFindOne({
id,
}: {
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/passes/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Revoke a pass
     * @returns void 
     * @throws ApiError
     */
    public static passesControllerRevoke({
id,
}: {
id: string,
}): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/passes/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Verify pass code (online)
     * @returns any 
     * @throws ApiError
     */
    public static passesControllerVerifyCode({
requestBody,
}: {
requestBody: VerifyCodeDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/passes/verify',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Verify pass code (offline - for guard app)
     * @returns any 
     * @throws ApiError
     */
    public static passesControllerVerifyCodeOffline({
requestBody,
}: {
requestBody: VerifyCodeDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/passes/verify-offline',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
