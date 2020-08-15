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
  StatusBar, Dimensions,RefreshControl
} from 'react-native';


import { useSelector, useDispatch } from 'react-redux'


import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import { fetchDataApi } from './InfiniteLoad';

const { width, height } = Dimensions.get("window");



const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2
};

let dataProviderr = new DataProvider((r1, r2) => {
  return r1 !== r2;
});

let layoutProviderr = new LayoutProvider(
  index => 0,
  (type, dim) => {
    dim.width = width;
    dim.height = height;
  },
)

const _generateArray = (n) => {
  let arr = new Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = i;
  }
  return arr;
}

//dataProviderr.cloneWithRows(_generateArray(30))

const App = () => {

  const [dataProvider, setDataProvide] = useState(dataProviderr.cloneWithRows([]));
  const [layoutProvider, setLayoutProvider] = useState(layoutProviderr);
  const [page, setPage] = useState(1);

  const response = useSelector(state => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchDataApi(page))
  }, [])

  useEffect(() => {
    console.log("RESPONSE : " +  JSON.stringify(response))
      setDataProvide(dataProviderr.cloneWithRows(response.data))
  },[response.data])

  useEffect(() => {
   console.log(dataProvider._size) 
  })

  //Given type and data return the view component
  const _rowRenderer = (type, data) => {
    //You can return any view here, CellContainer has no special significance
    switch (type) {

      case ViewTypes.FULL:
        return (

          <View style={{ flex: 1,margin:20 }}>
            <Text style={styles.textStyle}>{data.name}</Text>
            <Text style={styles.textStyle}>{data.height}</Text>
            <Text style={styles.textStyle}>{data.mass}</Text>
            <Text style={styles.textStyle}>{data.hair_color}</Text>
            <Text style={styles.textStyle}>{data.skin_color}</Text>
          </View>

        );
      default:
        return null;
    }
  }

  const handleEnd = () => {

      
      setPage(prevPage => prevPage + 1)
      if(page > 1)
       dispatch(fetchDataApi(page))
  }
  return (

      <View style={{ flex: 1 }}>
        
        
  { response.data.length > 0 &&
        <RecyclerListView 
        //style={{ flex: 1 }}
          layoutProvider={layoutProvider}
          dataProvider={dataProvider}
          rowRenderer={_rowRenderer}
          onEndReached={handleEnd}
          onEndReachedThreshold={10}
          //renderFooter={() => response.isLoading && <Text style={{paddingB:20}}>...Loading</Text>}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl
                refreshing={response.isLoading}
                onRefresh={async () => {
                  setPage(1)
                    //dispatch(fetchDataApi(1))
                  // this.setState({ loading: true });
                  // analytics.logEvent('Event_Stagg_pull_to_refresh');
                  await dispatch(fetchDataApi(1));
                  // this.setState({ loading: false });
                }}
              />
            )
          }}
         />
        }
       
        
          
      </View>


  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  textStyle:{
    padding:20
  }

});

export default App;
