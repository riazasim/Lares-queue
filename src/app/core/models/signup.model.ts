export interface SignupModel {
    user:{
        email: string;
        userRole: string;
     },
    userSetting:{
        firstName: string;
        lastName: string;
        // language: "EN" | "RO";
        // phone: string;
        // phoneRegionCode: string;
    }

}
