import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/account';
import { API_BASE_URL } from '../config';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private signinUrl = `${API_BASE_URL}/signin`;
    private signupUrl = `${API_BASE_URL}/signup`;
    

    constructor(private http: HttpClient) {

    }

    signIn(account: Account): Observable<any> {
        return this.http.post(this.signinUrl, account);
    }

    signUp(account: Account): Observable<any> {
        return this.http.post(this.signupUrl, account);
    }
}
