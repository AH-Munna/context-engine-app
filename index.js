/**
 * @format
 */

import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Primary registration for ContextEngine
AppRegistry.registerComponent(appName, () => App);

// Backward-compatible alias for existing native builds expecting "SeeYouLater"
AppRegistry.registerComponent('SeeYouLater', () => App);

