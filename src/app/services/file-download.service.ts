import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_BASE_URL } from "../config";

@Injectable({
    providedIn: 'root'
})
export class FileDownloadService {

    private FILE_BASE_URL: string = `${API_BASE_URL}/files`;

    constructor(private http: HttpClient) { }

    getFile(fileName: string): Observable<any> {
        const URL: string = `${this.FILE_BASE_URL}/downloadFile/${fileName}`;
        return this.http.get<any>(URL);
    }
}