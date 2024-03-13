import { HttpHeaders } from "@angular/common/http";
import {  NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";

// endpoint
const API_VERSION: string = 'v1';
export const API_BASE_URL: string = `/api/${API_VERSION}`;

// websocket
export const WEB_SOCKET_PUBLIC_ENDPOINT: string = `/public`;
export const WEB_SOCKET_PRIVATE_ENDPOINT: string = `/private`;

// ng-bootstrap modal config 
export const NGB_MODAL_OPTIONS: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false
};

// http config
export const HEADER = new HttpHeaders({
    'Content-Type': 'application/json',
});