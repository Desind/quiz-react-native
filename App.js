import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from "@react-navigation/stack";
import {createDrawerNavigator} from '@react-navigation/drawer';
import QuizBox from "./QuizBox";
import {StackActions} from "@react-navigation/routers";
import ResultDataBox from "./ResultDataBox";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlatList} from "react-native";
import {RefreshControl} from "react-native";
import CountDown from 'react-native-countdown-component';

let quizes = [
    {
        "name": "Wiedza o muzyce współczesnej",
        "tag1": "#Metal",
        "tag2": "#Deathcore",
        "description": "Test sprawdzający wiedzę o współczesnej muzyce metalowej",
        "tasks": [
            {
                "question": "Której literze z w alfabecie morsa odpowiada rytm z intro Meshuggah - Bleed",
                "answers": [
                    {
                        "content": "A",
                        "isCorrect": false,
                    },
                    {
                        "content": "F",
                        "isCorrect": false,
                    },
                    {
                        "content": "G",
                        "isCorrect": false,
                    },
                    {
                        "content": "V",
                        "isCorrect": true,
                    },
                ],
                "duration": 20
            },
            {
                "question": "Co jest najlepszą częścią piosenki",
                "answers": [
                    {
                        "content": "Refren",
                        "isCorrect": false,
                    },
                    {
                        "content": "Blastbeat",
                        "isCorrect": true,
                    },
                    {
                        "content": "Breakdown",
                        "isCorrect": false,
                    },
                    {
                        "content": "Intro",
                        "isCorrect": false,
                    },
                ],
                "duration": 18
            },
            {
                "question": "Josean Orta jest perkusistą w zespole",
                "answers": [
                    {
                        "content": "Thy Art is Murder",
                        "isCorrect": false,
                    },
                    {
                        "content": "Cattle Decapitation",
                        "isCorrect": false,
                    },
                    {
                        "content": "Infant Anihilator",
                        "isCorrect": false,
                    },
                    {
                        "content": "Fit For an Autopsy",
                        "isCorrect": true,
                    },
                ],
                "duration": 17
            }
        ]

    },
    {
        "name": "Quiz 2",
        "tag1": "#tag1",
        "tag2": "#tag2",
        "description": "Description of a quiz",
        "tasks": [
            {
                "question": "Poprawne A",
                "answers": [
                    {
                        "content": "A",
                        "isCorrect": true,
                    },
                    {
                        "content": "B",
                        "isCorrect": false,
                    },
                    {
                        "content": "C",
                        "isCorrect": false,
                    },
                    {
                        "content": "D",
                        "isCorrect": false,
                    },
                ],
                "duration": 5
            },
            {
                "question": "Poprawne te, które nie są F, I, J",
                "answers": [
                    {
                        "content": "F",
                        "isCorrect": false,
                    },
                    {
                        "content": "K",
                        "isCorrect": true,
                    },
                    {
                        "content": "J",
                        "isCorrect": false,
                    },
                    {
                        "content": "I",
                        "isCorrect": false,
                    },
                ],
                "duration": 4
            },
            {
                "question": "2+2*2/2",
                "answers": [
                    {
                        "content": "2",
                        "isCorrect": false,
                    },
                    {
                        "content": "4",
                        "isCorrect": true,
                    },
                    {
                        "content": "8",
                        "isCorrect": false,
                    },
                    {
                        "content": "6",
                        "isCorrect": false,
                    },
                ],
                "duration": 20
            }
        ]
    }
]

let results = [
    {
        "nick": "nick1",
        "score": 1,
        "total": 20,
        "type": "historia",
        "date": "22-11-2020"
    },
    {
        "nick": "nick2",
        "score": 5,
        "total": 20,
        "type": "historia",
        "date": "22-11-2020"
    },
    {
        "nick": "nick3",
        "score": 4,
        "total": 20,
        "type": "historia",
        "date": "22-11-2020"
    },
    {
        "nick": "nick4",
        "score": 20,
        "total": 20,
        "type": "historia",
        "date": "22-11-2020"
    }
]

function Home({navigation}) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home Page" component={Main}/>
            <Stack.Screen name="Test" component={Test}/>
            <Stack.Screen name="Results" component={Results}/>
            <Stack.Screen name="ToS" component={ToS}/>
        </Stack.Navigator>
    );
}

