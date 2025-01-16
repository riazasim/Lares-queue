// export interface OrganizationModel {
//     id?: number;
//     name: string;
//     logo: string | File | Blob | null;
//     cover: string | File | Blob | null;
//     bookingFormIsActivated: boolean;
//     privacyLink: string;
//     locationName: string;
//     locationId: number;
//
//     userId: number;
//     organization?: any;
// }

export interface OrganizationModel {
    id?: number;
    name: string;
    imgLogo: string | File | Blob | null;
    imgCover: string | File | Blob | null;
    bookingFormIsActivated: boolean;
    privacyLink: string;
    locationName: string;
    locationId: number;
    userId: number;
    organization?: any;
}
