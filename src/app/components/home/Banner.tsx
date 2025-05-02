// Componente responsável por exibir o banner com nome do estabelecimento, informações de contato e horário de funcionamento

import React from "react";
import { View, Text } from "react-native";
import globalStyles, { colors } from "../globalStyle/styles";
import { FontAwesome, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
interface BannerProps {
  title: string;
  subtitle: string;
  socialMedia?: string;
  phoneNumber?: string;
}

const Banner: React.FC<BannerProps> = ({
  title,
  subtitle,
  socialMedia,
  phoneNumber,
}) => {
  return (
    <View style={globalStyles.bannerEnhanced}>
      <View style={globalStyles.bannerItemContainer}>
        <MaterialIcons
          name="content-cut"
          size={24}
          color={colors.barber.gold}
          style={globalStyles.bannerIcon}
        />
        <Text style={globalStyles.bannerTitleEnhanced}>{title}</Text>
      </View>

      <View style={globalStyles.bannerItemContainer}>
        <FontAwesome6
          name="clock"
          size={18}
          color={colors.barber.gold}
          style={globalStyles.bannerIcon}
        />
        <Text style={globalStyles.bannerSubtitle}>{subtitle}</Text>
      </View>

      <View style={globalStyles.bannerItemContainer}>
        <FontAwesome6
          name="instagram"
          size={20}
          color={colors.barber.gold}
          style={globalStyles.bannerIcon}
        />
        <Text style={globalStyles.bannerSubtitle}>
          {socialMedia || "@barbeariaavilajf"}
        </Text>
      </View>

      <View style={globalStyles.bannerItemContainer}>
        <FontAwesome6
          name="whatsapp"
          size={20}
          color={colors.barber.gold}
          style={globalStyles.bannerIcon}
        />
        <Text style={globalStyles.bannerSubtitle}>
          {phoneNumber || "+55 12 99607-2065"}
        </Text>
      </View>
      <View style={globalStyles.bannerItemContainer}>
        <FontAwesome
          name="map-marker"
          size={20}
          color={colors.barber.gold}
          style={globalStyles.bannerIcon}
        />
        <Text style={globalStyles.bannerSubtitle}>Av. Rio Buquira, 790 - Altos da Vila Paiva, São José dos Campos - SP</Text>
      </View>
    </View>
  );
};

export default Banner;
