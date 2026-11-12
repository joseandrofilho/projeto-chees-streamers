# PRD — Projeto Streamers

## 1. Visão do produto

Aplicação web para consultar e visualizar a lista de streamers da API pública do Chess.com. Para cada streamer, a interface apresenta o nome de usuário, o avatar, o link para a plataforma da transmissão e um indicador visual que informa se ele está ao vivo.

## 2. Objetivo

Permitir que uma pessoa consulte rapidamente quais streamers estão ao vivo e acesse a página da transmissão de cada streamer.

## 3. Público-alvo

Pessoas que acompanham streamers de uma plataforma ainda a definir e querem encontrar os perfis e transmissões em um só lugar.

## 4. Escopo

### Incluído

- Buscar os dados dos streamers em uma API externa.
- Exibir, para cada streamer:
  - nome de usuário (`username`);
  - foto do perfil (`avatar`);
  - link para a transmissão (`twitch_url`);
  - situação da transmissão (`is_live`).
- Identificar visualmente a situação ao vivo:
  - `is_live: true`: indicador verde e texto acessível equivalente a “Ao vivo”;
  - `is_live: false`: indicador vermelho e texto acessível equivalente a “Offline”.
- Apresentar estados de carregamento, erro na consulta e lista sem resultados.
- Manter a implementação simples, organizada e fácil de entender.

### Fora do escopo nesta versão

- Login ou criação de contas.
- Favoritos, comentários ou interação entre usuários.
- Filtros, busca, ordenação ou paginação, salvo se forem necessários para atender às limitações da API escolhida.
- Reprodução de vídeo dentro da aplicação.

## 5. Requisitos funcionais

**RF-01 — Carregar streamers:** ao abrir a aplicação, consultar `https://api.chess.com/pub/streamers` para obter os streamers.

**RF-02 — Exibir informações:** mostrar nome, avatar, link da transmissão e situação ao vivo de cada streamer retornado.

**RF-03 — Indicar situação:** exibir um ponto verde para streamers ao vivo e um ponto vermelho para streamers offline. A situação também deve estar disponível em texto para não depender somente da cor.

**RF-04 — Acessar transmissão:** permitir abrir o link `twitch_url` associado ao streamer.

**RF-05 — Informar estados da consulta:** durante a busca, mostrar carregamento; se a consulta falhar, informar que os dados não puderam ser carregados; se não houver resultados, informar que a lista está vazia.

## 6. Requisitos não funcionais

- Utilizar React com TypeScript, de acordo com a base atual do projeto.
- Utilizar `useState` para controlar dados e estados da interface e `useEffect` para iniciar a consulta à API.
- Separar a lógica de busca da apresentação quando isso ajudar a manter o código simples e compreensível.
- Tratar erros da consulta sem deixar a tela em estado de carregamento indefinidamente.
- Usar HTML semântico e garantir que os links e os indicadores de situação sejam compreensíveis por tecnologias assistivas.

## 7. Dados esperados

Cada item da lista deve conter os seguintes campos:

| Campo        | Tipo esperado                | Descrição                                                      |
| ------------ | ---------------------------- | -------------------------------------------------------------- |
| `username`   | texto                        | Nome público do streamer.                                      |
| `avatar`     | URL ou valor aceito pela API | Imagem de perfil do streamer.                                  |
| `twitch_url` | URL                          | Endereço para acessar a transmissão ou o perfil na plataforma. |
| `is_live`    | booleano                     | `true` quando estiver ao vivo; `false` quando estiver offline. |

A estrutura final dos dados, nomes dos campos, validação e transformação da resposta devem ser confirmados inspecionando a resposta desse endpoint.

## 8. Histórias de usuário

- Como visitante, quero ver uma lista de streamers para descobrir quem está disponível.
- Como visitante, quero reconhecer rapidamente quem está ao vivo para escolher uma transmissão.
- Como visitante, quero abrir o link de um streamer para assistir à transmissão na plataforma correspondente.
- Como visitante, quero receber uma mensagem clara se a lista não carregar ou não tiver resultados.

## 9. Critérios de aceite

- Ao abrir a aplicação, uma consulta à API é iniciada e um estado de carregamento é apresentado enquanto ela está pendente.
- Quando a API retorna streamers, cada item apresenta nome, avatar, link e situação.
- Um item com `is_live: true` mostra o indicador verde e o texto “Ao vivo”.
- Um item com `is_live: false` mostra o indicador vermelho e o texto “Offline”.
- O link de cada item leva ao endereço fornecido para aquele streamer.
- Uma resposta válida sem itens resulta em uma mensagem de lista vazia.
- Uma falha na consulta resulta em uma mensagem de erro compreensível, e não em uma tela de carregamento permanente.

## 10. Dependências e decisões pendentes

- Endpoint de origem: `https://api.chess.com/pub/streamers`.
- Confirmar se a API exige configuração adicional, como proxy, para ser consumida pelo navegador.
- Qual é o formato real da resposta e como os campos se relacionam com `username`, `avatar`, `twitch_url` e `is_live`?
- A lista deve incluir todos os streamers da plataforma ou somente um conjunto/uma categoria específica?
- O campo `twitch_url` sempre aponta para a Twitch ou deve ser tratado como link genérico da plataforma?
- Existem limites de requisição, paginação ou regras de atualização dos dados?

## 11. Premissas

- O endpoint do Chess.com fornece dados suficientes para preencher os campos descritos, diretamente ou após transformação.
- `is_live` pode ser interpretado como um valor booleano.
- O destino do link pode ser aberto fora da aplicação.
- O projeto é uma aplicação web de consulta; não há necessidade de cadastro para acessar a lista.
