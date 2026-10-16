---
id: engenharia-genetica-ferramentas
titulo: "Engenharia genética e DNA recombinante"
unidade: u23-biotecnologia-bioetica
serie: 3
ordem: 1
acesso: gratuito
dificuldade: 2
tempo_estimado_min: 25
incidencia_enem: alta
bncc: [EM13CNT304, EM13CNT202]
pre_requisitos: [codigo-genetico-traducao, bacterias-estrutura-reproducao]
palavras_chave: ["engenharia genética", "DNA recombinante", "enzimas de restrição", "DNA ligase", "plasmídeo", "vetor de clonagem", "transformação bacteriana", "insulina humana", "cDNA", "transcriptase reversa", "biblioteca genômica", "sequenciamento de DNA"]
objetivos:
  - "Explicar como enzimas de restrição e DNA ligase permitem cortar e unir fragmentos de DNA de origens diferentes."
  - "Descrever a função dos plasmídeos e de outros vetores de clonagem e o papel dos genes marcadores na seleção de bactérias transformadas."
  - "Reconstruir as etapas da produção de insulina humana por bactérias, justificando o uso de cDNA."
  - "Diferenciar bibliotecas genômicas e de cDNA e compreender a lógica do sequenciamento de DNA."
recursos_existentes: [{tipo: artigo, rota: "/conteudo/artigos/biotecnologia-engenharia-genetica"}, {tipo: quiz, rota: "/atividades/quizzes/biotecnologia-engenharia-genetica"}]
---

# Engenharia genética e DNA recombinante

## Por que isso importa?

Até o início da década de 1980, quem tinha diabetes do tipo 1 dependia de insulina extraída do pâncreas de bois e porcos abatidos em frigoríficos. Eram necessários muitos pâncreas por paciente, e alguns pacientes desenvolviam reações a essa proteína "quase humana". Hoje, a insulina distribuída pelo SUS é fabricada por **microrganismos** que carregam o gene humano da insulina. Um microrganismo virou fábrica de remédio.

Isso só foi possível porque a ciência aprendeu a **cortar, colar e copiar DNA**. Esse conjunto de técnicas se chama **engenharia genética** (ou tecnologia do DNA recombinante) e é a base de tudo o que vem nesta unidade: transgênicos, testes de DNA, clonagem, vacinas modernas e CRISPR.

## A ideia central: DNA é DNA em qualquer ser vivo

A engenharia genética funciona porque o DNA de todos os seres vivos é feito dos **mesmos quatro nucleotídeos** (A, T, C e G), e o **código genético é praticamente universal**. Um códon especifica o mesmo aminoácido em humanos e em bactérias. Por isso, uma bactéria pode fabricar uma proteína humana, desde que receba o gene em formato adequado.

**DNA recombinante** é uma molécula de DNA formada pela união de trechos de **origens diferentes**, por exemplo um gene humano inserido no DNA de uma bactéria. Para montá-la, precisamos de três ferramentas básicas: uma "tesoura" (enzimas de restrição), uma "cola" (DNA ligase) e um "veículo" (vetor).

## Enzimas de restrição e DNA ligase: a tesoura e a cola

### As tesouras moleculares

As **enzimas de restrição** (ou endonucleases de restrição) foram descobertas em bactérias. Na natureza, elas funcionam como um **sistema de defesa contra bacteriófagos**: quando um vírus injeta seu DNA na bactéria, essas enzimas o picotam e "restringem" a infecção. A bactéria protege o próprio DNA marcando-o com grupos metil nos mesmos sítios, o que impede o corte.

Cada enzima reconhece uma **sequência específica** de bases, chamada **sítio de restrição**, geralmente com 4 a 8 pares de bases. Muitos desses sítios são **palíndromos**: lidos no sentido 5'→3', as duas fitas têm a mesma sequência. Um exemplo clássico é a enzima **EcoRI** (isolada da *Escherichia coli*):

```
5' ...G AATTC... 3'
3' ...CTTAA G... 5'
```

A EcoRI corta entre o G e o A nas duas fitas. Como os cortes ficam deslocados, sobram pontas de fita simples complementares, chamadas **extremidades coesivas**. Outras enzimas cortam as duas fitas no mesmo ponto e geram **extremidades abruptas** (ou cegas), sem pontas soltas.

