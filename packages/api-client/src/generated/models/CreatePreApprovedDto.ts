/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreatePreApprovedDto = {
    /**
     * Flat ID for the pass
     */
    flatId: any;
    /**
     * Visitor name
     */
    visitorName: any;
    /**
     * Visitor phone number
     */
    visitorPhone?: string;
    /**
     * Pass validity start (ISO 8601)
     */
    validFrom: any;
    /**
     * Pass validity end (ISO 8601)
     */
    validTo: any;
    /**
     * Number of uses allowed
     */
    usesLeft: any;
    /**
     * Purpose of visit
     */
    purpose?: string;
};
