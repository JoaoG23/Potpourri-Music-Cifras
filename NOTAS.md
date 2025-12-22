# Notas

## Mobile

- Comando: npx create-expo-app@latest --template
  use blank ts

- Expo Router 2025: app e reservado somente para telas

- Tipos de navegação:

  - Stack - Voce tem uma tela e abre outra tela por cima (como no navegador - historico de navegação)
    - Static = não permite rotas dinamicas
    - Dynamic = permite rotas dinamicas
  - Drawer - Voce tem uma tela e abre um sidebar lateral.
  - Tabs - Navegação por abas na parte de baixo do app

- Tem button mas tem o componente TouchableOpacity ou Pressable onde é possivel colocar um children e melhores estilizações

---

## Guia de Geração de APK (EAS Build)

Atualmente o método recomendado para gerar APKs no Expo é através do **EAS (Expo Application Services)**.

### Passo a Passo:

1.  **Instalação do CLI**:
    ```cmd
    npm install -g eas-cli
    ```
2.  **Login na Expo**:
    ```cmd
    eas login
    ```
3.  **Configuração Inicial**:
    ```cmd
    eas build:configure
    ```
4.  **Configurar para Gerar APK (`eas.json`)**:
    No arquivo `eas.json`, adicione o `buildType: "apk"` no perfil de `preview`:
    ```json
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
    ```
5.  **Configurações Importantes (`app.json`)**:
    - **Nome do App**: Definir em `"name"`.
    - **Ícone**: Atualizar os caminhos em `"icon"` e `"adaptiveIcon"`.
    - **API Local (HTTP)**: Para permitir conexões com IP local (sem HTTPS), adicione:
      ```json
      "android": { "usesCleartextTraffic": true }
      ```
6.  **Comando para Build (Windows/No-Git)**:
    ```cmd
    set EAS_NO_VCS=1 && eas build -p android --profile preview
    ```

### Soluções de Problemas Recentes:

- **StatusBar**: Use `<StatusBar style="light" />` para fundos escuros e `style="dark"` para fundos brancos para garantir que os ícones da barra de notificação fiquem visíveis.
- **Erro de Git no EAS**: Se o EAS reclamar do Git no Windows, use o prefixo `set EAS_NO_VCS=1`.
- **API não carrega no APK**: Certifique-se de que o `usesCleartextTraffic` está habilitado e que o celular está no mesmo WiFi do servidor.
- **Erro de Build**: Use `set EAS_NO_VCS=1 && eas build -p android --profile preview`