O detalhe mais importante para as provas: **se o DNA humano e o DNA do vetor forem cortados pela mesma enzima, as extremidades coesivas serão complementares** e poderão parear por pontes de hidrogênio.

> 🖼️ **Figura sugerida:** dupla-hélice com o sítio GAATTC destacado, tesoura indicando o corte "em degrau" da EcoRI e, ao lado, as duas extremidades coesivas AATT pareando com um fragmento de outra origem cortado pela mesma enzima.

### A cola molecular

O pareamento das pontas coesivas é fraco e provisório. Quem fecha o DNA de forma definitiva é a **DNA ligase**, enzima que forma as **ligações fosfodiéster** entre o açúcar de um nucleotídeo e o fosfato do vizinho, restaurando o "esqueleto" da fita. Na duplicação natural do DNA, uma ligase une os fragmentos de Okazaki.

> 💡 **Dica de memorização:** "**Restrição recorta, ligase liga**". A enzima de restrição quebra ligações fosfodiéster em um ponto específico; a ligase refaz essas ligações. Pontes de hidrogênio entre as pontas são só o "encaixe" temporário.

## Plasmídeos e vetores de clonagem: o veículo do gene

Um gene solto na bactéria seria degradado e não seria copiado. Ele precisa viajar dentro de um **vetor**, uma molécula de DNA capaz de entrar na célula e de se replicar nela.

### Plasmídeos

Os vetores mais usados são os **plasmídeos**: pequenas moléculas de **DNA circular**, separadas do cromossomo bacteriano, que se replicam de modo independente. Na natureza, eles costumam carregar genes vantajosos, como os de **resistência a antibióticos**, e podem passar de uma bactéria para outra. Um plasmídeo útil em laboratório reúne:

- **Origem de replicação:** sequência que permite ao plasmídeo ser copiado dentro da bactéria, gerando muitas cópias por célula.
- **Sítio de clonagem:** local com sítio(s) de restrição onde o gene de interesse será inserido.
- **Gene marcador:** em geral, um gene de **resistência a antibiótico**, que permite identificar quais bactérias receberam o plasmídeo.

### Como montar e selecionar

1. O plasmídeo e o DNA com o gene de interesse são cortados pela **mesma enzima de restrição**.
2. Os fragmentos são misturados; as extremidades coesivas pareiam e a **DNA ligase** sela as ligações, formando o **plasmídeo recombinante**.
3. As bactérias são colocadas em contato com os plasmídeos em condições que facilitam sua entrada (choque térmico ou pulsos elétricos). Essa absorção de DNA do meio é a **transformação bacteriana**.
4. Só uma pequena parte das bactérias absorve o plasmídeo. Elas são cultivadas em meio **com o antibiótico**: apenas as que receberam o plasmídeo, com o gene de resistência, sobrevivem.
5. Cada bactéria transformada se divide por **fissão binária** e origina uma colônia de clones, todos com o gene inserido. Daí o nome **clonagem gênica**: o gene é copiado milhões de vezes.

### Outros vetores

Plasmídeos carregam trechos pequenos de DNA. Outros veículos são os **vírus modificados**, os **cromossomos artificiais** de bactérias ou leveduras (para trechos enormes) e o plasmídeo Ti de ***Agrobacterium tumefaciens***, usado para levar genes a plantas. Em todos, o vetor garante que o gene seja mantido e copiado.

> 🖼️ **Figura sugerida:** fluxograma em cinco quadros: (1) plasmídeo e DNA humano cortados pela mesma enzima; (2) gene encaixado e selado pela ligase; (3) transformação de bactérias; (4) placa com antibiótico em que só crescem as colônias transformadas; (5) tanque de fermentação produzindo a proteína.

## Produção de insulina humana por bactérias

A insulina é um hormônio proteico produzido pelas células beta do pâncreas. Produzi-la em bactérias exigiu resolver um problema importante: **genes eucarióticos têm íntrons**, trechos que são transcritos e depois removidos no **processamento (splicing)** do RNA dentro do núcleo. Bactérias **não fazem splicing**. Se recebessem o gene humano com íntrons, produziriam uma proteína errada.

