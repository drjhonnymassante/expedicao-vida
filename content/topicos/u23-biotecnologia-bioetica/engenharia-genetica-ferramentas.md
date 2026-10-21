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

A engenharia genética, a manipulação direta de genes com um objetivo prático, funciona porque o DNA de todos os seres vivos é feito dos **mesmos quatro nucleotídeos** (A, T, C e G), e o **código genético é praticamente universal**. Um códon especifica o mesmo aminoácido em humanos e em bactérias. Por isso, uma bactéria pode fabricar uma proteína humana, desde que receba o gene em formato adequado. Esse compartilhamento dos mecanismos básicos de expressão gênica é, aliás, uma evidência de que todos os seres vivos descendem de um **ancestral comum**.

**DNA recombinante** é uma molécula de DNA formada pela união de trechos de **duas fontes diferentes**, muitas vezes de espécies diferentes, por exemplo um gene humano inserido em um plasmídeo de bactéria. Para montá-la, precisamos de três ferramentas básicas: uma "tesoura" (enzimas de restrição), uma "cola" (DNA ligase) e um "veículo" (vetor).

Quase todas essas técnicas dependem de uma mesma propriedade: o **pareamento de bases complementares** (A com T, C com G) entre fitas de ácidos nucleicos, chamado de **hibridização**.

## Enzimas de restrição e DNA ligase: a tesoura e a cola

### As tesouras moleculares

As **enzimas de restrição** (ou endonucleases de restrição) foram descobertas em bactérias no fim da década de 1960. Na natureza, elas funcionam como um **sistema de defesa**: cortam o DNA estranho que entra na célula, como o de **bacteriófagos**, e assim "restringem" a infecção. A bactéria protege o próprio DNA adicionando **grupos metila** (–CH₃) a adeninas ou citosinas dentro dos sítios reconhecidos, o que impede o corte.

Cada enzima é muito específica: reconhece uma **sequência curta** de bases, chamada **sítio de restrição**, geralmente com 4 a 8 pares de bases, e corta as duas fitas em pontos precisos dentro dele. A maioria desses sítios é **simétrica** (palindrômica): lidas no sentido 5'→3', as duas fitas têm a mesma sequência. Como uma sequência curta costuma aparecer várias vezes em uma molécula longa, a enzima faz vários cortes e gera um conjunto de **fragmentos de restrição**. Cópias da mesma molécula de DNA, tratadas com a mesma enzima, geram sempre o mesmo conjunto de fragmentos. Um exemplo clássico é a enzima **EcoRI** (isolada da *Escherichia coli*):

```
5' ...G AATTC... 3'
3' ...CTTAA G... 5'
```

A EcoRI corta o esqueleto de açúcar-fosfato entre o G e o A nas duas fitas. Como os cortes ficam deslocados ("em degrau"), sobram pontas de fita simples complementares, chamadas **extremidades coesivas**. As enzimas mais úteis na clonagem são justamente as que geram esse tipo de ponta. Outras enzimas cortam as duas fitas no mesmo ponto e geram **extremidades abruptas** (ou cegas), sem pontas soltas.

O detalhe mais importante para as provas: **se o DNA humano e o DNA do vetor forem cortados pela mesma enzima, as extremidades coesivas serão complementares** e poderão parear por ligações (pontes) de hidrogênio.

> 🖼️ **Figura sugerida:** dupla-hélice com o sítio GAATTC destacado, tesoura indicando o corte "em degrau" da EcoRI e, ao lado, as duas extremidades coesivas AATT pareando com um fragmento de outra origem cortado pela mesma enzima.

### A cola molecular

O pareamento das pontas coesivas é fraco e provisório. Quem torna a união permanente é a **DNA ligase**, enzima que forma ligações covalentes (as **ligações fosfodiéster**) entre o açúcar de um nucleotídeo e o fosfato do vizinho, restaurando o "esqueleto" de açúcar-fosfato da fita. Na duplicação natural do DNA, uma ligase une os fragmentos de Okazaki.

> 💡 **Dica de memorização:** "**Restrição recorta, ligase liga**". A enzima de restrição quebra ligações fosfodiéster em um ponto específico; a ligase refaz essas ligações. Pontes de hidrogênio entre as pontas são só o "encaixe" temporário.

## Plasmídeos e vetores de clonagem: o veículo do gene

Um gene solto na bactéria seria degradado e não seria copiado. Ele precisa viajar dentro de um **vetor de clonagem**, uma molécula de DNA capaz de levar DNA estranho para dentro de uma célula hospedeira e de se replicar nela.

### Plasmídeos

Os vetores mais usados são os **plasmídeos**: pequenas moléculas de **DNA circular**, separadas do cromossomo bacteriano (que, na *E. coli*, também é circular, porém muito maior), que se replicam de modo independente. Eles têm poucos genes, úteis em certos ambientes, mas em geral dispensáveis para a sobrevivência, como os de **resistência a antibióticos**, e podem passar de uma bactéria para outra. São ótimos vetores porque são fáceis de modificar em tubo de ensaio (*in vitro*), entram com facilidade nas bactérias e se multiplicam rapidamente junto com elas. Um plasmídeo útil em laboratório reúne:

