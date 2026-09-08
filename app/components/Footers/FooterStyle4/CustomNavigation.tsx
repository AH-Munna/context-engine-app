import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, IMAGES } from '../../../constants/theme';

type Props = {
    state : any,
    navigation : any,
    descriptors : any
}

const CustomNavigation = ({state,navigation,descriptors} : Props) => {
    
     const theme = useTheme();
    const { colors } : {colors : any} = theme;


    return (
        <>
            <View style={{
                height:65,
                flexDirection:'row',
                position:'absolute',
                left: 10,
                right : 10,
                bottom : 10,
                borderRadius: 12,
                backgroundColor: colors.card,
                shadowColor: "rgba(0,0,0,.6)",
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: 0.30,
                shadowRadius: 4.65,

                elevation: 8,
            }}>
                
                {state.routes.map((route:any, index:any) => {

                    const { options } = descriptors[route.key];
                    const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;

                    const isFocused = state.index === index;
                    
                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate({ name: route.name, merge: true });
                        }

                    }

                    return(
                        <View style={styles.tabItem} key={index}>
                            <TouchableOpacity
                                style={styles.tabLink}
                                onPress={onPress}
                            >
                                <Image
                                    style={{
                                        height:20,
                                        width:20,
                                        resizeMode:'contain',
                                        marginBottom:4,
                                        opacity:isFocused ? 1 : .6,
                                        tintColor:isFocused ? COLORS.primary : colors.textLight,
                                    }}
                                    source={
                                        label === "Home" ? IMAGES.home :
                                        label === "Search" ? IMAGES.search:
                                        label === "Post" ? IMAGES.addition:
                                        label === "Chat" ? IMAGES.chat :
                                        label === "Profile" && IMAGES.profile
                                    }
                                />
                                <Text style={{...FONTS.fontSm,...FONTS.fontBold,color:isFocused ? colors.title : colors.textLight}}>{label}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </View>
        </>
    );
};



const styles = StyleSheet.create({
    tabLink:{
        alignItems:'center',
    },
    tabItem:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    navText:{
        ...FONTS.fontSm,
    }
})


export default CustomNavigation;