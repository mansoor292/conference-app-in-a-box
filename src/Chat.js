import React, { Component } from 'react';
import {Platform, AppState, KeyboardAvoidingView, ScrollView, TextInput, StyleSheet, Text, View, Dimensions } from 'react-native';
import  NetInfo from '@react-native-community/netinfo';
import { API, graphqlOperation, Auth } from 'aws-amplify'
import Constants from 'expo-constants'
import { GiftedChat } from 'react-native-gifted-chat'

import { listComments } from './graphql/queries'
import { onCreateComment as OnCreateComment } from './graphql/subscriptions'
import { createComment } from './graphql/mutations'
import { colors, dimensions, typography } from './theme'

const DEVICE_ID = Constants.installationId
const { width } = Dimensions.get('window')
import uuid from 'react-native-uuid';
const chatid = uuid.parse('fa729d3f-6aca-4880-91ef-bf88ddc96e36');

export default class Discussion extends Component {
  static navigationOptions = () => ({
    title: "Chat"
  })
  state = { comments: [], message: '', subscribed: false }
  scroller = React.createRef()
  subscription = {}

  async componentDidMount() {
    this.subscribe()
    AppState.addEventListener('change', this.handleAppStateChange)
    Platform.OS!='web' && NetInfo.addEventListener(state => this.netInfoChange);
    const { route: { params } } = this.props
    try {
      const commentData = await API.graphql(
        graphqlOperation(listComments, ))
      const { data: { listComments: { items } } } = commentData
      const comments = items.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      this.setState({ comments }, () => {
        setTimeout(() => {
          this.scroller.current.scrollToEnd({ animated: false })
        }, 50)
      })
    }
    catch (err) {
      console.log('error fetching comments: ', err)
    }
    try {
      const { username } = await Auth.currentAuthenticatedUser()
      this.setState({ username })
    }
    catch (err) { console.log('error fetching user info: ', err) }
  }
  componentWillUnmount() {
    this.unsubscribe()
   // NetInfo.unsubscribe();
  }
  handleAppStateChange = (appState) => {
    if (appState === 'active') {
      this.subscribe()
    }
    if (appState === 'background') {
      this.setState({ subscribed: false })
      this.unsubscribe()
    }
  }
  netInfoChange = (state) => {
    if (state.type === 'none') {
      this.unsubscribe()
    }
    else {
      this.subscribe()
    }
  }
  subscribe() {
    if (this.state.subscribed) return
    this.subscription = API.graphql(
        graphqlOperation(OnCreateComment, { talkId: chatid })
      )
      .subscribe({
        next: data => {
          const { value: { data: { onCreateCommentWithId } } } = data
          if (onCreateCommentWithId.deviceId === DEVICE_ID) return
          const comments = [
            ...this.state.comments,
            onCreateCommentWithId
          ]
          this.setState({ comments })
          setTimeout(() => {
            this.scroller.current.scrollToEnd()
          }, 50)
        }
      })
    this.setState({ subscribed: true })
  }
  unsubscribe = () => {
    if (!this.state.subscribed) return
    this.setState({ subscribed: false })
    this.subscription.unsubscribe()
  }




  createMessage = async() => {
    if (!this.state.message) return
    const { message, username } = this.state
    const comments = [...this.state.comments, { message, createdBy: this.state.username }]
    this.setState({ comments, message: '' })
    setTimeout(() => {
      this.scroller.current.scrollToEnd()
    }, 50)
    try {
      console.log(message);
      await API.graphql(graphqlOperation(createComment, {
        input: {
          talkId: chatid,
          message,
          createdBy: username,
          deviceId: DEVICE_ID
        }
      }))
    }
    catch (err) {
      console.log('error: ', err)
    }
  }
  onChangeText = message => {
    this.setState({ message })
  }
  render() {
    return (
      <GiftedChat
        messages={this.state.comments}
        onSend={messages => this.createMessage(messages)}
        user={this.state.username}
      />
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    width,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    fontFamily: typography.primary,
    fontSize: 16
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary
  },
  scrollViewContainer: {
    flex: 1,
  },
  time: {
    color: 'rgba(0, 0, 0, .5)'
  },
  message: {
    fontFamily: typography.primary,
    color: colors.primaryText,
    fontSize: 16
  },
  createdBy: {
    fontFamily: typography.primary,
    color: colors.highlight,
    marginTop: 4
  },
  comment: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: colors.primaryDark,
    borderBottomColor: colors.primaryLight,
    borderBottomWidth: 1
  }
});
