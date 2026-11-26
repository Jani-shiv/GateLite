/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateWalkInDto = {
    /**
     * Flat ID for the visit
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
     * Purpose of visit
     */
    purpose: any;
    /**
     * Type of visitor
     */
    visitorType: 'VISITOR' | 'DELIVERY' | 'CAB' | 'STAFF';
    /**
     * Photo URL of visitor
     */
    photoUrl?: string;
};
