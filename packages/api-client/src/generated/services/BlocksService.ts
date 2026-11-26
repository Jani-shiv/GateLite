/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateBlockDto } from '../models/CreateBlockDto';
import type { UpdateBlockDto } from '../models/UpdateBlockDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BlocksService {

    /**
     * Create a new block
     * @returns any 
     * @throws ApiError
     */
    public static blocksControllerCreate({
societyId,
requestBody,
}: {
societyId: string,
requestBody: CreateBlockDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/societies/{societyId}/blocks',
            path: {
                'societyId': societyId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get all blocks in a society
     * @returns any 
     * @throws ApiError
     */
    public static blocksControllerFindAll({
societyId,
}: {
societyId: string,
}): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/societies/{societyId}/blocks',
            path: {
                'societyId': societyId,
            },
        });
    }

    /**
     * Get block details
     * @returns any 
     * @throws ApiError
     */
    public static blocksControllerFindOne({
societyId,
id,
}: {
societyId: string,
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/societies/{societyId}/blocks/{id}',
            path: {
                'societyId': societyId,
                'id': id,
            },
        });
    }

    /**
     * Update block
     * @returns any 
     * @throws ApiError
     */
    public static blocksControllerUpdate({
societyId,
id,
requestBody,
}: {
societyId: string,
id: string,
requestBody: UpdateBlockDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/societies/{societyId}/blocks/{id}',
            path: {
                'societyId': societyId,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete block
     * @returns void 
     * @throws ApiError
     */
    public static blocksControllerDelete({
societyId,
id,
}: {
societyId: string,
id: string,
}): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/societies/{societyId}/blocks/{id}',
            path: {
                'societyId': societyId,
                'id': id,
            },
        });
    }

}
