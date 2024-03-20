
export class ChangePasswordRequest {
    userId: number;
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    
    constructor(){
        
    }
}
