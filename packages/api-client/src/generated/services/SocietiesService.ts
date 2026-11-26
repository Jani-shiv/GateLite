/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSocietyDto } from '../models/CreateSocietyDto';
import type { UpdateSettingsDto } from '../models/UpdateSettingsDto';
import type { UpdateSocietyDto } from '../models/UpdateSocietyDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SocietiesService {

    /**
     * Create a new society
     * @returns any 
     * @throws ApiError
     */
    public static societiesControllerCreate({
requestBody,
}: {
requestBody: CreateSocietyDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/societies',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get all societies for current user
     * @returns any 
     * @throws ApiError
     */
    public static societiesControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/societies',
        });
    }

    /**
     * Get society details
     * @returns any 
     * @throws ApiError
     */
    public static societiesControllerFindOne({
id,
}: {
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/societies/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Update society details
     * @returns any 
     * @throws ApiError
     */
    public static societiesControllerUpdate({
id,
requestBody,
}: {
id: string,
requestBody: UpdateSocietyDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/societies/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get society settings
     * @returns any 
     * @throws ApiError
     */
    public static societiesControllerGetSettings({
id,
}: {
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/societies/{id}/settings',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Update society settings
     * @returns any 
     * @throws ApiError
     */
    public static societiesControllerUpdateSettings({
id,
requestBody,
}: {
id: string,
requestBody: UpdateSettingsDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/societies/{id}/settings',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
