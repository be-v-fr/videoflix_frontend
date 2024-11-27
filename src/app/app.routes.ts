import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { VideoComponent } from './components/video/video.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { ImprintComponent } from './components/imprint/imprint.component';
import { AuthComponent } from './components/auth/auth.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'video',
        component: VideoComponent,
    },
    {
        path: 'auth',
        component: AuthComponent,
        children: [
            {path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'signup', component: SignupComponent },
            { path: 'login', component: LoginComponent },            
        ],
    },
    {
        path: 'legal',
        children: [
            { path: 'privacy', component: PrivacyComponent },
            { path: 'imprint', component: ImprintComponent },
        ],
    },
];
