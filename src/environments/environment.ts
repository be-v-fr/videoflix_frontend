import { HttpHeaders } from "@angular/common/http";

export const environment = {
    AUTH_TOKEN_HEADERS: new HttpHeaders().set('Authorization', 'Token ' + localStorage.getItem('token')),
    BASE_URL: 'http://localhost:8000/api/',
};