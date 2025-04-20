const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adicione a configuração para preservar o estado durante o Fast Refresh
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];
config.transformer.unstable_allowRequireContext = true;

// Configuração para manter o estado de navegação
config.resetCache = false;

module.exports = config;