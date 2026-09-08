import React from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import SoftShadow from '../ui/SoftShadow';

const SearchBar2 = (props : any) => {

     const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
        <SoftShadow
            flex
            borderRadius={30}
            backgroundColor={colors.card}
            style={{
                backgroundColor: colors.card,
                borderRadius: 30,
            }}
        >
            <TextInput
                style={{
                    height:48,
                    paddingLeft:55,
                    backgroundColor: colors.card,
                    paddingHorizontal:15,
                    borderRadius:30,
                    color:colors.title,
                }}
                placeholder='Try "Tomatos"'
                placeholderTextColor={colors.text}
            />
            <TouchableOpacity
                style={{
                    position:'absolute',
                    height:48,
                    width:48,
                    alignItems:'center',
                    justifyContent:'center',
                    left:5,
                    top:0,
                }}
            >
                <FeatherIcon name={'search'} size={22} color={colors.title} />
            </TouchableOpacity>
        </SoftShadow>
    );
};


export default SearchBar2;
