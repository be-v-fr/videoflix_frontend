import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Subject } from "rxjs";
import { environment } from "../../../environments/environment.development";
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
    ) { }


    /**
     * Registers a new user.
     * @returns {Promise<Object>} A promise that resolves with the authentication result.
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
     * Completes the account activation process using the provided token.
     * @param {string} key The account activation token.
     * @returns {Promise<Object>} A promise that resolves with the authentication result.
     */
    async activateAccount(key: string): Promise<Object> {
        const url = this.AUTH_URL + 'signup/activate/';
        const body = {
            token: key,
        };
        return lastValueFrom(this.http.post(url, body));
    }


    /**
     * Logs in a user using their email and password.
     * @returns {Promise<Object>} A promise that resolves with the authentication result.
     * @throws {string} Timeout error if the request exceeds the specified time limit.
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


    /**
     * Handles the response from a successful login and stores the session token.
     * @param {any} loginResp The login response containing the token.
     */
    onLogin(loginResp: any) {
        try {
            this.setLocalSessionToken(loginResp.token);
            this.triggerUser(loginResp);
        } catch {
            throw new Error('Invalid login response:', loginResp);
        }
    }


    /**
     * Authenticates a user based on the provided token.
     * @returns {Promise<Object>} A promise that resolves with the authentication result.
     * @throws {string} Timeout error if the request exceeds the specified time limit.
     */
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


    /**
     * Updates the current user's data and triggers the `currentUser$` subject.
     * @param {any} userData The user data (either an instance of User or a plain object).
     */
    triggerUser(userData: any) {
        if (userData) {
            this.currentUser = (userData instanceof User) ? userData : new User(userData);
        } else {
            this.currentUser = null;
        }
        this.currentUser$.next(this.currentUser);
    }


    /**
     * Returns a promise that resolves after a 3-second timeout, used for request timeouts.
     */
    async requestTimeout(): Promise<string> {
        await new Promise((res) => setTimeout(res, 3000));
        return 'timeout';
    }


    /**
     * Sends a request to reset the user's password.
     * @returns {Promise<Object>} A promise that resolves with the authentication result.
     */
    async requestPasswordReset(email: string): Promise<Object> {
        const url = this.AUTH_URL + 'reset-pw/request/';
        const body = {
            email: email,
        };
        return lastValueFrom(this.http.post(url, body));
    }


    /**
     * Completes the password reset process using the provided new password and token.
     * @param {string} newPassword The new password.
     * @param {string} key The password reset token.
     * @returns {Promise<Object>} A promise that resolves with the authentication result.
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
     * Logs out the user, both for guest and registered users.
     */
    logout(): void {
        this.deleteLocalSessionToken();
        this.currentUser$.next(null);
    }


    /**
     * Removes the session token from local storage.
     */
    deleteLocalSessionToken(): void {
        localStorage.removeItem('token');
    }


    /**
     * Sets the session token in local storage.
     * @param {string} tokenValue The value of the session token.
     */
    setLocalSessionToken(tokenValue: string): void {
        localStorage.setItem('token', tokenValue);
    }


    /**
     * Returns the timeout error message.
     */
    getTimeoutErrorMsg(): string {
        return this.timeoutErrorMsg;
    }
}