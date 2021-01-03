import React, {useEffect, useState} from 'react';
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
import {Input} from 'react-native-elements';
import CountDown from 'react-native-countdown-component';
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-toast-message';

var _ = require('lodash');

const unsubscribe = NetInfo.addEventListener(state => {
    console.log("Connection type", state.type);
    console.log("Is connected?", state.isConnected);
});
let isNetworkWorking;
NetInfo.fetch().then(state => {
    isNetworkWorking = state.isConnected;
    console.log("isNetworkWorking", isNetworkWorking)
});


let currentQuiz = []

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

function RandomQuiz({navigation}){
    const readQuizes = async () => {
        try {
            let value = await AsyncStorage.getItem('quizes');
            if (value !== null) {
                return value;
            }
        } catch (error) {
            return null;
        }
    }
    const readQuiz = async (id) => {
        try {
            let value = await AsyncStorage.getItem(id);
            if (value !== null) {
                return value;
            }
        } catch (e) {
            return null;
        }
    }
    var quiz;
    let quizid;
    function randomQuiz(){
        readQuizes().then((value) => JSON.parse(value))
            .then((json) => {
                var s = _.shuffle(json);
                if(s[0].id == "5eaefb3b0e44b1621d02ac7e"){
                    quiz = s[1];
                }else{
                    quiz = s[0];
                }
                console.log(JSON.stringify(quiz));
                quizid = quiz.id;
                readQuiz(quiz.id)
                    .then((response) => JSON.parse(response))
                    .then((json) => {
                        let r = json;
                        r.tasks = _.shuffle(r.tasks);
                        r.tasks.forEach(item => {
                            item.answers = _.shuffle(item.answers);
                        });
                        currentQuiz = r;
                    })
                    .catch((error) => console.error(error))
                    .finally(() => (navigation.navigate('Test', quizid)));

            })

    }
    return(
      <SafeAreaView>
          <Text style={styles.testTitle}>Random Quiz</Text>
          <TouchableOpacity style={styles.testAnswerButton} onPress={() => randomQuiz()}>
              <Text>Start random Quiz</Text>
          </TouchableOpacity>
      </SafeAreaView>
    );
}

