import React from "react";
import { View, Text } from "react-native";
import globalStyles from "../globalStyle/styles";

interface BannerProps {
  title: string;
  subtitle: string;
}

const Banner: React.FC<BannerProps> = ({ title, subtitle }) => {
  return (
    <View style={globalStyles.banner}>
      <Text style={globalStyles.bannerTitle}>{title}</Text>
      <Text style={globalStyles.bannerSubtitle}>{subtitle}</Text>
    </View>
  );
};

export default Banner;
