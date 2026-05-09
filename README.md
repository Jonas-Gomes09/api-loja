# API-Loja

Esta API é feita somente para fim de testes e não é um produto real, há inclusive funções ainda não implementadas (como PUT e DELETE).

O código, a logo e a empresa do website foram criados por mim. A empresa no website é totalmente fictícia.

### Módulos utilizados:
- Express (e @types/express)
- Typescript (e @types/typescript)
- TSC
- EJS (e @types/ejs)
- PATH
- ts-node-dev

### Dependências
- NodeJS



##
### Executando o código
Espera-se que já se tenha o NodeJS instalado no dispositivo que executará o  servidor.

1. Baixar módulos para executar e editar o código  
Esta operação depende do NodeJS e deve ser feita na pasta raiz do projeto (api-loja)
```
npm install express ejs && npm install -D typescript @types/express @types/node @types/ejs ts-node-dev
```

2. Executar código
```
npm test
```

2.1. Executar código (caso npm test não funcione)
```
npx ts-node-dev src/server.ts
```



##
### Acessando o website

**Acessar no dispositivo em que o código está sendo executado**  
Você pode acessar digitando ou "http://0.0.0.0:3000" ou "http://localhost:3000" ou "http://{IPv4 do dispositivo executando o servidor}:3000" no navegador enquanto o código está sendo executado

**Acessar em outro dispositivo na rede local (LAN)<sup>1</sup>**  
Certifique-se de que tanto o dispositivo executando o servidor quanto o dispositivo que irá acessá-lo estão conectados e na mesma internet (ou conectados via uma VPN). Para acessar você digita "http://{IPv4 do dispositivo executando o servidor}:3000" no navegador enquanto o código está sendo executado, também pode ser acessado em navegadores para celular<sup>2</sup>

1. Caso você não queira que o site possa ser acessado por outros dispositivos na rede altere a linha contendo "export const HOST = '0.0.0.0'" de ./src/variables/index.ts para:
```
export const HOST = 'localhost'
```
2. Dependendo do modelo pode ser que algumas partes do site fiquem cortadas, o CSS foi adaptado para o Samsung Galaxy A36 e não foi testado em outros modelos.


##
### Descobrindo o IPv4 do dispositivo executando o servidor

**Windows (CMD ou PowerShell):**
```
ipconfig
```
Use o IPv4 do dispositivo de wi-fi que está conectado a internet.  
Resposta esperada:  
Adaptador de Rede sem Fio Wi-Fi (este nome pode mudar):

[...]
Endereço IPv4. . . . . . . .  . . . . . . . : {IPv4}

**Linux (Bash):**
```
ip addr show | grep "inet "
```
Use o IPv4 do dispositivo de wi-fi que está conectado a internet.  
Resposta esperada:  
inet {IPv4} [...] scope global ethX (ou wlanX)  

**MacOS (também serve no Linux):**
```
ifconfig
```
Use o IPv4 do dispositivo de wi-fi que está conectado a internet.  
Resposta esperada:  
ethX (ou enX): [...]  
        inet {IPv4}...