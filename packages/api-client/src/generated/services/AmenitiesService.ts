/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAmenityDto } from '../models/CreateAmenityDto';
import type { CreateBookingDto } from '../models/CreateBookingDto';
import type { UpdateAmenityDto } from '../models/UpdateAmenityDto';
import type { UpdateBookingDto } from '../models/UpdateBookingDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AmenitiesService {

    /**
     * Create amenity (admin only)
     * @returns any 
     * @throws ApiError
     */
    public static amenitiesControllerCreate({
requestBody,
}: {
requestBody: CreateAmenityDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/amenities',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get all amenities
     * @returns any 
     * @throws ApiError
     */
    public static amenitiesControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/amenities',
        });
    }

    /**
     * Get amenity details
     * @returns any 
     * @throws ApiError
     */
    public static amenitiesControllerFindOne({
id,
}: {
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/amenities/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Update amenity (admin only)
     * @returns any 
     * @throws ApiError
     */
    public static amenitiesControllerUpdate({
id,
requestBody,
}: {
id: string,
requestBody: UpdateAmenityDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/amenities/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete amenity (admin only)
     * @returns void 
     * @throws ApiError
     */
    public static amenitiesControllerDelete({
id,
}: {
id: string,
}): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/amenities/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Create booking
     * @returns any 
     * @throws ApiError
     */
    public static amenitiesControllerCreateBooking({
requestBody,
}: {
requestBody: CreateBookingDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/amenities/bookings',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get bookings
     * @returns any 
     * @throws ApiError
     */
    public static amenitiesControllerGetBookings({
amenityId,
flatId,
status,
}: {
amenityId: string,
flatId: string,
status: string,
}): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/amenities/bookings',
            query: {
                'amenityId': amenityId,
                'flatId': flatId,
                'status': status,
            },
        });
    }

    /**
     * Update booking status
     * @returns any 
     * @throws ApiError
     */
    public static amenitiesControllerUpdateBooking({
id,
requestBody,
}: {
id: string,
requestBody: UpdateBookingDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/amenities/bookings/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
