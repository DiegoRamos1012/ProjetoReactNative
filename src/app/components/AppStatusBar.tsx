import React from "react";
import { StatusBar, StatusBarProps } from "react-native";
import { colors } from "./globalStyle/styles";

const AppStatusBar: React.FC<StatusBarProps> = (props) => {
  return (
    <StatusBar
      backgroundColor={colors.darkBlue}
      barStyle="light-content"
      {...props}
    />
  );
};

export default AppStatusBar;