A solução clássica é usar o **cDNA** (DNA complementar):

1. Isola-se o **RNAm maduro** da insulina a partir de células do pâncreas. Esse RNAm já está **sem íntrons**.
2. A enzima **transcriptase reversa**, obtida de retrovírus, usa o RNAm como molde e produz uma fita de DNA. Depois se completa a dupla fita. O resultado é o **cDNA**, uma cópia do gene contendo **apenas éxons**.
3. O cDNA é inserido em um plasmídeo, ao lado de sequências reguladoras bacterianas (como um **promotor** que a RNA polimerase da bactéria reconheça).
4. As bactérias transformadas são selecionadas e cultivadas em grandes **biorreatores** (tanques de fermentação).
5. A proteína é extraída e purificada. Como o cDNA codifica um precursor (a pró-insulina), ela é dobrada e convertida em insulina ativa por cortes enzimáticos feitos no laboratório.

Hoje há processos com bactérias e leveduras. A primeira insulina recombinante, aliás, usou genes sintéticos das cadeias A e B; o cDNA é a estratégia mais cobrada, e ambas evitam íntrons.

As vantagens em relação à insulina animal são grandes: produção em escala industrial, menor custo por dose, independência dos frigoríficos e uma molécula **idêntica à humana**, com menos reações imunológicas. A mesma lógica produz **hormônio do crescimento** (em bactérias), proteínas de **vacinas**, como a da hepatite B (em leveduras), e **fatores de coagulação** para hemofilia (em células de mamíferos cultivadas, pois exigem modificações que bactérias não fazem).

> 💡 **Dica de memorização:** "**Bactéria não corta íntron, então damos o gene já cortado.**" RNAm maduro + transcriptase reversa = cDNA, só com éxons.

## Bibliotecas genômicas e sequenciamento de DNA

### Bibliotecas: guardar o genoma em pedaços

Para encontrar e estudar genes, os cientistas criam **bibliotecas de DNA**: coleções de clones bacterianos (ou de outros vetores) em que cada clone guarda um fragmento diferente do DNA de um organismo.

| Tipo | Ponto de partida | O que contém | Uso típico |
|---|---|---|---|
| **Biblioteca genômica** | DNA total da célula, picotado por enzimas de restrição | Todo o genoma: éxons, íntrons, regiões reguladoras e DNA não codificante | Mapear e sequenciar genomas inteiros, estudar regiões reguladoras |
| **Biblioteca de cDNA** | RNAm extraído de um tecido, convertido em cDNA | Apenas os genes **expressos** naquele tecido, sem íntrons | Produzir proteínas em bactérias, comparar genes ativos em tecidos diferentes |

Uma biblioteca de cDNA do fígado é diferente de uma do pâncreas, porque cada tecido expressa um conjunto diferente de genes. Já a biblioteca genômica é praticamente a mesma para qualquer célula nucleada do mesmo indivíduo, porque o genoma é, em essência, o mesmo.

### Sequenciamento: ler as letras

**Sequenciar** é determinar a ordem exata das bases em um trecho de DNA. O método que dominou por décadas é o de **Sanger**, que usa a própria DNA polimerase:

- O DNA a ser lido serve de molde, e a polimerase sintetiza novas fitas a partir de um primer.
- Além dos nucleotídeos normais, a reação recebe uma pequena quantidade de **didesoxinucleotídeos** (ddNTPs), cada tipo marcado com uma cor fluorescente. Eles **não têm o grupo OH do carbono 3'**, necessário para a ligação com o próximo nucleotídeo.
- Quando a polimerase incorpora um ddNTP, a síntese **para**. Formam-se fragmentos de todos os tamanhos possíveis, cada um terminado por uma base colorida conhecida.
- Os fragmentos são separados por tamanho (eletroforese) e um detector lê as cores em ordem, do menor para o maior. A sequência de cores é a sequência de bases.

Técnicas mais recentes, chamadas de **sequenciamento de nova geração**, leem milhões de fragmentos ao mesmo tempo, o que barateou enormemente a leitura de genomas inteiros.

