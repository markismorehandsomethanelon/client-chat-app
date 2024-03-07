import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/account';
import { API_BASE_URL } from '../config';
import { ChangePasswordRequest } from '../requests/change-password.request';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private signinUrl = `${API_BASE_URL}/signin`;
    private signupUrl = `${API_BASE_URL}/signup`;
    private accountUrl = `${API_BASE_URL}/accounts`;

    constructor(private http: HttpClient) {

    }

    signIn(account: Account): Observable<any> {
        return this.http.post(this.signinUrl, account);
    }

    signUp(account: Account): Observable<any> {
        return this.http.post(this.signupUrl, account);
    }

    changePassword(request: ChangePasswordRequest): Observable<any> {
        return this.http.put(this.accountUrl, request);
    }
}
