/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateNoticeDto } from '../models/CreateNoticeDto';
import type { UpdateNoticeDto } from '../models/UpdateNoticeDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class NoticesService {

    /**
     * Create a notice (admin only)
     * @returns any 
     * @throws ApiError
     */
    public static noticesControllerCreate({
requestBody,
}: {
requestBody: CreateNoticeDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/notices',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get all notices
     * @returns any 
     * @throws ApiError
     */
    public static noticesControllerFindAll({
page,
limit,
published,
}: {
page: number,
limit: number,
published: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notices',
            query: {
                'page': page,
                'limit': limit,
                'published': published,
            },
        });
    }

    /**
     * Get notice details
     * @returns any 
     * @throws ApiError
     */
    public static noticesControllerFindOne({
id,
}: {
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notices/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Update notice (admin only)
     * @returns any 
     * @throws ApiError
     */
    public static noticesControllerUpdate({
id,
requestBody,
}: {
id: string,
requestBody: UpdateNoticeDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/notices/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete notice (admin only)
     * @returns void 
     * @throws ApiError
     */
    public static noticesControllerDelete({
id,
}: {
id: string,
}): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/notices/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Mark notice as read
     * @returns any 
     * @throws ApiError
     */
    public static noticesControllerMarkAsRead({
id,
}: {
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/notices/{id}/read',
            path: {
                'id': id,
            },
        });
    }

}
