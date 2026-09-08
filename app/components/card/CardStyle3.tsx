import React from 'react';
import { Image, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FONTS } from '../../constants/theme';
import NeomorphCard from '../ui/NeomorphCard';

type Props = {
    title : string;
    update ?: string;
    image ?: any;
    tags?:any;
}

const CardStyle3 = ({title,update,image,tags} : Props) => {
    
     const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
        <NeomorphCard
            containerStyle={{marginBottom:10}}
            style={{
                padding:15,
                backgroundColor: colors.cardBg,
                borderRadius:12,
                flexDirection:'row',
            }}
        >
            <View style={{flex:1,paddingRight:15}}>
                <Text style={{...FONTS.fontXs,color:colors.text,marginBottom:4}}>{tags && tags[0]}</Text>
                <Text numberOfLines={2} style={{...FONTS.h6,fontSize:14,color:colors.title,marginBottom:4}}>{title}</Text>
                <Text style={{...FONTS.fontXs,color:colors.textLight}}>{update}</Text>
            </View>
            <Image
                style={{
                    width:100,
                    height:80,
                    borderRadius:10,
                }}
                source={image}
            />
        </NeomorphCard>
    );
};


export default CardStyle3;
