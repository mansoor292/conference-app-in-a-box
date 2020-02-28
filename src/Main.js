import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { FontAwesome } from '@expo/vector-icons'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AmplifyTheme from 'aws-amplify-react-native/src/AmplifyTheme'
import { Hub, Auth } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react-native'

import { colors, logo } from './theme'

import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';

const Stack = createStackNavigator();

export function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
          'Gotham Rounded': require('./assets/fonts/GothamRnd-Light.otf'),
          'GothamRnd Medium': require('./assets/fonts/GothamRnd-Medium.otf'),
          'Gotham Bold': require('./assets/fonts/GothamRnd-Bold.otf')
        });
      }
      catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      }
      finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  }
  else {
    return (
      <View style={styles.appContainer}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
          <Stack.Navigator>
            <Stack.Screen name="Root" component={BottomTabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const Logo = () => (
  <View style={styles.logoContainer}>
    <Image
      style={styles.logo}
      resizeMode='contain'
      source={logo}
    />
  </View>
)

const styles = StyleSheet.create({
  appContainer: {
    flex: 1
  },
  logoContainer: {
    marginTop: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    height: 50,
    width: 200
  }
})


const theme = {
  ...AmplifyTheme,
  button: {
    ...AmplifyTheme.button,
    backgroundColor: colors.primaryLight
  },
  sectionFooterLink: {
    ...AmplifyTheme.sectionFooterLink,
    color: colors.primaryLight
  },
  buttonDisabled: {
    ...AmplifyTheme.buttonDisabled,
    backgroundColor: colors.primaryOpaque(0.6)
  }
}


export default withAuthenticator(App, null, null, null, theme);
