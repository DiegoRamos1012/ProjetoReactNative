# Projeto React Native - Barbearia

## Estrutura de Navegação e Autenticação

Este projeto utiliza o arquivo `index.tsx` como ponto de entrada principal da aplicação, implementando:

- **Persistência de autenticação**: Usando `onAuthStateChanged` do Firebase
- **Feedback de carregamento**: Estado de loading durante verificação de autenticação
- **Tipagem TypeScript**: Tipo `User` do Firebase para melhor segurança de tipos
- **Gestão de sessão**: Logout e visualização de informações do usuário

Qualquer implementação alternativa mais simples (como em arquivos App.tsx anteriores) foi descontinuada em favor desta abordagem mais robusta.

## Fluxo de Autenticação

1. Verificação automática do estado de autenticação ao iniciar o app
2. Exibição de feedback de carregamento durante a verificação
3. Redirecionamento para Login se não houver usuário autenticado
4. Exibição da tela principal com informações do usuário quando autenticado
5. Opção de logout que retorna para a tela de login

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