function ToS({navigation}) {
    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem('@storage_Key', value)
        } catch (e) {
            // saving error
        }
    }
    return (
        <SafeAreaView>
            <ScrollView style={styles.TOSBlock}>
                <Text>1. Terms of Service</Text>
                <Text>2. Terms of Service</Text>
                <Text>3. Terms of Service</Text>
                <Text>4. Terms of Service</Text>
            </ScrollView>
            <TouchableOpacity style={styles.TOSButton} onPress={() => {
                storeData("yep");
                const temp = console.error;
                console.error = () => {
                };
                navigation.dispatch(StackActions.popToTop());
                console.error = temp;
                navigation.navigate('Home');
            }}><Text style={styles.testTitle}>ACCEPT</Text></TouchableOpacity>
        </SafeAreaView>
    );
}

function Main({navigation}) {
    const tosHandler = async () => {
        try {
            const value = await AsyncStorage.getItem('@storage_Key')
            if (value !== null) {
            } else {
                console.log("1");
                navigation.navigate('ToS');
            }
        } catch (e) {
            // error reading value
        }
    }
    tosHandler();


    return (
        <SafeAreaView style={styles.safeAreaMain}>
            <ScrollView>
                {quizes.map((item, id) =>
                    <QuizBox title={item.name} onClick={() => navigation.navigate('Test', {id})} tag1={item.tag1}
                             tag2={item.tag2}
                             text={item.description}/>
                )}
            </ScrollView>
        </SafeAreaView>
    );

}


function Test({route, navigation}) {
    console.log("test");

    function initiateQuestion() {
        console.log("initquestion")
        setTitle(quizes[id].name);
        if (questionNumber > quizes[id].tasks.length - 1) {
            finishQuiz();
        } else {
            setTimeLeft(quizes[id].tasks[questionNumber].duration);
            setQuestion(quizes[id].tasks[questionNumber].question);
            setAnsA(quizes[id].tasks[questionNumber].answers[0].content);
            setAnsB(quizes[id].tasks[questionNumber].answers[1].content);
            setAnsC(quizes[id].tasks[questionNumber].answers[2].content);
            setAnsD(quizes[id].tasks[questionNumber].answers[3].content);
        }
    }

    function clickedAnswer(answer) {
        console.log("click")
        if (quizes[id].tasks[questionNumber].answers[answer].isCorrect) {
            colorCorrect(answer);
            setCorrect(correct + 1);
        } else {
            colorIncorrect(answer);
        }
        if (questionNumber <= quizes[id].tasks.length - 1) {
            setTimeout(() => {
                setAnsAColor("#bbb");
                setAnsBColor("#bbb");
                setAnsCColor("#bbb");
                setAnsDColor("#bbb");

                setQuestionNumber(questionNumber + 1);
                initiateQuestion(questionNumber);

            }, 1000)
        }
    }

    function finishQuiz() {
        console.log("rekin");
        setFinished(true);
    }

    function colorCorrect(rekin) {
        switch (rekin) {
            case 0:
                setAnsAColor("#80cc80");
                break;
            case 1:
                setAnsBColor("#80cc80");
                break;
            case 2:
                setAnsCColor("#80cc80");
                break;
            case 3:
                setAnsDColor("#80cc80");
                break;
        }
    }

    function colorIncorrect(rekin) {
        switch (rekin) {
            case 0:
                setAnsAColor("#ff8080");
                break;
            case 1:
                setAnsBColor("#ff8080");
                break;
            case 2:
                setAnsCColor("#ff8080");
                break;
            case 3:
                setAnsDColor("#ff8080");
                break;
        }
    }

    const {id} = route.params;
    useEffect(() => {
        initiateQuestion(questionNumber);
    });
    const [finished, setFinished] = useState(false)
    const [title, setTitle] = useState("Title");
    const [question, setQuestion] = useState("Question")
    const [questionNumber, setQuestionNumber] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [barSize, setBarSize] = useState(1);
    const [ansA, setAnsA] = useState("A");
    const [ansB, setAnsB] = useState("B");
    const [ansC, setAnsC] = useState("C");
    const [ansD, setAnsD] = useState("D");
    const [correct, setCorrect] = useState(0);
    const [ansAColor, setAnsAColor] = useState("#bbb");
    const [ansBColor, setAnsBColor] = useState("#bbb");
    const [ansCColor, setAnsCColor] = useState("#bbb");
    const [ansDColor, setAnsDColor] = useState("#bbb");
    return (
        <SafeAreaView>
            <View style={finished && styles.hidden}>
                <Text style={styles.testTitle}>{title}</Text>
                <View style={styles.flexRow}>
                    <Text style={styles.testQuestionNumber}>Question: {questionNumber + 1}</Text>
                </View>
                <Text style={styles.testQuestion}>{question}</Text>
                <View style={styles.flexColumn}>
                    <TouchableOpacity onPress={() => clickedAnswer(0)}
                                      style={[styles.testAnswerButton, {backgroundColor: ansAColor}]}><Text>{ansA}</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => clickedAnswer(1)}
                                      style={[styles.testAnswerButton, {backgroundColor: ansBColor}]}><Text>{ansB}</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => clickedAnswer(2)}
                                      style={[styles.testAnswerButton, {backgroundColor: ansCColor}]}><Text>{ansC}</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => clickedAnswer(3)}
                                      style={[styles.testAnswerButton, {backgroundColor: ansDColor}]}><Text>{ansD}</Text></TouchableOpacity>
                </View>

            </View>
            <View style={!finished && styles.hidden}>
                <Text style={styles.testTitle}>Result:</Text>
            </View>
            <View><Text style={styles.testTitle}>{correct}/{quizes[id].tasks.length}</Text></View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                <Text onPress={() => navigation.navigate('Results')}>Results</Text>
            </View>

        </SafeAreaView>
    );
}

