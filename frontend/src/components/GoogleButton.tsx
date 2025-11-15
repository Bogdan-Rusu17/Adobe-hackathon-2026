import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Platform,
    GestureResponderEvent,
    ViewStyle,
} from 'react-native';

type Props = {
    onPress?: (event: GestureResponderEvent) => void;
    label?: string;
    style?: ViewStyle;   // <-- ADD THIS
};

const GoogleButton: React.FC<Props> = ({ onPress, label = 'Log in with Google', style }) => {
    return (
        <TouchableOpacity
            style={[styles.button, style]}   // <-- MERGE STYLES
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View style={styles.logoPlaceholder}>
                <Text style={styles.g}>G</Text>
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

export default GoogleButton;

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        width: '86%',
        maxWidth: 360,
        alignSelf: 'center',

        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
            },
            android: {
                elevation: 4,
            },
        }),
    },

    logoPlaceholder: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#EDEDED',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    g: {
        color: '#4285F4',
        fontWeight: '700',
    },

    label: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