- **Origem de replicação:** sequência que permite ao plasmídeo ser copiado dentro da bactéria, gerando muitas cópias por célula.
- **Sítio de clonagem:** local com sítio(s) de restrição onde o gene de interesse será inserido.
- **Gene marcador:** em geral, um gene de **resistência a antibiótico**, que permite identificar quais bactérias receberam o plasmídeo.

### Como montar e selecionar

1. Obtêm-se muitas cópias do gene de interesse (hoje, em geral, pela **PCR**, assunto da próxima aula).
2. O plasmídeo e o DNA com o gene de interesse são cortados pela **mesma enzima de restrição**.
3. Os fragmentos são misturados; as extremidades coesivas pareiam e a **DNA ligase** sela as ligações, formando o **plasmídeo recombinante**. Como as duas pontas do próprio plasmídeo também podem parear entre si, parte dos plasmídeos volta à forma original, sem o gene.
4. As bactérias são colocadas em contato com os plasmídeos em condições que facilitam sua entrada (choque térmico ou **eletroporação**, pulsos elétricos que abrem poros temporários na membrana). Essa absorção de DNA do meio é a **transformação bacteriana**.
5. Só uma pequena parte das bactérias absorve o plasmídeo. Elas são cultivadas em meio **com o antibiótico**: apenas as que receberam um plasmídeo, com o gene de resistência, sobrevivem. Outras técnicas permitem descartar as que receberam o plasmídeo sem o gene de interesse.
6. Cada bactéria recombinante se divide por **fissão binária** e origina um **clone celular**, uma população de células geneticamente idênticas, todas com o plasmídeo recombinante. Daí o nome **clonagem gênica**: o gene é copiado milhões de vezes.

A clonagem gênica serve a dois propósitos básicos: **obter muitas cópias de um gene** (para pesquisa ou para transferi-lo a outro organismo, como uma planta) e **produzir a proteína** que ele codifica.

### Outros vetores

Plasmídeos carregam trechos pequenos de DNA. Outros veículos são os **vírus modificados**, os **cromossomos artificiais** de bactérias ou leveduras (para trechos enormes) e o **plasmídeo Ti** da bactéria do solo ***Agrobacterium tumefaciens***, que integra parte do seu DNA ao cromossomo das células vegetais e é usado para levar genes a plantas. Em todos, o vetor garante que o gene seja mantido e copiado. Em células eucarióticas, o DNA também pode ser introduzido por eletroporação ou injetado diretamente com agulhas microscópicas.

> 🖼️ **Figura sugerida:** fluxograma em cinco quadros: (1) plasmídeo e DNA humano cortados pela mesma enzima; (2) gene encaixado e selado pela ligase; (3) transformação de bactérias; (4) placa com antibiótico em que só crescem as colônias transformadas; (5) tanque de fermentação produzindo a proteína.

## Produção de insulina humana por bactérias

A insulina é um hormônio proteico produzido pelas células beta do pâncreas. Fazer um gene eucariótico funcionar em bactérias exige resolver dois problemas, porque a expressão gênica não é idêntica nos dois grupos:

- **Promotores diferentes:** a RNA polimerase bacteriana não reconhece bem os promotores eucarióticos. A solução é usar um **vetor de expressão**, um plasmídeo que já traz um promotor bacteriano bem ativo logo antes do local onde o gene é inserido.
- **Íntrons:** genes eucarióticos têm **íntrons**, trechos que são transcritos e depois removidos no **processamento do RNA (splicing**, que o Campbell chama de "corte e junção do RNA") dentro do núcleo. Bactérias **não têm essa maquinaria**. Se recebessem o gene humano com íntrons, não o expressariam corretamente.

A solução para os íntrons é usar o **cDNA** (DNA complementar, escrito "DNAc" no Campbell):

1. Isola-se o **RNAm maduro** de células do pâncreas. Esse RNAm já está **sem íntrons**.
2. A enzima **transcriptase reversa**, obtida de retrovírus, usa o RNAm como molde e produz uma fita de DNA. O RNAm é então degradado, e a **DNA polimerase** sintetiza a segunda fita. O resultado é o **cDNA**, de dupla fita, com a sequência codificante completa do gene e **nenhum íntron**.
3. O cDNA é inserido no vetor de expressão, ao lado do promotor bacteriano.
4. As bactérias transformadas são selecionadas e cultivadas em grandes **biorreatores** (tanques de fermentação).
5. A proteína é extraída e purificada. Como o cDNA codifica um precursor (a pró-insulina), ela é dobrada e convertida em insulina ativa por cortes enzimáticos feitos no laboratório.

Hoje há processos com bactérias e leveduras. A primeira insulina recombinante, aliás, usou genes sintéticos das cadeias A e B; o cDNA é a estratégia mais cobrada, e ambas evitam íntrons.

