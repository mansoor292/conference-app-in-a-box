import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons'

import Schedule from '../Schedule'
import Profile from '../Profile'
//import Map from '../Map'

import { colors, logo } from '../theme'

const BottomTab = createBottomTabNavigator();

const INITIAL_ROUTE_NAME = 'Schedule';

export default function BottomTabNavigator({ navigation, route }) {
	// Set the header title on the parent stack navigator depending on the
	// currently active tab. Learn more in the documentation:
	// https://reactnavigation.org/docs/en/screen-options-resolution.html
	navigation.setOptions({ headerTitle: getHeaderTitle(route) });

	return (
		<BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
			<BottomTab.Screen
				name="Schedule"
				component={Schedule}
				options={{
					title: 'Schedule',
					tabBarIcon: ({ focused }) =><FontAwesome color={tintColor(focused)} size={20} name='calendar' />,
				}}
			/>
			<BottomTab.Screen
				name="Profile"
				component={Profile}
				options={{
					title: 'Profile',
					tabBarIcon: ({ focused }) => <FontAwesome color={tintColor(focused)} size={20} name='user' />,
				}}
			/>

	</BottomTab.Navigator>
	);
}

function tintColor(focused) {
	return focused?colors.highlight:'#fafafa';
}

function getHeaderTitle(route) {
	const routeName = route.state?.routes[route.state.index]?.name??INITIAL_ROUTE_NAME;


	switch (routeName) {
		case 'Profile':
			return 'How to get started';
		case 'Map':
			return 'Find your Way';
		case 'Schedule':
			return '';
	}
}
