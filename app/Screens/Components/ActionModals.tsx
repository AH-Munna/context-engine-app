import { useTheme } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { SvgXml } from 'react-native-svg';
import FeatherIcon from "react-native-vector-icons/Feather";
import OptionBar from '../../components/Modal/OptionBar';
import SuccessModal from '../../components/Modal/SuccessModal';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { FONTS, SIZES } from '../../constants/theme';
import Header from '../../layout/Header';

const option = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="svg-main-icon">
<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <rect x="0" y="0" width="24" height="24"/>
    <path d="M8,3 L8,3.5 C8,4.32842712 8.67157288,5 9.5,5 L14.5,5 C15.3284271,5 16,4.32842712 16,3.5 L16,3 L18,3 C19.1045695,3 20,3.8954305 20,5 L20,21 C20,22.1045695 19.1045695,23 18,23 L6,23 C4.8954305,23 4,22.1045695 4,21 L4,5 C4,3.8954305 4.8954305,3 6,3 L8,3 Z" fill="#FE9063" opacity="0.3"/>
    <path d="M11,2 C11,1.44771525 11.4477153,1 12,1 C12.5522847,1 13,1.44771525 13,2 L14.5,2 C14.7761424,2 15,2.22385763 15,2.5 L15,3.5 C15,3.77614237 14.7761424,4 14.5,4 L9.5,4 C9.22385763,4 9,3.77614237 9,3.5 L9,2.5 C9,2.22385763 9.22385763,2 9.5,2 L11,2 Z" fill="#FE9063"/>
    <rect fill="#FE9063" opacity="0.3" x="10" y="9" width="7" height="2" rx="1"/>
    <rect fill="#FE9063" opacity="0.3" x="7" y="9" width="2" height="2" rx="1"/>
    <rect fill="#FE9063" opacity="0.3" x="7" y="13" width="2" height="2" rx="1"/>
    <rect fill="#FE9063" opacity="0.3" x="10" y="13" width="7" height="2" rx="1"/>
    <rect fill="#FE9063" opacity="0.3" x="7" y="17" width="2" height="2" rx="1"/>
    <rect fill="#FE9063" opacity="0.3" x="10" y="17" width="7" height="2" rx="1"/>
</g>
</svg>`;

const success = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="svg-main-icon">
<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <rect x="0" y="0" width="24" height="24"/>
    <path d="M4,4 L11.6314229,2.5691082 C11.8750185,2.52343403 12.1249815,2.52343403 12.3685771,2.5691082 L20,4 L20,13.2830094 C20,16.2173861 18.4883464,18.9447835 16,20.5 L12.5299989,22.6687507 C12.2057287,22.8714196 11.7942713,22.8714196 11.4700011,22.6687507 L8,20.5 C5.51165358,18.9447835 4,16.2173861 4,13.2830094 L4,4 Z" fill="#38a957" opacity="0.3"/>
    <path d="M11.1750002,14.75 C10.9354169,14.75 10.6958335,14.6541667 10.5041669,14.4625 L8.58750019,12.5458333 C8.20416686,12.1625 8.20416686,11.5875 8.58750019,11.2041667 C8.97083352,10.8208333 9.59375019,10.8208333 9.92916686,11.2041667 L11.1750002,12.45 L14.3375002,9.2875 C14.7208335,8.90416667 15.2958335,8.90416667 15.6791669,9.2875 C16.0625002,9.67083333 16.0625002,10.2458333 15.6791669,10.6291667 L11.8458335,14.4625 C11.6541669,14.6541667 11.4145835,14.75 11.1750002,14.75 Z" fill="#38a957"/>
</g>
</svg>`;

const ActionModals = (props : any) => {

     const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const [activeSheet , setActiveSheet] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const ActionData = [
        {
            icon : option,
            title : "Option Modal",
            sheet : 'option',
        },
        {
            icon : success,
            title : "Success Modal",
            sheet : 'success',
        },
    ]

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={{
                    alignItems:'center',
                    justifyContent:'center',
                    flex:1,
                    position:'relative',
                }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setModalVisible(false)}
                        style={{
                            position:'absolute',
                            height:'100%',
                            width:'100%',
                            backgroundColor:'rgba(0,0,0,.3)',
                        }}
                    />
                    {activeSheet === "option" ?
                        <OptionBar/> :
                        <SuccessModal/>
                    }
                </View>
            </Modal>

            <SafeAreaView style={{flex:1,backgroundColor:colors.card}}>
                <View style={{
                    flex:1,
                    backgroundColor:colors.background,
                }}>
                    <Header title={'Modal Box'} bgWhite leftIcon={'back'}/>
                    <ScrollView>
                        <View style={GlobalStyleSheet.container}>
                            <View style={{
                                backgroundColor:colors.cardBg,
                                borderRadius:SIZES.radius,
                                paddingVertical:10,
                                //overflow:'hidden',
                                shadowColor: "rgba(0,0,0,.8)",
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                                shadowOpacity: 0.30,
                                shadowRadius: 4.65,

                                elevation: 8,
                            }}>
                                {ActionData.map((data,index) => {
                                    return(
                                        <Ripple
                                            onPress={() => {setActiveSheet(data.sheet);setModalVisible(true)}}
                                            key={index}
                                            style={[{
                                                flexDirection:'row',
                                                alignItems:'center',
                                                paddingHorizontal:15,
                                                paddingVertical:12,
                                                borderBottomWidth:1,
                                                borderColor:colors.borderColor,
                                            },
                                            index === ActionData.length - 1 && {
                                                borderBottomWidth:0,
                                            }
                                            ]}
                                        >
                                            <SvgXml
                                                xml={data.icon}
                                                style={{marginRight:10}}
                                            />
                                            <Text style={{...FONTS.h6,flex:1,color:colors.title}}>{data.title}</Text>
                                            <FeatherIcon color={colors.text} name={'chevron-right'} size={22}/>
                                        </Ripple>
                                    )
                                })}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
};

export default ActionModals;