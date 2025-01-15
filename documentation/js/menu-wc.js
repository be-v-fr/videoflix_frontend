'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">videoflix-frontend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AccountActivationComponent.html" data-type="entity-link" >AccountActivationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AuthComponent.html" data-type="entity-link" >AuthComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BackBtnComponent.html" data-type="entity-link" >BackBtnComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CustomCheckboxComponent.html" data-type="entity-link" >CustomCheckboxComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogComponent.html" data-type="entity-link" >DialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogContinueWatchingComponent.html" data-type="entity-link" >DialogContinueWatchingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogVideoDetailsComponent.html" data-type="entity-link" >DialogVideoDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DurationComponent.html" data-type="entity-link" >DurationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DynamicPwIconComponent.html" data-type="entity-link" >DynamicPwIconComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EmailComponent.html" data-type="entity-link" >EmailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FooterComponent.html" data-type="entity-link" >FooterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormErrorComponent.html" data-type="entity-link" >FormErrorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeComponent.html" data-type="entity-link" >HomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ImprintComponent.html" data-type="entity-link" >ImprintComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LandingPageComponent.html" data-type="entity-link" >LandingPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoadingCircleComponent.html" data-type="entity-link" >LoadingCircleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LogoComponent.html" data-type="entity-link" >LogoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NavigationComponent.html" data-type="entity-link" >NavigationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NavSearchComponent.html" data-type="entity-link" >NavSearchComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PerformPwResetComponent.html" data-type="entity-link" >PerformPwResetComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PlayerComponent.html" data-type="entity-link" >PlayerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PrivacyComponent.html" data-type="entity-link" >PrivacyComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PwResetComponent.html" data-type="entity-link" >PwResetComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RequestPwResetComponent.html" data-type="entity-link" >RequestPwResetComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SearchComponent.html" data-type="entity-link" >SearchComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SignupComponent.html" data-type="entity-link" >SignupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ToastNotificationComponent.html" data-type="entity-link" >ToastNotificationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VideoCardComponent.html" data-type="entity-link" >VideoCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VideoComponent.html" data-type="entity-link" >VideoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VideoPreviewComponent.html" data-type="entity-link" >VideoPreviewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VideosCategoryComponent.html" data-type="entity-link" >VideosCategoryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WatchingProgressComponent.html" data-type="entity-link" >WatchingProgressComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/VideoCompletion.html" data-type="entity-link" >VideoCompletion</a>
                            </li>
                            <li class="link">
                                <a href="classes/VideoMeta.html" data-type="entity-link" >VideoMeta</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AutoscrollService.html" data-type="entity-link" >AutoscrollService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DialogService.html" data-type="entity-link" >DialogService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ErrorService.html" data-type="entity-link" >ErrorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StyleService.html" data-type="entity-link" >StyleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VideosService.html" data-type="entity-link" >VideosService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ConditionalErrorMsg.html" data-type="entity-link" >ConditionalErrorMsg</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});