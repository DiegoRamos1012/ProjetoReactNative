// Este arquivo é usado para configurar o Metro Bundler, que é o empacotador de módulos usado pelo React Native. O seu principal papel é otimizar
// O processo de refatoração do código atualizando a tela em que o desenvolvedor está, sem perder o estado atual do aplicativo.

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adicione a configuração para preservar o estado durante o Fast Refresh
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];
config.transformer.unstable_allowRequireContext = true;

// Configuração para manter o estado de navegação
config.resetCache = false;

module.exports = config;