As vantagens em relação à insulina animal são grandes: produção em escala industrial, menor custo por dose, independência dos frigoríficos e uma molécula **idêntica à humana**, com menos reações imunológicas. A insulina humana e o **hormônio do crescimento humano** (usado em crianças com um tipo de nanismo causado pela falta desse hormônio) estiveram entre os primeiros medicamentos fabricados assim. Outro exemplo é o **ativador de plasminogênio tecidual (TPA)**, que ajuda a dissolver coágulos logo após um infarto. Também se produzem proteínas de **vacinas**, como a da hepatite B (em leveduras), e **fatores de coagulação** para hemofilia.

### Quando a bactéria não serve

Muitas proteínas eucarióticas só funcionam depois de **modificadas após a tradução**, por exemplo recebendo cadeias de açúcar (**glicosilação**) no retículo endoplasmático e no complexo golgiense (chamado de aparelho de Golgi no Campbell). Bactérias não têm esse sistema de membranas internas e não fazem essas modificações. Nesses casos, usam-se células **eucarióticas** como hospedeiras:

- **Leveduras:** fungos unicelulares tão fáceis de cultivar quanto bactérias e que, raridade entre os eucariontes (eucariotos, no Campbell), também têm plasmídeos. Porém, nem sempre modificam corretamente proteínas de mamíferos.
- **Células de mamíferos cultivadas:** usadas quando a proteína humana exige modificações que nem as leveduras fazem direito.

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

**Sequenciar** é determinar a ordem exata dos nucleotídeos em um trecho de DNA. O primeiro método automatizado foi o **método didesóxi de terminação de cadeia**, criado por Frederick Sanger (Prêmio Nobel de 1980) e ainda usado em trabalhos de pequena escala. Ele usa a própria DNA polimerase:

- Uma fita do DNA a ser lido serve de molde, e a polimerase sintetiza novas fitas a partir de um primer (oligonucleotídeo iniciador).
- Além dos nucleotídeos normais, a reação recebe **didesoxinucleotídeos** (ddNTPs), cada tipo marcado com uma cor fluorescente. Eles **não têm o grupo –OH do carbono 3'**, que é o ponto de ligação do próximo nucleotídeo.
- Quando a polimerase incorpora, ao acaso, um ddNTP no lugar do nucleotídeo normal, a síntese **para**. Formam-se fitas de todos os tamanhos possíveis, cada uma terminada por uma base colorida conhecida.
- As fitas são separadas por tamanho (eletroforese em gel, dentro de um tubo capilar) e um detector lê as cores em ordem, da mais curta para a mais longa. A sequência obtida é **complementar à fita-molde**.

Técnicas mais recentes, chamadas de **sequenciamento de nova geração** (ou "sequenciamento por síntese"), não usam terminação de cadeia: copiam cada fragmento muitas vezes e acompanham, em tempo real, a adição de cada nucleotídeo, lendo centenas de milhares de fragmentos ao mesmo tempo. Já os métodos de **terceira geração** leem uma única molécula longa de DNA, por exemplo fazendo-a passar por um **nanoporo**. Cada geração ficou mais rápida e barata, o que permitiu sequenciar milhares de genomas.

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
- **"Toda colônia que cresce no meio com antibiótico tem o gene de interesse."** Não necessariamente. O antibiótico mostra apenas que a bactéria recebeu um plasmídeo; alguns plasmídeos se fecham sem o gene inserido.
- **"Qualquer proteína humana pode ser produzida em bactérias."** Proteínas que precisam de glicosilação ou de outras modificações após a tradução exigem células eucarióticas (leveduras ou células de mamíferos).
- **"A bactéria transformada passou a ter DNA humano, então virou meio humana."** Ela recebeu **um único gene**; continua sendo uma bactéria, apenas geneticamente modificada.

## Resumo relâmpago

- **DNA recombinante** une DNA de origens diferentes; funciona porque o **código genético é universal**.
- **Enzimas de restrição** vêm de bactérias (defesa contra fagos) e cortam **sítios específicos**, muitas vezes **palindrômicos**, gerando extremidades **coesivas** ou **abruptas**.
- Mesma enzima → extremidades compatíveis → **DNA ligase** sela com ligações **fosfodiéster**.
- **Plasmídeos**: DNA circular extracromossômico com **origem de replicação**, **sítio de clonagem** e **gene marcador**.
- **Transformação** é a entrada do plasmídeo na bactéria; a **seleção** usa o antibiótico.
- Insulina humana em bactérias: **RNAm maduro → transcriptase reversa → cDNA (sem íntrons) → vetor de expressão com promotor bacteriano → bactéria → biorreator**.
- Proteínas que exigem **glicosilação** são produzidas em células eucarióticas (leveduras ou células de mamíferos).
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

## Referência

- Urry, L. A. et al. *Biologia de Campbell*. 10. ed. Porto Alegre: Artmed, 2015. Capítulo 20 (Conceitos 20.1, 20.2 e 20.4).
