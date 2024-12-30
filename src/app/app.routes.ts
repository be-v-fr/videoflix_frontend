import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { VideoComponent } from './components/video/video.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { ImprintComponent } from './components/imprint/imprint.component';
import { AuthComponent } from './components/auth/auth.component';
import { RequestPwResetComponent } from './components/auth/pw-reset/request-pw-reset/request-pw-reset.component';
import { PwResetComponent } from './components/auth/pw-reset/pw-reset.component';
import { PerformPwResetComponent } from './components/auth/pw-reset/perform-pw-reset/perform-pw-reset.component';
import { AccountActivationComponent } from './components/auth/account-activation/account-activation.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

export const routes: Routes = [
    {
        path: 'welcome',
        component: LandingPageComponent,
    },
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'video/:id',
        component: VideoComponent,
    },
    {
        path: 'auth',
        component: AuthComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'signup', component: SignupComponent },
            { path: 'signup/:email', component: SignupComponent },
            { path: 'signup/activate', redirectTo: 'signup', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            {
                path: 'pwReset',
                component: PwResetComponent,
                children: [
                    { path: '', redirectTo: 'request', pathMatch: 'full' },
                    { path: 'request', component: RequestPwResetComponent },
                    { path: 'perform', redirectTo: 'request', pathMatch: 'full' },
                    { path: 'perform/:token', component: PerformPwResetComponent },
                ]
            },
        ],
    },
    {
        path: 'auth/signup/activate/:token',
        component: AccountActivationComponent },
    {
        path: 'legal',
        children: [
            { path: 'privacy', component: PrivacyComponent },
            { path: 'imprint', component: ImprintComponent },
        ],
    },
];