O Brasil tem um capítulo importante nessa história: uma rede de laboratórios paulistas, financiada pela FAPESP, sequenciou o genoma da bactéria ***Xylella fastidiosa***, causadora da clorose variegada dos citros (o "amarelinho" da laranja). Foi o primeiro genoma completo de um patógeno de plantas publicado no mundo, um marco para a ciência nacional e para a citricultura.

## Como cai no ENEM e nos vestibulares

- **Esquemas de DNA recombinante:** a questão mostra plasmídeo, enzima de restrição e gene e pergunta qual etapa ou enzima está representada. Saber que **as duas moléculas precisam ser cortadas pela mesma enzima** resolve muita coisa.
- **Produção de insulina e de outras proteínas:** perguntas sobre por que se usa cDNA (bactérias não removem íntrons) e por que a bactéria consegue fabricar uma proteína humana (universalidade do código genético).
- **Seleção por antibiótico:** interpretar placas de cultura em que só crescem as bactérias transformadas.
- **Leitura de sítios de restrição:** contar quantos fragmentos uma enzima gera em uma sequência dada (em DNA linear, *n* cortes geram *n* + 1 fragmentos; em DNA circular, *n* cortes geram *n* fragmentos).
- **Contexto CTS:** vantagens da insulina recombinante, biossegurança, genomas sequenciados no Brasil.

## Pegadinhas e erros comuns

- **"A enzima de restrição corta o DNA em qualquer lugar."** Errado. Cada enzima reconhece uma **sequência específica**.
- **"A DNA ligase forma pontes de hidrogênio entre as fitas."** Errado. Ela forma **ligações fosfodiéster** no esqueleto de cada fita.
- **"Plasmídeo é o cromossomo da bactéria."** Errado. É um DNA circular **extracromossômico**, menor e de replicação independente.
- **"O gene de resistência ao antibiótico é o gene que queremos produzir."** Não. Ele é apenas o **marcador** para selecionar as bactérias transformadas.
- **"Para produzir insulina, basta colocar o gene humano do cromossomo na bactéria."** O gene genômico tem íntrons que a bactéria não remove; usa-se o **cDNA**.
- **"A transcriptase reversa transforma DNA em RNA."** É o contrário: ela produz **DNA a partir de RNA**.
- **"A bactéria transformada passou a ter DNA humano, então virou meio humana."** Ela recebeu **um único gene**; continua sendo uma bactéria, apenas geneticamente modificada.

## Resumo relâmpago

- **DNA recombinante** une DNA de origens diferentes; funciona porque o **código genético é universal**.
- **Enzimas de restrição** vêm de bactérias (defesa contra fagos) e cortam **sítios específicos**, muitas vezes **palindrômicos**, gerando extremidades **coesivas** ou **abruptas**.
- Mesma enzima → extremidades compatíveis → **DNA ligase** sela com ligações **fosfodiéster**.
- **Plasmídeos**: DNA circular extracromossômico com **origem de replicação**, **sítio de clonagem** e **gene marcador**.
- **Transformação** é a entrada do plasmídeo na bactéria; a **seleção** usa o antibiótico.
- Insulina humana em bactérias: **RNAm maduro → transcriptase reversa → cDNA (sem íntrons) → plasmídeo → bactéria → biorreator**.
- **Biblioteca genômica** guarda o genoma inteiro; **biblioteca de cDNA** guarda só os genes expressos em um tecido.
- **Sanger**: ddNTPs interrompem a síntese; fragmentos separados por tamanho revelam a sequência.

## Conexões

- [[codigo-genetico-traducao]]: a universalidade do código permite que bactérias fabriquem proteínas humanas.
- [[bacterias-estrutura-reproducao]]: plasmídeos, transformação e fissão binária são a base da clonagem gênica.
- [[transcricao-rna]]: íntrons, éxons e splicing explicam por que se usa cDNA.
- [[duplicacao-dna]]: DNA polimerase e DNA ligase também atuam na replicação natural.
- [[virus-estrutura-ciclos]]: bacteriófagos e retrovírus forneceram a ideia e as enzimas (restrição e transcriptase reversa).
- [[pcr-eletroforese-dna-forense]]: a próxima etapa da unidade copia e separa fragmentos de DNA.
- [[transgenicos-ogm]]: as mesmas ferramentas produzem plantas e animais modificados.
- [[sistema-endocrino]]: a insulina e o controle da glicemia.
