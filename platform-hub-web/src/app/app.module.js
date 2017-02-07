/* eslint angular/window-service: 0 */

import angular from 'angular';

import 'angular-animate';
import 'angular-aria';
import 'angular-base64';
import 'angular-cookies';
import 'angular-jwt';
import 'angular-loading-bar';
import 'angular-material';
import 'angular-material-sidemenu';
import 'angular-messages';
import 'angular-sanitize';
import 'angular-ui-router';
import 'angular-url-encode';

import moment from 'moment';
import lodash from 'lodash';

import {HomeModule} from './home/home.module';
import {IdentitiesModule} from './identities/identities.module';
import {LayoutModule} from './layout/layout.module';
import {ProjectsModule} from './projects/projects.module';
import {SharedModule} from './shared/shared.module';
import {UsersModule} from './users/users.module';

import {appConfig} from './app.config';
import {appRoutes} from './app.routes';
import {appRun} from './app.run';

import 'normalize.css';
import 'angular-material/angular-material.css';  // Make sure this is available across the app
import 'angular-material-sidemenu/dest/angular-material-sidemenu.css';
import './app.scss';

const name = 'app';

// Config + routes
angular
  .module(name, [
    HomeModule,
    IdentitiesModule,
    LayoutModule,
    ProjectsModule,
    SharedModule,
    UsersModule,
    'angular-jwt',
    'angular-loading-bar',
    'base64',
    'bc.AngularUrlEncode',
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMaterial',
    'ngMaterialSidemenu',
    'ngMessages',
    'ngSanitize',
    'ui.router'
  ])
  .config(appConfig)
  .config(appRoutes);

// Top level dependencies as injectable AngularJS constants
angular
  .module(name)
  .constant('moment', moment)
  .constant('_', lodash);

// App specific constants
const apiEndpoint = '/api';
angular
  .module(name)
  .constant('apiEndpoint', apiEndpoint);

// Run function
angular
  .module(name)
  .run(appRun);