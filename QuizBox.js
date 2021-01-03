import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, SafeAreaView} from 'react-native';

class QuizBox extends Component {
    render() {
        const{title, tag1, tag2, text, onClick} = this.props;
        return(
            <TouchableOpacity style={styles.quizBox} onPress={onClick}>
                <Text style={styles.quizBoxTitle}>{title}</Text>
                <View style={styles.quizBoxTagBox}>
                    <Text style={styles.quizBoxTag}>{tag1}</Text>
                    <Text style={styles.quizBoxTag}>{tag2}</Text>
                </View>
                <Text>{text}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    quizBox: {
        borderWidth: 1,
        marginLeft:20,
        marginRight:20,
        marginBottom:5,
        marginTop: 20,
        padding: 10,
    },
    quizBoxTitle: {
        fontSize: 20,
        fontFamily: "Rotobo-Black",
        color: "#222",
    },
    quizBoxTag: {
        paddingRight: 10,
        fontFamily: "Roboto-MediumItalic",
        color: "#2137BD",
    },
    quizBoxTagBox: {
        flexDirection: 'row',
    }
});

export default QuizBox;
