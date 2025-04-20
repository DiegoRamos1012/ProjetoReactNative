// Este arquivo é usado para configurar o Metro Bundler, que é o empacotador de módulos usado pelo React Native. O seu principal papel é otimizar
// O processo de refatoração do código atualizando a tela em que o desenvolvedor está, sem perder o estado atual do aplicativo.

const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('cjs'); // Adiciona a extensão .cjs à lista de extensões de ativos

// Crie um módulo vazio simulado para o postinstall.mjs
const fs = require('fs');
const path = require('path');
const postinstallPath = path.join(__dirname, 'node_modules', 'firebase', 'node_modules', '@firebase', 'util', 'dist', 'postinstall.mjs');
const postinstallDir = path.dirname(postinstallPath);

// Garante que o diretório existe
if (!fs.existsSync(postinstallDir)) {
  fs.mkdirSync(postinstallDir, { recursive: true });
}

// Cria um arquivo de módulo vazio se ele não existir
if (!fs.existsSync(postinstallPath)) {
  fs.writeFileSync(postinstallPath, 'export const getDefaultsFromPostinstall = () => ({});');
}

module.exports = {
  resolver: {
    extraNodeModules: {
      // Fornecer implementações vazias para módulos web não suportados no React Native
      idb: require.resolve('react-native/Libraries/Utilities/NativePlatformConstantsIOS'),
    },
    // Adicione esta configuração para ajudar na resolução de módulos
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json', 'mjs']
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  // Manter outras configurações do Expo
  ...defaultConfig
};