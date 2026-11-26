/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CheckInDto } from '../models/CheckInDto';
import type { CreateStaffDto } from '../models/CreateStaffDto';
import type { UpdateStaffDto } from '../models/UpdateStaffDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class StaffService {

    /**
     * Create staff member (admin only)
     * @returns any 
     * @throws ApiError
     */
    public static staffControllerCreate({
requestBody,
}: {
requestBody: CreateStaffDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/staff',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get all staff members
     * @returns any 
     * @throws ApiError
     */
    public static staffControllerFindAll(): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/staff',
        });
    }

    /**
     * Get staff member details
     * @returns any 
     * @throws ApiError
     */
    public static staffControllerFindOne({
id,
}: {
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/staff/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Update staff member (admin only)
     * @returns any 
     * @throws ApiError
     */
    public static staffControllerUpdate({
id,
requestBody,
}: {
id: string,
requestBody: UpdateStaffDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/staff/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete staff member (admin only)
     * @returns void 
     * @throws ApiError
     */
    public static staffControllerDelete({
id,
}: {
id: string,
}): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/staff/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Staff check-in
     * @returns any 
     * @throws ApiError
     */
    public static staffControllerCheckIn({
id,
requestBody,
}: {
id: string,
requestBody: CheckInDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/staff/{id}/check-in',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Staff check-out
     * @returns any 
     * @throws ApiError
     */
    public static staffControllerCheckOut({
attendanceId,
}: {
attendanceId: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/staff/attendance/{attendanceId}/check-out',
            path: {
                'attendanceId': attendanceId,
            },
        });
    }

    /**
     * Get staff attendance records
     * @returns any 
     * @throws ApiError
     */
    public static staffControllerGetAttendance({
staffId,
flatId,
dateFrom,
dateTo,
}: {
staffId: string,
flatId: string,
dateFrom: string,
dateTo: string,
}): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/staff/attendance',
            query: {
                'staffId': staffId,
                'flatId': flatId,
                'dateFrom': dateFrom,
                'dateTo': dateTo,
            },
        });
    }

}
