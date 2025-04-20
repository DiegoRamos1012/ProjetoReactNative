import React from "react";
import { View, Text } from "react-native";
import globalStyles from "../globalStyle/styles";

interface BannerProps {
  title: string;
  subtitle: string;
}

const Banner: React.FC<BannerProps> = ({ title, subtitle }) => {
  return (
    <View style={globalStyles.bannerEnhanced}>
      <Text style={globalStyles.bannerTitleEnhanced}>{title}</Text>
      <Text style={globalStyles.bannerSubtitleEnhanced}>{subtitle}</Text>
    </View>
  );
};

export default Banner;
