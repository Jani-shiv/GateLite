/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkCreateInvoiceDto } from '../models/BulkCreateInvoiceDto';
import type { CreateInvoiceDto } from '../models/CreateInvoiceDto';
import type { VerifyPaymentDto } from '../models/VerifyPaymentDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BillingService {

    /**
     * Create invoice (admin only)
     * @returns any 
     * @throws ApiError
     */
    public static billingControllerCreateInvoice({
requestBody,
}: {
requestBody: CreateInvoiceDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/billing/invoices',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get invoices
     * @returns any 
     * @throws ApiError
     */
    public static billingControllerFindInvoices({
page,
limit,
status,
flatId,
}: {
page: number,
limit: number,
status: string,
flatId: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/invoices',
            query: {
                'page': page,
                'limit': limit,
                'status': status,
                'flatId': flatId,
            },
        });
    }

    /**
     * Bulk create invoices (admin only)
     * @returns any 
     * @throws ApiError
     */
    public static billingControllerBulkCreateInvoices({
requestBody,
}: {
requestBody: BulkCreateInvoiceDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/billing/invoices/bulk',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get invoice details
     * @returns any 
     * @throws ApiError
     */
    public static billingControllerFindInvoice({
id,
}: {
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/invoices/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Initiate payment for invoice
     * @returns any 
     * @throws ApiError
     */
    public static billingControllerInitiatePayment({
id,
}: {
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/billing/invoices/{id}/pay',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Verify payment callback
     * @returns any 
     * @throws ApiError
     */
    public static billingControllerVerifyPayment({
requestBody,
}: {
requestBody: VerifyPaymentDto,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/billing/payments/verify',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get payments
     * @returns any 
     * @throws ApiError
     */
    public static billingControllerGetPayments({
invoiceId,
status,
}: {
invoiceId: string,
status: string,
}): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/payments',
            query: {
                'invoiceId': invoiceId,
                'status': status,
            },
        });
    }

    /**
     * Get outstanding dues
     * @returns any 
     * @throws ApiError
     */
    public static billingControllerGetOutstandingDues(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/dues',
        });
    }

}
