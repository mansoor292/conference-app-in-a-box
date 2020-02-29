import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome as Icon } from '@expo/vector-icons'
import { Button, Platform } from 'react-native';

import Schedule from '../Schedule'
import Profile from '../Profile'
import Chat from '../Chat'
//import Map from '../Map'

import { colors, logo } from '../theme'


const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.highlight,
        inactiveTintColor: colors.inactive,
        style: { backgroundColor: colors.primary }
      }}
      screenOptions={screenProps => {
        const { route: { name } } = screenProps
        return {
          tabBarIcon: (props) => {
            console.log('props: ', props)
            const { color } = props
            if (name === 'Schedule') {
              return <Icon color={color} size={20} name='calendar' />
            }
            if (name === 'Chat') {
              return <Icon color={color} size={20} name='users' />
            }
            if (name === 'Map') {
              return <Icon color={color} size={20} name='map' />
            }
            return <Icon color={color} size={20} name='user' />
          }
        }
      }}
    >
      <Tab.Screen name="Schedule" component={Schedule} />
      <Tab.Screen name="Profile" component={Profile}/>
      <Tab.Screen name="Chat" component={Chat}/>
      {Platform.OS!='web' && <Tab.Screen name="Map" component={Map} />}
    </Tab.Navigator>
  );
}

class TabNavWithProps extends React.Component {
  static router = TabNavigator.router
  render() {
    return(
      <TabNavigator screenProps={{...this.props}} {...this.props}  />
    )
  }
}

export default TabNavWithProps;
