import React from "react";
import { View, Text, Image, TouchableOpacity, StatusBar } from "react-native";
import globalStyles, {
  colors,
} from "../../../app/components/globalStyle/styles";
interface WelcomeScreenProps {
  onLoginPress: () => void;
  onRegisterPress: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onLoginPress,
  onRegisterPress,
}) => (
  <View style={globalStyles.container}>
    <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
    <Image
      source={require("../../../../assets/images/logo-barb.png")}
      style={globalStyles.image}
    />
    <Text style={[globalStyles.title, { marginBottom: 20 }]}>Bem-vindo!</Text>

    <TouchableOpacity style={globalStyles.singleButton} onPress={onLoginPress}>
      <Text style={globalStyles.singleButtonText}>Fazer Login</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[globalStyles.singleButton, { marginTop: 15 }]}
      onPress={onRegisterPress}
    >
      <Text style={globalStyles.singleButtonText}>Cadastrar-se</Text>
    </TouchableOpacity>
  </View>
);

export default WelcomeScreen;
