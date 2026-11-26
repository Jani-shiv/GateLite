/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RegisterDeviceDto } from '../models/RegisterDeviceDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DevicesService {

    /**
     * Register a device for push notifications
     * @returns any 
     * @throws ApiError
     */
    public static devicesControllerRegister({
requestBody,
}: {
requestBody: RegisterDeviceDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/devices/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get user devices
     * @returns any 
     * @throws ApiError
     */
    public static devicesControllerGetDevices(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/devices',
        });
    }

    /**
     * Remove a device
     * @returns any 
     * @throws ApiError
     */
    public static devicesControllerRemoveDevice({
deviceId,
}: {
deviceId: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/devices/{deviceId}',
            path: {
                'deviceId': deviceId,
            },
        });
    }

}