function Results({navigation}) {
    const [refreshing, setRefreshing] = useState(false);
    const handleOnRefresh = () => {
        setRefreshing(true);
        results = [
            {
                "nick": "nick1",
                "score": 1,
                "total": 20,
                "type": "historia",
                "date": "22-11-2020"
            },
            {
                "nick": "nick2",
                "score": 5,
                "total": 20,
                "type": "historia",
                "date": "22-11-2020"
            },
            {
                "nick": "nick3",
                "score": 4,
                "total": 20,
                "type": "historia",
                "date": "22-11-2020"
            },
            {
                "nick": "nick4",
                "score": 20,
                "total": 20,
                "type": "historia",
                "date": "22-11-2020"
            },
            {
                "nick": "nick5",
                "score": 20,
                "total": 20,
                "type": "historia",
                "date": "22-11-2020"
            }
        ]
        setTimeout(() => {
            setRefreshing(false)
        }, 1000)
    }
    const renderItem = ({pack}) => (
        <ResultDataBox user={pack.nick} points1={pack.score} points2={pack.total} type={pack.type} date={pack.date}/>

    );

    return (
        <SafeAreaView style={styles.flexColumn}>
            <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                <Text onPress={() => {
                    const temp = console.error;
                    console.error = () => {
                    };
                    navigation.dispatch(StackActions.popToTop());
                    console.error = temp;
                    navigation.navigate('Home');
                }}>Home Screen</Text>
            </View>
            <View style={styles.resultsTitle}>
                <Text style={styles.resultsTitleColumns}>User</Text>
                <Text style={styles.resultsTitleColumns}>Points</Text>
                <Text style={styles.resultsTitleColumns}>Type</Text>
                <Text style={styles.resultsTitleColumns}>Date</Text>
            </View>
            <View>
                <FlatList
                    data={results}
                    renderItem={({item}) =>
                        <ResultDataBox user={item.nick} points1={item.score} points2={item.total} type={item.type}
                                       date={item.date}/>
                    }
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh}/>}
                    keyExtractor={() => {
                    }}
                />
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
        textAlign: "center",
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
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 5,
        padding: 15,
    },
    testTimeBar: {
        flexDirection: "row",
        borderWidth: 1,
        margin: 10,
        marginBottom: 0,
    },
    testTime: {
        backgroundColor: "#BD2137",
        flex: 0.7,
        height: 10,
    },
    resultsTitle: {
        flexDirection: 'row',
        backgroundColor: "#ccc",
        margin: 10,
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
    resultsDataSpacer: {
        borderWidth: 0.5,
        margin: 5,
        marginBottom: 0,
        marginTop: 0,
    },
    resultsDataSpacer2: {
        borderWidth: 0.5,
        margin: 5,
        marginBottom: 5,
        marginTop: 0,
    },
    TOSBlock: {
        padding: 10,
        margin: 10,
    },
    TOSButton: {
        backgroundColor: "#c0c0c0",
        margin: 20,
    },
    hidden: {
        display: 'none',
    },
});


export default App;

