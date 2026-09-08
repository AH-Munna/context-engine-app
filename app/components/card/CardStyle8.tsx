import React from 'react';
import { Image, Text, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { COLORS, FONTS } from '../../constants/theme';
import NeomorphCard from '../ui/NeomorphCard';

type Props = {
    title : string;
    address ?: string;
    image ?: any;
    price?:any;
    navigate ?:any,
}

const CardStyle8 = ({image,title,address,price,navigate} : Props) => {

     const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const navigation = useNavigation<any>();
    
    return (
        <NeomorphCard
            onPress={() => navigate && navigation.navigate(navigate)}
            containerStyle={{marginBottom:15}}
            style={{
                backgroundColor:colors.cardBg,
                borderRadius:10,
                overflow:'hidden',
            }}
        >
            <View>
                <Image
                    style={{
                        width:'100%',
                        height:140,
                    }}
                    source={image}
                />
                <LinearGradient
                    end={{x: 0.0, y: 0.25}} 
                    start={{x: 0.5, y: 1.0}}
                    locations={[0,0.6,1]}
                    colors={['rgba(0,0,0,0)','rgba(0,0,0,0)','rgba(0,0,0,.5)']}
                    style={{
                        position:'absolute',
                        height:'100%',
                        width:'100%',
                        borderRadius:10,
                        transform:[{rotateY: '180deg'}]
                    }}
                >
                </LinearGradient>
                <View
                    style={{
                        height:40,
                        width:40,
                        borderRadius:40,
                        position:'absolute',
                        top:10,
                        right:10,
                        alignItems:'center',
                        justifyContent:'center',
                        backgroundColor:'rgba(255,255,255,.25)',
                    }}
                >
                    <FeatherIcon color={COLORS.white} size={18} name='heart'/>
                </View>
            </View>
            <View
                style={{
                    paddingHorizontal:14,
                    paddingVertical:15,
                }}
            >
                <Text style={{...FONTS.h6,color:COLORS.primary}}>{price}</Text>
                <Text style={{...FONTS.font,...FONTS.fontBold,color:colors.title}}>{title}</Text>
                <View
                    style={{
                        flexDirection:'row',
                        alignItems:'center',
                        marginTop:5,
                    }}
                >
                    <FeatherIcon style={{marginRight:3}} color={colors.textLight} name='map-pin'/>
                    <Text numberOfLines={1} style={{...FONTS.fontSm,color:colors.textLight}}>{address}</Text>
                </View>
            </View>
        </NeomorphCard>
    );
};


export default CardStyle8;
