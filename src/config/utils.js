import { Dimensions, Platform } from 'react-native';
import { Constants } from 'expo';

export const STAR_SIZE = 12;
export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;
export const RATIO = WIDTH / HEIGHT;
// export const DIRECTIONS_ICON_SIZE = WIDTH > 450 ? 60 : 40;
export const DIRECTIONS_ICON_SIZE = RATIO < 0.4619 || WIDTH > 450 ? 55 : 40;
export const MODEL = Platform.OS === 'ios' ? Constants.platform.ios.model : Constants.platform;