function FetchQuizes({navigation}) {
    let data;
    const [onLoadText, setText] = useState("");
    const saveQuizes = async (quizes) => {
        try {
            await AsyncStorage.setItem('quizes', JSON.stringify(quizes));
        } catch (e) {
            console.log("error: saveQuizes");
        }
    }
    const saveQuiz = async (id, value) => {
        try {
            await AsyncStorage.setItem(id.toString(), value);
        } catch (e) {
            console.log("error: quiz", id);
        }
    }
    const saveLastUpdated = async () => {
        try {
            let d = new Date().getDate();
            await AsyncStorage.setItem('lastUpdated', d.toString());
        } catch (e) {
            console.log("error: lastUpdated");
        }
    }

    fetch('http://tgryl.pl/quiz/tests')
        .then((response) => response.json())
        .then((json) => {
            var s = _.shuffle(json);
            data = s;
            console.log("data",data);

        })
        .catch((error) => console.error(error))
        .finally(() => {
            saveQuizes(data).then();
            console.log(JSON.stringify(data));
            data.forEach(item => {
                console.log(item.id);
                fetch('http://tgryl.pl/quiz/test/' + item.id)
                    .then((response) => response.json())
                    .then((json) => {
                        saveQuiz(item.id, JSON.stringify(json)).then();
                    })
            });
            saveLastUpdated().then();
        });
    useEffect(() =>navigation.navigate('Home'));
    return (
        <SafeAreaView>
        </SafeAreaView>
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
    const [quizes, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let needUpdate = false;
        readLastUpdated().then((result) => {
            let d = new Date().getDate();
            if (d.toString() != result) {
                needUpdate = true;
            }
            console.log("currentDay:", d);
            console.log("lastUpdatedDay:", result);
            console.log("needUpdate", needUpdate);
        });
        if (isNetworkWorking) {
            fetch('http://tgryl.pl/quiz/tests')
                .then((response) => response.json())
                .then((json) => {
                    var s = _.shuffle(json);
                    setData(s);
                })
                .catch((error) => console.error(error))
                .finally(() => {
                    if (needUpdate) {
                        saveQuizes(quizes);
                        console.log(JSON.stringify(quizes));
                        quizes.forEach(item => {
                            console.log(item.id);
                            fetch('http://tgryl.pl/quiz/test/' + item.id)
                                .then((response) => response.json())
                                .then((json) => {
                                    saveQuiz(item.id, JSON.stringify(json))
                                })
                                .catch((error) => console.error(error))
                                .finally();
                        });
                        saveLastUpdated();
                    }
                });
        } else {
            readQuizes().then((value) => JSON.parse(value))
                .then((json) => {
                    var s = _.shuffle(json);
                    setData(s);
                })
                .catch((error) => console.error(error));
            console.log(quizes);
        }


    }, []);


    const tosHandler = async () => {
        try {
            const value = await AsyncStorage.getItem('@storage_Key')
            if (value !== null) {
            } else {
                navigation.navigate('ToS');
            }
        } catch (e) {
            // error reading value
        }
    }
    tosHandler().then();
    const saveQuizes = async (quizes) => {
        try {
            await AsyncStorage.setItem('quizes', JSON.stringify(quizes));
        } catch (e) {
            console.log("error: saveQuizes");
        }
    }
    const saveQuiz = async (id, value) => {
        try {
            await AsyncStorage.setItem(id.toString(), value);
        } catch (e) {
            console.log("error: quiz", id);
        }
    }
    const saveLastUpdated = async () => {
        try {
            let d = new Date().getDate();
            await AsyncStorage.setItem('lastUpdated', d.toString());
        } catch (e) {
            console.log("error: lastUpdated");
        }
    }
    const readQuizes = async () => {
        try {
            let value = await AsyncStorage.getItem('quizes');
            if (value !== null) {
                return value;
            }
        } catch (error) {
            return null;
        }
    }
    const readLastUpdated = async () => {
        try {
            let value = await AsyncStorage.getItem("lastUpdated");
            if (value !== null) {
                return value;
            }
        } catch (e) {
            return null;
        }
    }
    const readQuiz = async (id) => {
        try {
            let value = await AsyncStorage.getItem(id);
            if (value !== null) {
                return value;
            }
        } catch (e) {
            return null;
        }
    }

    function rekinHandler(id) {
        if (isNetworkWorking) {
            fetch('http://tgryl.pl/quiz/test/' + id)
                .then((response) => response.json())
                .then((json) => {
                    let r = json;
                    r.tasks = _.shuffle(r.tasks);
                    r.tasks.forEach(item => {
                        item.answers = _.shuffle(item.answers);
                    });
                    currentQuiz = r;
                })
                .catch((error) => console.error(error))
                .finally(() => (navigation.navigate('Test', {id})));
        } else {
            readQuiz(id)
                .then((response) => JSON.parse(response))
                .then((json) => {
                    let r = json;
                    r.tasks = _.shuffle(r.tasks);
                    r.tasks.forEach(item => {
                        item.answers = _.shuffle(item.answers);
                    });
                    currentQuiz = r;
                })
                .catch((error) => console.error(error))
                .finally(() => (navigation.navigate('Test', {id})));
        }
    }


    return (
        <SafeAreaView style={styles.safeAreaMain}>
            <ScrollView>
                {quizes.map((item, id) =>
                    <QuizBox title={item.name} onClick={() => rekinHandler(item.id)} tag1={item.tags[0]}
                             tag2={item.tags[1]}
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
        setTitle(currentQuiz.name);
        if (questionNumber > currentQuiz.tasks.length - 1) {
            finishQuiz();
        } else {
            setTimeLeft(currentQuiz.tasks[questionNumber].duration);
            setQuestion(currentQuiz.tasks[questionNumber].question);
            setAnsA(currentQuiz.tasks[questionNumber].answers[0].content);
            setAnsB(currentQuiz.tasks[questionNumber].answers[1].content);
            setAnsC(currentQuiz.tasks[questionNumber].answers[2].content);
            setAnsD(currentQuiz.tasks[questionNumber].answers[3].content);
        }
    }

    function clickedAnswer(answer) {
        console.log("click")
        if (currentQuiz.tasks[questionNumber].answers[answer].isCorrect) {
            colorCorrect(answer);
            setCorrect(correct + 1);
        } else {
            colorIncorrect(answer);
        }
        if (questionNumber <= currentQuiz.tasks.length - 1) {
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
        setSendVisible(true);
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
    const [name, setName] = useState("Your name");
    const [sendVisible, setSendVisible] = useState(false);

    function semdRemsults() {
        const obj = {
            nick: name,
            score: correct,
            total: currentQuiz.tasks.length,
            type: currentQuiz.tags.join(',')
        }
        if (isNetworkWorking) {
            fetch(`http://tgryl.pl/quiz/result`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            }).then(r => (navigation.navigate('Results')))
            setSendVisible(false);
        } else {
            Toast.show({
                text1: 'No internet connection found'
            });
        }
    }

    return (
        <SafeAreaView>
            <Toast ref={(ref) => Toast.setRef(ref)}/>
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
            <View><Text style={styles.testTitle}>{correct}/{currentQuiz.tasks.length}</Text></View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                <Text onPress={() => navigation.navigate('Results')}>Results</Text>
            </View>
            <View style={!sendVisible && styles.hidden}>
                <Input
                    placeholder="Your name"
                    leftIcon={{type: 'font-awesome', name: 'comment'}}
                    style={styles}
                    onChangeText={value => setName(value)}
                />
                <TouchableOpacity style={styles.testAnswerButton} onPress={() => semdRemsults()}>
                    <Text>Send Results</Text>
                </TouchableOpacity>
            </View>


        </SafeAreaView>
    );
}

function Results({navigation}) {
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    useEffect(() => {
        if (isNetworkWorking) {
            fetch('http://tgryl.pl/quiz/results')
                .then((response) => response.json())
                .then((json) => setData(json.reverse()))
                .catch((error) => console.error(error))
                .finally(() => setLoading(false));
        } else {
            Toast.show({
                text1: 'No internet connection found'
            });
        }
    }, []);
    const handleOnRefresh = () => {
        setRefreshing(true);
        if (isNetworkWorking) {
            fetch('http://tgryl.pl/quiz/results')
                .then((response) => response.json())
                .then((json) => setData(json.reverse()))
                .catch((error) => console.error(error))
                .finally(() => setLoading(false));
        } else {
            Toast.show({
                text1: 'No internet connection found'
            });
        }
        setTimeout(() => {
            setRefreshing(false)
        }, 1000)
    }

    return (
        <SafeAreaView style={styles.flexColumn}>
            <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 20, flex: 0.1}}>
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
            <View style={{marginBottom: 180}}>
                <FlatList
                    data={data}
                    renderItem={({item}) =>
                        <ResultDataBox user={item.nick} points1={item.score} points2={item.total} type={item.type}
                                       date={item.date}/>
                    }
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh}/>}
                    keyExtractor={() => {
                    }}
                />
            </View>
            <Toast ref={(ref) => Toast.setRef(ref)}/>
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
                <Drawer.Screen name="Update Quizes" component={FetchQuizes}/>
                <Drawer.Screen name="Random Quiz" component={RandomQuiz}/>
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
