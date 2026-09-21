# Escopo do Projeto: Termo, Dueto e Quarteto "Infinito"

## 1. Visão Geral
Criação de um web app de jogo de palavras baseado no Wordle/Termo, mas com a premissa de ser **infinito** (sem trava diária de tempo). O jogador pode iniciar uma nova partida imediatamente após terminar a anterior. O jogo terá três modos: **Termo** (1 tabuleiro), **Dueto** (2 tabuleiros) e **Quarteto** (4 tabuleiros).

## 2. Stack Tecnológico
* **Framework:** React com Vite (JavaScript ou TypeScript, prefira JS para simplicidade inicial).
* **Estilização:** Tailwind CSS (para facilitar os grids responsivos e cores dinâmicas).
* **Armazenamento:** `localStorage` do navegador para histórico e estatísticas.
* **Hospedagem (Futuro):** Cloudflare Pages ou Vercel.

## 3. Regras de Negócio e Modos de Jogo

### 3.1. Modos de Jogo
* **Termo (Clássico):** 1 Palavra, 1 Tabuleiro. 6 tentativas.
* **Dueto:** 2 Palavras, 2 Tabuleiros (lado a lado). 7 tentativas. Digitar no teclado preenche a tentativa simultaneamente em ambos os tabuleiros.
* **Quarteto:** 4 Palavras, 4 Tabuleiros (grid 2x2). 9 tentativas. Digitar no teclado preenche a tentativa simultaneamente em todos os tabuleiros ativos.

### 3.2. Mecânica de Congelamento
* Ao acertar a palavra de um tabuleiro específico, esse tabuleiro é "congelado" (mostra a animação de vitória e trava na palavra certa).
* Os próximos inputs do usuário afetam apenas os tabuleiros que ainda não foram resolvidos.
* O jogo é **Vencido** quando todos os tabuleiros do modo escolhido são resolvidos.
* O jogo é **Perdido** se o limite de tentativas acabar e houver tabuleiros não resolvidos.

### 3.3. Regras de Validação e Acentos
* As palavras devem ter exatamente 5 letras.
* As validações devem ignorar acentos e cedilha (ex: `AÇÕES` é lido como `ACOES`).
* No entanto, ao revelar uma letra correta, o jogo deve exibir o caractere original com acento da palavra-alvo.
* **Cores (Status):**
  * **Verde (Correct):** Letra certa na posição certa.
  * **Amarelo (Present):** Letra existe na palavra, mas na posição errada.
  * **Cinza (Absent):** Letra não existe na palavra.

### 3.4. O Teclado Inteligente (Crucial)
* O teclado virtual deve refletir o melhor status de uma letra através de todos os tabuleiros ativos.
* **Hierarquia de cores:** Verde sobrescreve Amarelo. Amarelo sobrescreve Cinza. 
* Se uma letra já foi descoberta como Verde no Tabuleiro 1, e Cinza no Tabuleiro 2, a tecla no teclado virtual deve permanecer Verde.

---

## 4. Arquitetura de Arquivos

```text
/src
 ├── /components
 │    ├── Header.jsx        # Título, botões de estatísticas e seletor de modo.
 │    ├── GameBoard.jsx     # Gerencia a exibição de 1, 2 ou 4 tabuleiros.
 │    ├── Board.jsx         # O grid individual de um tabuleiro (5 colunas x N linhas).
 │    ├── Row.jsx           # Uma linha de 5 letras.
 │    ├── Keyboard.jsx      # Teclado virtual.
 │    └── Modal.jsx         # Modal de Fim de Jogo (Vitória/Derrota e botão Jogar Novamente).
 ├── /hooks
 │    └── useGameLogic.js   # Estado global: palavra atual, tentativas, status do jogo.
 ├── /utils
 │    ├── words.json        # Dicionário de palavras válidas.
 │    └── helpers.js        # Funções para remover acentos e sortear palavras.
 ├── App.jsx                # Componente raiz.
 └── main.jsx
```

---

## 5. Instruções para o Agente de IA (Claude Code)

*Para usar com o Claude Code, copie e cole os prompts abaixo em sequência no seu terminal:*

**Fase 1: Setup e Dicionário**
> "Crie um projeto React com Vite e instale o Tailwind CSS. Em seguida, crie a estrutura de pastas básica (components, hooks, utils). Crie um arquivo `src/utils/words.json` com um array de cerca de 200 palavras em português (com 5 letras, incluindo palavras com acentos). Crie o arquivo `helpers.js` com uma função para sortear N palavras aleatórias dessa lista e uma função para remover acentos."

**Fase 2: Lógica Base (Termo Único)**
> "Crie o hook `useGameLogic.js` e os componentes `Board`, `Row` e `Keyboard`. Implemente a lógica clássica do Wordle para apenas 1 tabuleiro. Permita que o usuário digite pelo teclado físico e virtual. Implemente a validação de cores (Verde, Amarelo, Cinza) ao dar Enter. Importante: Adicione um botão 'Jogar Novamente' que zera o estado e sorteia uma nova palavra, sem recarregar a página."

**Fase 3: Multi-Tabuleiros (Dueto e Quarteto)**
> "Agora expanda o aplicativo para suportar os modos Dueto e Quarteto. Crie um seletor no Header. Ajuste o hook `useGameLogic` para aceitar múltiplas palavras-alvo (1, 2 ou 4). O input do usuário deve ir para todos os tabuleiros não concluídos ao mesmo tempo. Ajuste a lógica do `Keyboard` para calcular a prioridade de cores (Verde > Amarelo > Cinza) avaliando as tentativas em todos os tabuleiros simultaneamente."

**Fase 4: Polimento Final**
> "Melhore o visual usando Tailwind. Adicione animações de 'flip' quando as letras forem reveladas e 'shake' se a palavra for inválida (menos de 5 letras). Certifique-se de que no modo Quarteto, o grid 2x2 se adapta perfeitamente em telas de celulares usando flexbox ou CSS grid. Adicione um modal de fim de jogo exibindo a(s) palavra(s) correta(s)."