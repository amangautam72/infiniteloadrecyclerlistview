/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar, Dimensions
} from 'react-native';

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import App from './App';
import { Provider } from 'react-redux';


import axios from 'axios';
import { act } from 'react-test-renderer';

export const FETCHING_DATA = 'FETCHING_DATA'
export const FETCHED_SUCCESSFULLY = 'FETCHED_SUCCESSFULLY'
export const FETCHING_FAILED = 'FETCHING_FAILED'

const apiEndPoint = "https://swapi.dev/api/people/";

const initialState = {
    data: [],
    isLoading: false,
    error: false,
  
}

export function fetchDataReducer(state = initialState, action) {

    switch (action.type) {
      case FETCHING_DATA:
        return {
          ...state,
          isLoading: true,
        }
      case FETCHED_SUCCESSFULLY:
          console.log("PAGE : " + action.page)
        return {
           ...state,
            //data: [action.response], 
           data:action.page > 1 ? [...state.data,action.response] : [action.response],
          isLoading: false,
        }
      case FETCHING_FAILED:
        return {
          ...state,
          isLoading: false,
          message: action.message,
          error: true,
        }
      default:
        return state
    }
  }

const store = createStore(fetchDataReducer, applyMiddleware(thunk))


function fetchindData() {

    return {
      type: FETCHING_DATA,
    }
  }
  
  function dataFetched(data,pageno) {
    return {
      type: FETCHED_SUCCESSFULLY,
      response: data ,
      page: pageno
    }
  }
  
  
    function fetchingFailed(message) {
    return {
      type: FETCHING_FAILED,
      message: message,
  
    }
  }
  
  
  export function fetchDataApi(page) {
      console.log("Page: " + page)
    return (dispatch) => {
        dispatch(fetchindData())
      axios.get(apiEndPoint + page)
        .then(response => {
          console.log(response.data);
          dispatch(dataFetched(response.data,page))
        })
        .catch(error => {
          console.log(error);
          dispatch(fetchingFailed())
        });
  
  
    }
  }





const InfiniteLoad = () => {

  return (
    <Provider store={store}>
        <App></App>
     </Provider>

  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },

});

export default InfiniteLoad;
