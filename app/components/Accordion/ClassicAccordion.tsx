import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Accordion from 'react-native-collapsible/Accordion';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { FONTS } from '../../constants/theme';

const ClassicAccordion = (props:any) => {

     const theme = useTheme();
    const { colors } : {colors : any} = theme;
    const [activeSections, setActiveSections] = useState([0]);
    const setSections = (sections:any) => {
        setActiveSections(
        sections.includes(undefined) ? [] : sections
        );
    };
    
    const SECTIONS = [
        {
            color : '#ffc697',
            title: 'React Native Facts',
            content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        },
        {
            color : '#c5abf5',
            title: 'Android Development Tools',
            content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        },
        {
            color : '#ffb1c0',
            title: 'Know About ios Development',
            content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        },
    ];

    const AccordionHeader = (item:any, _:any, isActive:any) => {
        return(
            <View style={{
                flexDirection:'row',
                alignItems:'center',
                paddingVertical:15,
                paddingHorizontal:15,
                borderLeftWidth:4,
                borderLeftColor:item.color,
            }}>
                {/* <FontAwesome style={{marginRight:10}} name={item.icon} size={15} color={item.color}/> */}
                <Text 
                    style={[FONTS.font,
                        {color:colors.title,fontSize:15,flex:1
                            ,fontFamily:'NunitoSans-SemiBold',
                        }
                    ,isActive && {
                    }]}
                >{item.title}</Text>
                <FontAwesome name={isActive ? 'angle-up' : 'angle-down'} size={20} color={colors.title}/>
            </View>
        )
    }
    const AccordionBody = (item:any, _:any, isActive:any) => {
        return(
            <View style={{
                paddingHorizontal:15,
                paddingBottom:15,
                borderLeftWidth:4,
                borderLeftColor:item.color,
            }}>
                <Text style={[FONTS.font,{color:colors.text}]}>{item.content}</Text>
            </View>
        )
    }

    return (
        <>
            <Accordion
                sections={SECTIONS}
                sectionContainerStyle={{
                    backgroundColor:colors.borderColor,
                    marginBottom:6,
                    borderRadius:6,
                    overflow:'hidden',
                }}
                duration={300}
                activeSections={activeSections}
                onChange={setSections}
                touchableComponent={TouchableOpacity}
                renderHeader={AccordionHeader}
                renderContent={AccordionBody}
            />
        </>
    );
};


export default ClassicAccordion;
