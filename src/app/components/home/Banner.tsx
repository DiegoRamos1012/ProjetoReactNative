import React from "react";
import { View, Text } from "react-native";
import globalStyles from "../globalStyle/styles";
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet } from "react-native";

interface BannerProps {
  title: string;
  subtitle: string;
  socialMedia?: string;
}

const Banner: React.FC<BannerProps> = ({ title, subtitle, socialMedia }) => {
  return (
    <View style={globalStyles.banner}>
      <View style={styles.titleContainer}>
        <Icon name="cut" size={24} color="#000" style={styles.icon} />
        <Text style={globalStyles.bannerTitle}>{title}</Text>
      </View>
      
      <View style={styles.subtitleContainer}>
        <Icon name="star" size={18} color="#000" style={styles.icon} />
        <Text style={globalStyles.bannerSubtitle}>{subtitle}</Text>
      </View>
      
      <View style={styles.socialContainer}>
        <Icon name="instagram" size={20} color="#000" style={styles.icon} />
        <Text style={globalStyles.bannerSubtitle}>@barbeariaavilajf</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  }
});

export default Banner;
