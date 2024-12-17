import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Subject } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { Router } from "@angular/router";
import { User } from "../models/user";


/**
 * This injectable handles backend user authentication.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly AUTH_URL: string = environment.BASE_URL + 'auth/';
    private timeoutErrorMsg: string = 'Server does not respond. Please refresh the page and try again.';
    public currentUser$: Subject<User | null> = new Subject<User | null>();
    public currentUser: User | null = null;
    public resettingPw: boolean = false;

    constructor(
        private http: HttpClient,
        private router: Router,
    ) { }


    /**
     * Register user
     * @param name user name
     * @param email user email
     * @param password user password
     * @returns authentication result
     */
    async register(email: string, password: string): Promise<Object> {
        const url = this.AUTH_URL + 'signup/';
        const body = {
            email: email,
            password: password,
        };
        return lastValueFrom(this.http.post(url, body));
    }


    /**
     * Complete password reset
     * @param password new password
     * @param token password reset token
     * @returns authentication result
     */
    async activateAccount(key: string): Promise<Object> {
        const url = this.AUTH_URL + 'signup/activate/';
        const body = {
            token: key,
        };
        return lastValueFrom(this.http.post(url, body));
    }


    /**
     * Log in user (with password and email)
     * @param email user email
     * @param password user password
     * @returns authentication result
     */
    async login(email: string, password: string): Promise<Object> {
        const url = this.AUTH_URL + 'login/';
        const body = {
            email: email,
            password: password,
        };
        const promise: Promise<Object> = lastValueFrom(this.http.post(url, body));
        const timeout: Promise<string> = this.requestTimeout();
        const result: Object | string = await Promise.race([promise, timeout]);
        if (result == 'timeout') {
            throw (this.timeoutErrorMsg);
        }
        return promise;
    }


    onLogin(loginResp: any) {
        try {
            this.setLocalSessionToken(loginResp.token);
            this.triggerUser(loginResp);
        } catch {
            throw new Error('Invalid login response:', loginResp);
        }
    }


    async authenticateToken(): Promise<Object> {
        const url = this.AUTH_URL + 'user/';
        const promise: Promise<Object> = lastValueFrom(this.http.get(url));
        const timeout: Promise<string> = this.requestTimeout();
        const result: Object | string = await Promise.race([promise, timeout]);
        if (result == 'timeout') {
            throw (this.timeoutErrorMsg);
        }
        return promise;
    }


    triggerUser(userData: any) {
        if(userData) {
            this.currentUser = (userData instanceof User) ? userData : new User(userData);
        } else {
            this.currentUser = null;
        }
        this.currentUser$.next(this.currentUser);
    }


    async requestTimeout(): Promise<string> {
        await new Promise((res) => setTimeout(res, 3000));
        return 'timeout';
    }

    /**
     * Request password reset email
     * @param email user email address
     * @returns authentication result
     */
    async requestPasswordReset(email: string): Promise<Object> {
        const url = this.AUTH_URL + 'reset-pw/request/';
        const body = {
            email: email,
        };
        return lastValueFrom(this.http.post(url, body));
    }


    /**
     * Complete password reset
     * @param password new password
     * @param token password reset token
     * @returns authentication result
     */
    async performPasswordReset(newPassword: string, key: string): Promise<Object> {
        const url = this.AUTH_URL + 'reset-pw/perform/';
        const body = {
            token: key,
            new_password: newPassword,
        };
        return lastValueFrom(this.http.post(url, body));
    }


    /**
     * Log in as guest.
     */
    async logInAsGuest(): Promise<Object> {
        const url = environment.BASE_URL + 'login/guest/';
        const body = {
            username: localStorage.getItem('token') || '',
            email: localStorage.getItem('token') + '@token.key' || '',
            password: 'guestlogin',
        };
        const promise: Promise<Object> = lastValueFrom(this.http.post(url, body));
        const timeout: Promise<string> = this.requestTimeout();
        const result: Object | string = await Promise.race([promise, timeout]);
        if (result == 'timeout') {
            throw (this.timeoutErrorMsg);
        }
        return promise;
    }


    /**
     * Log out (both as guest and registered user)
     * @returns log out result
     */
    logout(): void {
        this.deleteLocalSessionToken();
        this.currentUser$.next(null);
    }


    /**
     * Removes the session token from the local storage.
     */
    deleteLocalSessionToken(): void {
        localStorage.removeItem('token');
    }


    /**
     * Sets the session token in the local storage.
     * @param tokenValue Value of token
     */
    setLocalSessionToken(tokenValue: string): void {
        localStorage.setItem('token', tokenValue);
    }


    getTimeoutErrorMsg(): string {
        return this.timeoutErrorMsg;
    }
}