# Como publicar o Pixima

Guia para publicar o Pixima na **Chrome Web Store** (que também serve para Edge, com a mesma conta de Chrome) e no **Firefox Add-ons**.

> O Google Play é só para apps de Android. Extensão de navegador do Chrome vai para a Chrome Web Store.

Os pontos marcados com **(confirme na tela)** são regras que mudam com o tempo ou que eu não consegui verificar em fonte oficial. Os nomes dos botões e das abas também podem variar com o idioma e com atualizações das lojas. Confira na própria loja antes de enviar.

## Resumo

| | Chrome Web Store | Firefox Add-ons |
|---|---|---|
| Painel do desenvolvedor | [chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole) | [addons.mozilla.org/developers](https://addons.mozilla.org/developers/) |
| Custo | Taxa única de cadastro, historicamente US$ 5 **(confirme na tela)** | Gratuito |
| O que enviar | `pixima-<versão>-chrome.zip` | `pixima-<versão>-firefox.zip` e `pixima-<versão>-sources.zip` |
| Código-fonte | Não pede | Pede, porque o código é empacotado |
| Atenção | Revisão mais cuidadosa por pedir acesso a todos os sites | Escrever como gerar o build a partir do código-fonte |

## Antes de começar

- [ ] Versão atualizada em `package.json` (o WXT usa esse número no manifesto e no nome dos pacotes)
- [ ] Testar o build em um perfil limpo do Chrome e do Firefox
- [x] Imagens da loja prontas (em `docs/loja/`)
- [ ] Política de privacidade publicada em uma URL, por exemplo a de [docs/politica-de-privacidade.md](politica-de-privacidade.md) no GitHub
- [ ] Conferir se o nome "Pixima" está livre nas duas lojas e no INPI (registro de marca)

**Teste importante no Firefox:** instale a versão assinada e confirme se o painel escaneia um site comum sem você mexer em permissões. No Firefox as permissões de site do Manifest V3 podem não vir liberadas na instalação. Se não escanear, é preciso pedir a permissão no primeiro uso (`browser.permissions.request`) antes de publicar, senão o usuário vai ver "esta página não pode ser escaneada".

## Gerar os pacotes

```sh
npm run zip
npm run zip:firefox
```

Os arquivos ficam em `.output/`:

- `pixima-<versão>-chrome.zip` para a Chrome Web Store (e Edge)
- `pixima-<versão>-firefox.zip` para o Firefox
- `pixima-<versão>-sources.zip` com o código-fonte, `README.md`, `package-lock.json` e `LICENSE`, sem `node_modules`

## Imagens da loja

| Item | Chrome Web Store | Firefox Add-ons |
|---|---|---|
| Ícone | 128 x 128 PNG, com a arte em 96 x 96 e 16 px de margem transparente por lado (o Pixima já gera os ícones a partir de `assets/icon.svg`) | Vem do manifesto |
| Capturas de tela | 1280 x 800 ou 640 x 400, sem margem e com cantos retos. Pelo menos uma | Pelo menos uma **(confirme na tela)** |
| Imagem promocional pequena | 440 x 280, **obrigatória** | Não tem |
| Imagem de destaque (marquee) | 1400 x 560, opcional. Só é considerado para destaque quem enviar | Não tem |

As imagens já estão prontas em [docs/loja/](loja/), nos tamanhos exatos que a Chrome Web Store pede:

| Arquivo | Tamanho | Uso |
|---|---|---|
| `chrome-1-galeria.png` a `chrome-5-tema-escuro.png` | 1280 x 800 | Capturas de tela (5 no total) |
| `promo-pequena-440x280.png` | 440 x 280 | Imagem promocional pequena |
| `marquee-1400x560.png` | 1400 x 560 | Imagem de destaque (opcional) |

O painel nelas é o real, ao lado de uma página de exemplo fictícia com imagens geradas, sem conteúdo de terceiros. As mesmas capturas servem para o Firefox. Se a interface mudar, as imagens precisam ser refeitas.

## Textos prontos

**Nome:** Pixima

**Resumo (até 132 caracteres):**

> Todas as imagens de qualquer site num só painel. Copie, converta e baixe em ZIP em segundos, 100% privado.

**Descrição detalhada:**

> Pare de salvar imagem por imagem.
>
> O Pixima abre um painel ao lado de qualquer site e mostra tudo o que a página tem, já sem repetições, anúncios e rastreadores.
>
> - Selecione várias de uma vez e baixe em um ZIP
> - Converta para PNG, JPG ou WebP no mesmo clique
> - Filtre por tamanho, formato e orientação
> - Copie a imagem ou o link com um toque
> - Tema claro e escuro
>
> 100% privado: sem conta, sem rastreamento, nada sai do seu navegador.

**Categoria sugerida:** Produtividade (Chrome) e Ferramentas ou Fotos (Firefox).

## Chrome Web Store

1. Entre no [painel do desenvolvedor](https://chrome.google.com/webstore/devconsole) com a conta Google que será a dona da extensão. O e-mail do cadastro **não pode ser trocado depois**.
2. Aceite o contrato e pague a taxa única de cadastro **(confirme o valor na tela)**.
3. Clique em **Novo item** e envie `pixima-<versão>-chrome.zip`.
4. Na aba **Listagem na loja**, preencha nome, resumo, descrição, categoria e idioma, e envie o ícone, as capturas de tela e a imagem promocional.
5. Na aba **Práticas de privacidade**, preencha os campos abaixo.
6. Na aba **Distribuição**, escolha a visibilidade (pública ou não listada) e os países.
7. Clique em **Enviar para análise**.

### Práticas de privacidade (Chrome)

**Finalidade única:**

> Mostrar as imagens da página aberta num painel lateral para o usuário copiar, baixar e converter.

**Justificativa de cada permissão:**

| Permissão | Justificativa |
|---|---|
| `host_permissions` (`<all_urls>`) | O usuário pode abrir o painel em qualquer site e precisa que o Pixima leia as imagens daquela página e baixe arquivos hospedados em outros domínios (CDNs). |
| `scripting` | Executa na página a função que procura as imagens, e busca a imagem no contexto da página quando o site bloqueia o download direto. |
| `downloads` | Salva no computador as imagens e o ZIP que o usuário escolheu baixar. |
| `sidePanel` | Exibe a interface do Pixima ao lado da página. |
| `activeTab` | Acesso temporário à aba em que o usuário clicou no ícone da extensão. |

**Uso de dados:** o Pixima não coleta, não armazena fora do navegador e não envia dados do usuário. As preferências (formato, tema e filtros) ficam só no armazenamento local do navegador. Marque que **não** coleta nenhum tipo de dado e confirme as declarações de conformidade.

**Política de privacidade:** use a URL pública de [politica-de-privacidade.md](politica-de-privacidade.md).

### Revisão (Chrome)

A documentação do Google diz que a revisão pode demorar mais para extensões novas, de desenvolvedor novo e que pedem permissões amplas, e cita o `<all_urls>` como exemplo. O Pixima se encaixa nos três, então a primeira análise tende a ser mais lenta. Não encontrei um prazo oficial **(confirme na tela)**. Justificar bem as permissões, como acima, ajuda.

### Edge (opcional)

O Edge costuma aceitar o mesmo `.zip` do Chrome, e o cadastro no [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/overview) é gratuito **(confirme na tela)**.

## Firefox Add-ons

1. Entre com uma conta Firefox em [addons.mozilla.org/developers](https://addons.mozilla.org/developers/). O cadastro é gratuito.
2. Clique em **Enviar um novo complemento** e escolha **Neste site** (publicação na loja, "listada"). A opção "Por conta própria" só assina o arquivo, sem listar na loja.
3. Envie `pixima-<versão>-firefox.zip`.
4. Quando perguntar se o código é gerado por ferramenta de build, responda **sim**, envie `pixima-<versão>-sources.zip` e cole as instruções de build abaixo.
5. Preencha nome, endereço (slug), resumo, descrição, categoria, licença (MIT), política de privacidade e capturas de tela.
6. Envie para análise.

### Instruções de build para o revisor

O Mozilla exige código-fonte e instruções que reproduzam o build, com ferramentas abertas ou gratuitas que rodem em Windows, Mac ou Linux. Cole algo assim:

```text
Requisitos: Node.js 20.19 ou superior e npm 10 ou superior.

1. Extraia o pixima-<versão>-sources.zip
2. npm ci
3. npm run build:firefox

O resultado fica em .output/firefox-mv3. O build usa WXT e Vite, sem
ferramentas comerciais ou online. O código não é ofuscado, apenas
empacotado e minificado.
```

### Dados do usuário (Firefox)

O manifesto já declara `data_collection_permissions` com `required: ["none"]`, que é o valor para extensão que não coleta dados. A política de privacidade e um resumo das práticas de dados devem constar na página da extensão.

### Revisão (Firefox)

Código empacotado sem o fonte correspondente é motivo de rejeição, e o `package-lock.json` ajuda a reproduzir o build. Não encontrei prazo oficial **(confirme na tela)**.

## Publicar atualizações

1. Aumente a versão em `package.json`
2. `npm run zip` e `npm run zip:firefox`
3. Envie os novos arquivos em cada painel, na seção de **Pacote** (Chrome) ou **Enviar nova versão** (Firefox)

### Automatizar com `wxt submit`

O WXT envia as versões novas para as lojas pelo terminal. A **primeira** publicação de cada loja precisa ser manual, porque o WXT não cria a listagem.

```sh
npx wxt submit init
```

Isso cria o arquivo `.env.submit` com as chaves (já ignorado pelo `.gitignore`, **nunca suba esse arquivo**). Cada loja usa credenciais diferentes:

- Chrome: client ID, client secret e refresh token da API da Chrome Web Store
- Firefox: chave e segredo JWT da API do Add-ons

Teste primeiro sem enviar:

```sh
npx wxt submit --dry-run \
  --chrome-zip .output/pixima-<versão>-chrome.zip \
  --firefox-zip .output/pixima-<versão>-firefox.zip \
  --firefox-sources-zip .output/pixima-<versão>-sources.zip
```

Se der certo, rode o mesmo comando sem `--dry-run`. Os nomes das opções podem mudar entre versões: confira com `npx wxt submit --help` e em [wxt.dev/guide/essentials/publishing](https://wxt.dev/guide/essentials/publishing).

## Erros comuns

- **Permissão sem justificativa:** a revisão do Chrome pede o motivo de cada permissão. Peça só o que o Pixima usa.
- **Descrição que promete o que o app não faz:** vale para as duas lojas e é motivo de rejeição.
- **Capturas com conteúdo de terceiros:** use imagens suas ou geradas.
- **Firefox sem o código-fonte ou sem instruções de build:** rejeição certa.
- **Chaves da API no repositório:** o `.env.submit` não pode ser enviado ao GitHub.
