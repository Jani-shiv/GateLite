/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreatePreApprovedDto = {
    properties: {
        flatId: {
    description: `Flat ID for the pass`,
    properties: {
    },
    isRequired: true,
},
        visitorName: {
    description: `Visitor name`,
    properties: {
    },
    isRequired: true,
},
        visitorPhone: {
    type: 'string',
    description: `Visitor phone number`,
    maxLength: 20,
},
        validFrom: {
    description: `Pass validity start (ISO 8601)`,
    properties: {
    },
    isRequired: true,
},
        validTo: {
    description: `Pass validity end (ISO 8601)`,
    properties: {
    },
    isRequired: true,
},
        usesLeft: {
    description: `Number of uses allowed`,
    properties: {
    },
    isRequired: true,
},
        purpose: {
    type: 'string',
    description: `Purpose of visit`,
    maxLength: 200,
},
    },
} as const;
