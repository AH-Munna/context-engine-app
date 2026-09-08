import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLORS, FONTS } from '../../constants/theme';
import NeomorphCard from '../ui/NeomorphCard';

type Props = {
    title : string;
    update ?: string;
    image ?: any;
    name?:any;
    tags?:any;
    profile?:any;
    bookmark ?:any,
    navigate ?:any,
}

const CardStyle2 = ({title,image,update,name,tags,profile,bookmark,navigate} : Props) => {
    
     const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const navigation = useNavigation<any>();

    return (
        <NeomorphCard
            fixed
            width={250}
            containerStyle={{marginRight:15}}
            style={{
                backgroundColor:colors.cardBg,
                borderRadius:12,
            }}
        >
            <View
                style={{
                    width:250,
                    backgroundColor:colors.cardBg,
                    borderRadius:12,
                }}
            >
                <View
                    style={{
                        paddingHorizontal:8,
                        paddingTop:8,
                        paddingBottom:5,
                        position:'relative',
                    }}
                >
                    <Image
                        style={{
                            width:'100%',
                            borderRadius:10,
                            height:150,
                        }}
                        source={image}
                    />
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{
                            height:40,
                            width:40,
                            borderRadius:20,
                            backgroundColor: bookmark ? COLORS.primary : COLORS.primayLight3,
                            borderWidth:2,
                            borderColor: colors.cardBg,
                            position:'absolute',
                            alignItems:'center',
                            justifyContent:'center',
                            zIndex:1,
                            bottom:-15,
                            right:20,
                            shadowColor: 'rgba(0,0,0,.6)',
                            shadowOffset: {
                                width: 0,
                                height: 4,
                            },
                            shadowOpacity: 0.30,
                            shadowRadius: 4.65,
                            elevation: 8,
                        }}
                    >
                        <FontAwesome name={bookmark ? 'bookmark' : 'bookmark-o'} color={bookmark ? COLORS.white : COLORS.primary} size={16} />
                    </TouchableOpacity>
                </View>
                <View style={{
                    paddingHorizontal:15,
                    paddingVertical:12,
                }}>
                    <View style={{flexDirection:'row',marginBottom:10}}>
                        {tags && tags.map((data:any,index:any) => {
                            return(
                                <TouchableOpacity 
                                    key={index}
                                    style={{
                                        backgroundColor:COLORS.primayLight,
                                        paddingHorizontal:8,
                                        paddingVertical:2,
                                        borderRadius:6,
                                        marginRight:8,
                                    }}
                                >
                                    <Text style={{...FONTS.fontSm,color:COLORS.primary,marginBottom:1}}>{data}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    <TouchableOpacity onPress={() => navigate && navigation.navigate(navigate)}>
                        <Text style={{...FONTS.h6,fontSize:15,color:colors.title,marginBottom:10}}>{title}</Text>
                    </TouchableOpacity>
                    <View style={{
                        flexDirection:'row',
                        alignItems:'center',
                        marginBottom:5,
                    }}>
                        <Image
                            style={{
                                height:28,
                                width:28,
                                borderRadius:28,
                                marginRight:8,
                            }}
                            source={profile}
                        />
                        <Text style={{...FONTS.font,color:colors.title}}>{name}</Text>
                        <View
                            style={{
                                height:4,
                                width:4,
                                borderRadius:4,
                                backgroundColor: colors.text,
                                opacity:.4,
                                marginHorizontal:6,
                                marginTop:2,
                            }}
                        />
                        <Text style={{...FONTS.fontSm,color:colors.textLight}}>{update}</Text>
                    </View>
                </View>
            </View>
        </NeomorphCard>
    );
};

export default CardStyle2;
