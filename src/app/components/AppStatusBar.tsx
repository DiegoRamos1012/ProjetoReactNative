import React from "react";
import { StatusBar } from "react-native";
import { colors } from "./globalStyle/styles";

// Simple component with minimal props
const AppStatusBar = () => {
  return (
    <StatusBar backgroundColor={colors.darkBlue} barStyle="light-content" />
  );
};

export default AppStatusBar;
