/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkCreateFlatDto } from '../models/BulkCreateFlatDto';
import type { CreateFlatDto } from '../models/CreateFlatDto';
import type { UpdateFlatDto } from '../models/UpdateFlatDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FlatsService {

    /**
     * Create a new flat
     * @returns any 
     * @throws ApiError
     */
    public static flatsControllerCreate({
societyId,
requestBody,
}: {
societyId: string,
requestBody: CreateFlatDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/societies/{societyId}/flats',
            path: {
                'societyId': societyId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get all flats in a society
     * @returns any 
     * @throws ApiError
     */
    public static flatsControllerFindAll({
societyId,
blockId,
}: {
societyId: string,
blockId: string,
}): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/societies/{societyId}/flats',
            path: {
                'societyId': societyId,
            },
            query: {
                'blockId': blockId,
            },
        });
    }

    /**
     * Create multiple flats
     * @returns any 
     * @throws ApiError
     */
    public static flatsControllerBulkCreate({
societyId,
requestBody,
}: {
societyId: string,
requestBody: BulkCreateFlatDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/societies/{societyId}/flats/bulk',
            path: {
                'societyId': societyId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Import flats from CSV
     * @returns any 
     * @throws ApiError
     */
    public static flatsControllerImportFromCsv({
societyId,
}: {
societyId: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/societies/{societyId}/flats/import',
            path: {
                'societyId': societyId,
            },
        });
    }

    /**
     * Get flat details
     * @returns any 
     * @throws ApiError
     */
    public static flatsControllerFindOne({
societyId,
id,
}: {
societyId: string,
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/societies/{societyId}/flats/{id}',
            path: {
                'societyId': societyId,
                'id': id,
            },
        });
    }

    /**
     * Update flat
     * @returns any 
     * @throws ApiError
     */
    public static flatsControllerUpdate({
societyId,
id,
requestBody,
}: {
societyId: string,
id: string,
requestBody: UpdateFlatDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/societies/{societyId}/flats/{id}',
            path: {
                'societyId': societyId,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete flat
     * @returns void 
     * @throws ApiError
     */
    public static flatsControllerDelete({
societyId,
id,
}: {
societyId: string,
id: string,
}): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/societies/{societyId}/flats/{id}',
            path: {
                'societyId': societyId,
                'id': id,
            },
        });
    }

}
