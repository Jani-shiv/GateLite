/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateWalkInDto = {
    properties: {
        flatId: {
    description: `Flat ID for the visit`,
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
        purpose: {
    description: `Purpose of visit`,
    properties: {
    },
    isRequired: true,
},
        visitorType: {
    type: 'Enum',
    isRequired: true,
},
        photoUrl: {
    type: 'string',
    description: `Photo URL of visitor`,
},
    },
} as const;
