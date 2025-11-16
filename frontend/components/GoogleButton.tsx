import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Platform,
    ViewStyle,
    Image,
} from 'react-native';

type Props = {
    onSuccess?: () => void;
    label?: string;
    style?: ViewStyle;
};

const GoogleButton: React.FC<Props> = ({ onSuccess, label = 'Sign in with Google', style }) => {
    return (
        <TouchableOpacity
            style={[styles.button, style]}
            activeOpacity={0.85}
            onPress={onSuccess}
        >
            <Image
                source={{
                    uri: 'https://developers.google.com/identity/images/g-logo.png',
                }}
                style={styles.googleIcon}
            />

            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

export default GoogleButton;

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        paddingHorizontal: 16,

        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#dadce0',

        width: '100%',
        maxWidth: 360,
        alignSelf: 'center',

        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },

    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 12,
    },

    label: {
        color: '#3c4043',
        fontSize: 16,
        fontWeight: '500',
    },
});