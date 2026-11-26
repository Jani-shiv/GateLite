/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApproveVisitDto } from '../models/ApproveVisitDto';
import type { CreatePreApprovedDto } from '../models/CreatePreApprovedDto';
import type { CreateWalkInDto } from '../models/CreateWalkInDto';
import type { VerifyPassDto } from '../models/VerifyPassDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class VisitsService {

    /**
     * Create walk-in visit (guard only)
     * @returns any 
     * @throws ApiError
     */
    public static visitsControllerCreateWalkIn({
requestBody,
}: {
requestBody: CreateWalkInDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/visits/walk-in',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Create pre-approved pass (resident)
     * @returns any 
     * @throws ApiError
     */
    public static visitsControllerCreatePreApproved({
requestBody,
}: {
requestBody: CreatePreApprovedDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/visits/pre-approved',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Verify pass code (guard only)
     * @returns any 
     * @throws ApiError
     */
    public static visitsControllerVerifyPass({
requestBody,
}: {
requestBody: VerifyPassDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/visits/verify-pass',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Approve or deny visit (resident)
     * @returns any 
     * @throws ApiError
     */
    public static visitsControllerApproveVisit({
id,
requestBody,
}: {
id: string,
requestBody: ApproveVisitDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/visits/{id}/approve',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Check in visitor (guard only)
     * @returns any 
     * @throws ApiError
     */
    public static visitsControllerCheckIn({
id,
}: {
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/visits/{id}/check-in',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Check out visitor (guard only)
     * @returns any 
     * @throws ApiError
     */
    public static visitsControllerCheckOut({
id,
}: {
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/visits/{id}/check-out',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Get visit history for current user's flat
     * @returns any 
     * @throws ApiError
     */
    public static visitsControllerGetHistory({
page,
limit,
}: {
page: number,
limit: number,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/visits/history',
            query: {
                'page': page,
                'limit': limit,
            },
        });
    }

    /**
     * Get pending visits for guard
     * @returns any 
     * @throws ApiError
     */
    public static visitsControllerGetPending(): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/visits/pending',
        });
    }

    /**
     * Create delivery visit (guard only)
     * @returns any 
     * @throws ApiError
     */
    public static visitsControllerCreateDelivery({
requestBody,
}: {
requestBody: CreateWalkInDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/visits/delivery',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Create cab visit (guard only)
     * @returns any 
     * @throws ApiError
     */
    public static visitsControllerCreateCab({
requestBody,
}: {
requestBody: CreateWalkInDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/visits/cab',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
