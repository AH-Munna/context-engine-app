import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import SoftShadow from '../ui/SoftShadow';

const SearchBar = (props : any) => {

     const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
        <SoftShadow
            flex
            borderRadius={10}
            backgroundColor={colors.card}
            style={{
                backgroundColor: colors.card,
                borderRadius: 10,
            }}
        >
            <TextInput
                style={{
                    height:48,
                    backgroundColor: colors.card,
                    paddingHorizontal:15,
                    borderRadius:10,
                    color:colors.title,
                }}
                placeholder='Search Article'
                placeholderTextColor={colors.text}
            />
            <TouchableOpacity
                style={{
                    position:'absolute',
                    height:48,
                    width:48,
                    alignItems:'center',
                    justifyContent:'center',
                    right:0,
                    top:0,
                }}
            >
                <FeatherIcon name={'search'} size={22} color={colors.title} />
            </TouchableOpacity>
        </SoftShadow>
    );
};


export default SearchBar;
