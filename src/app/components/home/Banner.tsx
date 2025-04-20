import React from "react";
import { View, Text, ImageSourcePropType } from "react-native";
import globalStyles from "../globalStyle/styles";

interface BannerProps {
  title: string;
  subtitle: string;
  openingHours?: string;
}

const Banner: React.FC<BannerProps> = ({ title, subtitle, openingHours = "Não informado" }) => {
  return (
    <View style={globalStyles.banner}>
      <Text style={globalStyles.bannerTitle}>{title}</Text>
      <Text style={globalStyles.bannerSubtitle}>{subtitle}</Text>
    </View>
  );
};

export default Banner;
