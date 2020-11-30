import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from "@react-navigation/stack";
import {createDrawerNavigator} from '@react-navigation/drawer';
import QuizBox from "./QuizBox";
import {StackActions} from "@react-navigation/routers";
import ResultDataBox from "./ResultDataBox";


function Home({navigation}) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home Page" component={Main}/>
            <Stack.Screen name="Test" component={Test}/>
            <Stack.Screen name="Results" component={Results}/>
        </Stack.Navigator>
    );
}

function Main({navigation}) {
    return (
        <SafeAreaView style={styles.safeAreaMain}>
            <ScrollView>
                <QuizBox title={"Quiz1"} onClick={() => navigation.navigate('Test')} tag1={"#Tag1"} tag2={"#Tag2"}
                         text={"Sample text, sample text, sample text, sample text, sample text, sample text, sample text, sample text, sample text,"}/>
                <QuizBox title={"Quiz2"} onClick={() => navigation.navigate('Test')} tag1={"#Tag1"} tag2={"#Tag2"}
                         text={"Sample text, sample text, sample text, sample text, sample text, sample text, sample text, sample text, sample text,"}/>
                <QuizBox title={"Quiz3"} onClick={() => navigation.navigate('Test')} tag1={"#Tag1"} tag2={"#Tag2"}
                         text={"Sample text, sample text, sample text, sample text, sample text, sample text, sample text, sample text, sample text,"}/>
                <QuizBox title={"Quiz4"} onClick={() => navigation.navigate('Test')} tag1={"#Tag1"} tag2={"#Tag2"}
                         text={"Sample text, sample text, sample text, sample text, sample text, sample text, sample text, sample text, sample text,"}/>
            </ScrollView>
        </SafeAreaView>
    );
}

function Test({navigation}) {
    return (
        <SafeAreaView>
            <View>
                <Text style={styles.testTitle}>Title</Text>
                <View style={styles.flexRow}>
                    <Text style={styles.testQuestionNumber}>Question 21</Text>
                    <Text style={styles.testTimeLeft}>Time: 37s</Text>
                </View>
                <View style={styles.testTimeBar}>
                    <View style={styles.testTime}></View>
                    <View></View>
                </View>
                <Text style={styles.testQuestion}>Some long question only to fill text in this app, and it doesn't
                    provide any other purpose than
                    being long?</Text>
                <View style={styles.flexColumn}>
                    <TouchableOpacity style={styles.testAnswerButton}><Text>A</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.testAnswerButton}><Text>B</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.testAnswerButton}><Text>C</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.testAnswerButton}><Text>D</Text></TouchableOpacity>
                </View>

            </View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop:20}}>
                <Text onPress={() => navigation.navigate('Results')}>Results</Text>
            </View>
        </SafeAreaView>
    );
}

function Results({navigation}) {
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.resultsTitle}>
                    <Text style={styles.resultsTitleColumns}>User</Text>
                    <Text style={styles.resultsTitleColumns}>Points</Text>
                    <Text style={styles.resultsTitleColumns}>Type</Text>
                    <Text style={styles.resultsTitleColumns}>Date</Text>
                </View>
                <ResultDataBox user={"Username 1"} points={"21/40"} type={"Quiz 1"} date={"30/11/20"}/>
                <ResultDataBox user={"Username 2"} points={"37/40"} type={"Quiz 1"} date={"30/11/20"}/>
                <ResultDataBox user={"Desind"} points={"40/40"} type={"Quiz 1"} date={"30/11/20"}/>
                <ResultDataBox user={"Username 1"} points={"21/40"} type={"Quiz 1"} date={"30/11/20"}/>
                <ResultDataBox user={"Username 2"} points={"37/40"} type={"Quiz 1"} date={"30/11/20"}/>
                <ResultDataBox user={"Desind"} points={"40/40"} type={"Quiz 1"} date={"30/11/20"}/>

            </ScrollView>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop:20}}>
                <Text onPress={() => {
                    const temp = console.error;
                    console.error = () => {};
                    navigation.dispatch(StackActions.popToTop());
                    console.error = temp;
                    navigation.navigate('Home');
                }}>Home Screen</Text>
            </View>
        </SafeAreaView>

    );
}

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={Home}/>
                <Drawer.Screen name="Results" component={Results}/>
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    safeAreaMain: {
        marginTop: 0,
    },
    flexRow: {
        flexDirection: 'row',
    },
    flexColumn: {
        flexDirection: 'column',
    },
    testTitle: {
        fontSize: 25,
        color: "#222",
        textAlign: 'center',
        padding: 10,
        paddingTop: 5,
    },
    testQuestionNumber: {
        flex: 1,
        textAlign: "left",
        fontSize: 17,
        marginLeft: 25,
    },
    testTimeLeft: {
        flex: 1,
        textAlign: "right",
        fontSize: 17,
        marginRight: 25,
    },
    testQuestion: {
        textAlign: "center",
        fontSize: 22,
        margin: 10,
    },
    testAnswerButton: {
        borderWidth: 1,
        backgroundColor: "#ccc",
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 5,
        padding: 15,
    },
    testTimeBar:{
        flexDirection: "row",
        borderWidth: 1,
        margin: 10,
        marginBottom: 0,
    },
    testTime:{
        backgroundColor: "#BD2137",
        flex: 0.7,
        height: 10,
    },
    resultsTitle: {
        flexDirection: 'row',
        backgroundColor: "#ccc",
        margin: 10,
        marginBottom: 10,
    },
    resultsTitleColumns: {
        flex: 1,
        borderWidth: 1,
        textAlign: 'center',
        padding: 5,
    },
    resultsData: {
        flexDirection: 'row',
        backgroundColor: "#ddd",
        marginRight: 10,
        marginLeft: 10,
    },
    resultsDataColumns: {
        flex: 1,
        textAlign: 'center',
        padding: 5,
    },
    resultsDataSpacer:{
        borderWidth: 0.5,
        margin:5,
        marginBottom:0,
        marginTop:0,
    },
    resultsDataSpacer2:{
        borderWidth: 0.5,
        margin:5,
        marginBottom:5,
        marginTop:0,
    }
});


export default App;

