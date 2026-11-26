/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AcceptInviteDto } from '../models/AcceptInviteDto';
import type { InviteResidentDto } from '../models/InviteResidentDto';
import type { UpdateResidentDto } from '../models/UpdateResidentDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ResidentsService {

    /**
     * Invite a resident to a flat (admin only)
     * @returns any 
     * @throws ApiError
     */
    public static residentsControllerInvite({
requestBody,
}: {
requestBody: InviteResidentDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/residents/invite',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Accept a resident invitation
     * @returns any 
     * @throws ApiError
     */
    public static residentsControllerAcceptInvite({
requestBody,
}: {
requestBody: AcceptInviteDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/residents/accept',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get all residents for current user
     * @returns any 
     * @throws ApiError
     */
    public static residentsControllerFindAll({
page,
limit,
flatId,
role,
status,
}: {
page: string,
limit: string,
flatId: string,
role: string,
status: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/residents',
            query: {
                'page': page,
                'limit': limit,
                'flatId': flatId,
                'role': role,
                'status': status,
            },
        });
    }

    /**
     * Get resident details
     * @returns any 
     * @throws ApiError
     */
    public static residentsControllerFindOne({
id,
}: {
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/residents/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Update resident (admin only)
     * @returns any 
     * @throws ApiError
     */
    public static residentsControllerUpdate({
id,
requestBody,
}: {
id: string,
requestBody: UpdateResidentDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/residents/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Remove resident (admin only)
     * @returns void 
     * @throws ApiError
     */
    public static residentsControllerRemove({
id,
}: {
id: string,
}): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/residents/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Import residents from CSV (admin only)
     * @returns any 
     * @throws ApiError
     */
    public static residentsControllerImportFromCsv(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/residents/import',
        });
    }

}
