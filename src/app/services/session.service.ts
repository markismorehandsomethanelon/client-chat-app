import { User } from "../models/user";


export class SessionService {

    private static CURRENT_USER_KEY: string = "currentUser";

    static getCurrentUser(): User {
        return JSON.parse(sessionStorage.getItem(SessionService.CURRENT_USER_KEY));
    }

    static setCurrentUser(currentUser: User): void {
        sessionStorage.setItem(SessionService.CURRENT_USER_KEY, JSON.stringify(currentUser));
    }
    
}