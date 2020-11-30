import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';

class ResultDataBox extends Component {
    render() {
        const {user, points, type, date} = this.props;
        return (
            <View>
                <View style={styles.resultsDataSpacer}></View>
                <View style={styles.resultsData}>
                    <Text style={styles.resultsDataColumns}>{user}</Text>
                    <Text style={styles.resultsDataColumns}>{points}</Text>
                    <Text style={styles.resultsDataColumns}>{type}</Text>
                    <Text style={styles.resultsDataColumns}>{date}</Text>
                </View>
                <View style={styles.resultsDataSpacer2}></View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
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
    }
});


export default ResultDataBox;
