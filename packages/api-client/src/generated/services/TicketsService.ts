/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddCommentDto } from '../models/AddCommentDto';
import type { CreateTicketDto } from '../models/CreateTicketDto';
import type { UpdateTicketDto } from '../models/UpdateTicketDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TicketsService {

    /**
     * Create a ticket
     * @returns any 
     * @throws ApiError
     */
    public static ticketsControllerCreate({
requestBody,
}: {
requestBody: CreateTicketDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tickets',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get all tickets
     * @returns any 
     * @throws ApiError
     */
    public static ticketsControllerFindAll({
page,
limit,
status,
category,
priority,
flatId,
}: {
page: number,
limit: number,
status: string,
category: string,
priority: string,
flatId: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tickets',
            query: {
                'page': page,
                'limit': limit,
                'status': status,
                'category': category,
                'priority': priority,
                'flatId': flatId,
            },
        });
    }

    /**
     * Get ticket statistics
     * @returns any 
     * @throws ApiError
     */
    public static ticketsControllerGetStats(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tickets/stats',
        });
    }

    /**
     * Get ticket details
     * @returns any 
     * @throws ApiError
     */
    public static ticketsControllerFindOne({
id,
}: {
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tickets/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Update ticket
     * @returns any 
     * @throws ApiError
     */
    public static ticketsControllerUpdate({
id,
requestBody,
}: {
id: string,
requestBody: UpdateTicketDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/tickets/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Add comment to ticket
     * @returns any 
     * @throws ApiError
     */
    public static ticketsControllerAddComment({
id,
requestBody,
}: {
id: string,
requestBody: AddCommentDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tickets/{id}/comments',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get ticket categories
     * @returns any 
     * @throws ApiError
     */
    public static ticketsControllerGetCategories(): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tickets/meta/categories',
        });
    }

}
