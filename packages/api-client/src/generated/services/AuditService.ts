/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuditService {

    /**
     * Get audit logs (admin only)
     * @returns any 
     * @throws ApiError
     */
    public static auditControllerFindAll({
page,
limit,
actorId,
action,
entity,
entityId,
dateFrom,
dateTo,
}: {
page: number,
limit: number,
actorId: string,
action: string,
entity: string,
entityId: string,
dateFrom: string,
dateTo: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/audit',
            query: {
                'page': page,
                'limit': limit,
                'actorId': actorId,
                'action': action,
                'entity': entity,
                'entityId': entityId,
                'dateFrom': dateFrom,
                'dateTo': dateTo,
            },
        });
    }

    /**
     * Get unique actions
     * @returns any 
     * @throws ApiError
     */
    public static auditControllerGetActions(): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/audit/meta/actions',
        });
    }

    /**
     * Get unique entities
     * @returns any 
     * @throws ApiError
     */
    public static auditControllerGetEntities(): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/audit/meta/entities',
        });
    }

}
