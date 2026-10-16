---
id: segunda-lei-mendel
titulo: "Segunda Lei de Mendel (diibridismo)"
unidade: u22-genetica-pos-mendeliana
serie: 3
ordem: 1
acesso: gratuito
dificuldade: 2
tempo_estimado_min: 25
incidencia_enem: alta
bncc: [EM13CNT205]
pre_requisitos: [primeira-lei-mendel, probabilidade-genetica]
palavras_chave: ["segunda lei de Mendel", "segregação independente", "diibridismo", "9:3:3:1", "metáfase I", "cromossomos não homólogos", "gametas", "2^n", "método da ramificação", "poliibridismo", "cruzamento-teste"]
objetivos:
  - "Enunciar a Segunda Lei de Mendel e explicá-la pelo comportamento dos cromossomos na meiose."
  - "Obter e interpretar a proporção 9:3:3:1 e o resultado 1:1:1:1 do cruzamento-teste de um diíbrido."
  - "Calcular o número de tipos de gametas (2^n) e listá-los pelo método da ramificação."
  - "Resolver problemas de poliibridismo multiplicando as probabilidades de cada par de genes."
recursos_existentes: []
---

# Segunda Lei de Mendel (diibridismo)

## Por que isso importa?

Imagine um melhorista de uma instituição de pesquisa agropecuária brasileira que tem duas variedades de feijão: uma produz grãos com a cor preferida pelo consumidor, mas é atacada por um fungo; a outra resiste ao fungo, mas tem grãos de cor pouco aceita no mercado. Ele quer uma planta que reúna **as duas qualidades**. Isso é possível? Quantas plantas ele precisa cultivar para encontrar a combinação desejada, e quantas delas serão linhagens puras?

A resposta está na **Segunda Lei de Mendel**, que explica como dois ou mais caracteres são herdados ao mesmo tempo. Ela é a base do melhoramento genético clássico e uma das leis que mais aparecem em questões de cálculo no ENEM e nos vestibulares. A boa notícia: se você domina a [[primeira-lei-mendel]] e a regra do "E" da [[probabilidade-genetica]], já tem quase tudo de que precisa.

## O experimento do diibridismo

Depois de estudar um caráter por vez, Mendel passou a acompanhar **dois caracteres simultaneamente** nas ervilhas. Um caso clássico envolve a cor e a textura da semente:

- **Cor:** amarela (alelo dominante **V**) ou verde (alelo recessivo **v**).
- **Textura:** lisa (alelo dominante **R**) ou rugosa (alelo recessivo **r**).

Ele cruzou plantas puras de sementes **amarelas e lisas** (VVRR) com plantas puras de sementes **verdes e rugosas** (vvrr).

- **Geração F1:** 100% das sementes eram amarelas e lisas. Todas tinham genótipo **VvRr**, ou seja, eram **diíbridas** (heterozigotas para os dois genes).
- **Geração F2:** a autofecundação da F1 produziu quatro tipos de semente. Nos dados clássicos de Mendel, foram 315 amarelas lisas, 108 verdes lisas, 101 amarelas rugosas e 32 verdes rugosas, valores muito próximos da proporção **9:3:3:1**.

Dois detalhes chamaram a atenção. Primeiro, surgiram combinações que **não existiam nos pais**: amarela rugosa e verde lisa. Segundo, quando cada caráter é analisado isoladamente, a proporção 3:1 da Primeira Lei continua lá. Amarelas: 315 + 101 = 416; verdes: 108 + 32 = 140. A razão 416:140 é aproximadamente 3:1. O mesmo vale para lisas e rugosas.

A conclusão de Mendel, hoje chamada de **Segunda Lei** ou **Lei da Segregação Independente**, pode ser enunciada assim:

> Na formação dos gametas, os alelos de genes diferentes **segregam-se de forma independente** uns dos outros. O alelo que um gameta recebe de um gene não influencia qual alelo ele recebe do outro.

## A base meiótica da segregação independente

Mendel não conhecia cromossomos nem meiose. Décadas depois, os citologistas perceberam que os "fatores" de Mendel se comportavam exatamente como os cromossomos durante a [[meiose]].

O ponto-chave está na **metáfase I**. Nela, os pares de cromossomos homólogos se alinham no plano equatorial, e a orientação de cada par (qual homólogo fica voltado para cada polo) é **aleatória e independente** da orientação dos outros pares. Na **anáfase I**, os homólogos se separam.

Considere uma célula VvRr, com o gene V/v em um par de homólogos e o gene R/r em **outro** par:

1. **Arranjo 1:** V e R voltados para o mesmo polo → gametas **VR** e **vr**.
2. **Arranjo 2:** V e r voltados para o mesmo polo → gametas **Vr** e **vR**.

Como os dois arranjos são igualmente prováveis, considerando muitas meioses, o indivíduo produz os quatro tipos de gametas na mesma frequência: **25% VR, 25% Vr, 25% vR e 25% vr**.

> 🖼️ **Figura sugerida:** duas células em metáfase I lado a lado, cada uma com dois pares de homólogos (um longo com V/v e um curto com R/r), mostrando os dois arranjos possíveis; abaixo, setas levando aos quatro tipos de gametas (VR, vr, Vr, vR), cada um com 1/4.

Atenção a uma condição importante: a segregação independente vale para genes localizados em **cromossomos diferentes** (não homólogos), ou muito distantes no mesmo cromossomo. Genes próximos no mesmo cromossomo tendem a ser herdados juntos, fenômeno estudado em [[linkage-mapas]].

## A proporção 9:3:3:1 e o cruzamento-teste

### Montando o quadro de Punnett

No cruzamento VvRr × VvRr, cada genitor produz 4 tipos de gametas. O quadro de Punnett terá 4 × 4 = **16 casas**, todas igualmente prováveis:

| Gametas | **VR** | **Vr** | **vR** | **vr** |
|---|---|---|---|---|
| **VR** | VVRR | VVRr | VvRR | VvRr |
| **Vr** | VVRr | VVrr | VvRr | Vvrr |
| **vR** | VvRR | VvRr | vvRR | vvRr |
| **vr** | VvRr | Vvrr | vvRr | vvrr |

Agrupando os fenótipos:

| Fenótipo | Genótipos | Fração |
|---|---|---|
| Amarela e lisa | V_R_ | **9/16** |
| Amarela e rugosa | V_rr | **3/16** |
| Verde e lisa | vvR_ | **3/16** |
| Verde e rugosa | vvrr | **1/16** |

São **4 fenótipos** e **9 genótipos** diferentes. Dentro do quadro, apenas 4 casas correspondem a indivíduos homozigotos para os dois genes (VVRR, VVrr, vvRR e vvrr), uma de cada fenótipo. Repare também que o duplo heterozigoto **VvRr** é o genótipo mais frequente: 4/16 = 1/4.

### O atalho: multiplicar proporções

O 9:3:3:1 nada mais é que o produto de duas proporções 3:1 independentes:

(3/4 amarela + 1/4 verde) × (3/4 lisa + 1/4 rugosa)

- Amarela e lisa: 3/4 × 3/4 = 9/16
- Amarela e rugosa: 3/4 × 1/4 = 3/16
- Verde e lisa: 1/4 × 3/4 = 3/16
- Verde e rugosa: 1/4 × 1/4 = 1/16

> 💡 **Dica de memorização:** "Segunda Lei = Primeira Lei vezes Primeira Lei". Resolva cada gene separadamente e **multiplique** (regra do "E"). O 9:3:3:1 é só o (3:1)².

### Cruzamento-teste do diíbrido

Para descobrir se uma planta amarela e lisa é VVRR, VvRR, VVRr ou VvRr, cruza-se com o **duplo recessivo** (vvrr). Como o recessivo só produz gametas vr, os fenótipos dos filhos revelam diretamente os gametas do indivíduo testado.

- Se o testado for **VvRr**, os descendentes aparecem na proporção **1:1:1:1** (amarela lisa, amarela rugosa, verde lisa, verde rugosa).
- Se for **VVRr**, todos serão amarelos, metade lisos e metade rugosos (1:1).
- Se for **VvRR**, todos serão lisos, metade amarelos e metade verdes (1:1).
- Se for **VVRR**, 100% serão amarelos e lisos.

## Quantos gametas? A fórmula 2^n e o método da ramificação

Um indivíduo produz **2^n** tipos de gametas, em que **n é o número de pares de genes em heterozigose** (com segregação independente). Os pares em homozigose não aumentam a variedade, porque só oferecem um tipo de alelo.

| Genótipo | Pares heterozigotos (n) | Tipos de gametas (2^n) |
|---|---|---|
| AABB | 0 | 1 |
| AaBB | 1 | 2 |
| AaBb | 2 | 4 |
| AaBbCC | 2 | 4 |
| AaBbCc | 3 | 8 |
| AaBbCcDd | 4 | 16 |

Para **listar** os gametas, use o **método da ramificação** (diagrama em árvore): para cada gene, abra um "galho" para cada alelo possível e siga combinando. Para AaBbCC:

- A → B → C = **ABC**
- A → b → C = **AbC**
- a → B → C = **aBC**
- a → b → C = **abC**

Cada gameta tem frequência 1/4. Em um gene homozigoto (CC), o galho não se divide, por isso o total continua 4.

> 💡 **Dica de memorização:** "Só o **hetero** ramifica". Conte os pares heterozigotos, eleve 2 a esse número, e você terá os tipos de gametas.

Um exemplo humano impressiona: nossas células têm 23 pares de cromossomos. Só pela orientação independente dos pares na metáfase I, uma pessoa pode formar 2²³ (mais de 8 milhões) combinações cromossômicas diferentes de gametas, sem contar o crossing-over. É uma das razões pelas quais irmãos (exceto gêmeos idênticos) são tão diferentes.

## Poliibridismo e cálculo de genótipos

Quando o cruzamento envolve três ou mais genes (**poliibridismo**), montar quadros de Punnett se torna inviável: para AaBbCc × AaBbCc, seriam 8 × 8 = 64 casas. A saída é sempre a mesma: **separar os genes, resolver cada um e multiplicar**.

### Fórmulas úteis para o cruzamento de dois poli-híbridos iguais

Para dois indivíduos heterozigotos em **n** genes, com dominância completa:

| O que se pergunta | Fórmula | n = 2 | n = 3 |
|---|---|---|---|
| Tipos de gametas de cada genitor | 2^n | 4 | 8 |
| Combinações de gametas (casas do quadro) | 4^n | 16 | 64 |
| Genótipos diferentes na prole | 3^n | 9 | 27 |
| Fenótipos diferentes na prole | 2^n | 4 | 8 |

### Exemplo resolvido 1

Qual a probabilidade de nascer um descendente **aabbcc** do cruzamento AaBbCc × AaBbCc?

- Aa × Aa → P(aa) = 1/4
- Bb × Bb → P(bb) = 1/4
- Cc × Cc → P(cc) = 1/4

P(aabbcc) = 1/4 × 1/4 × 1/4 = **1/64**. Já a probabilidade de um descendente com os três caracteres dominantes (A_B_C_) é 3/4 × 3/4 × 3/4 = **27/64**.

### Exemplo resolvido 2

No cruzamento AaBbDd × aaBbDD, qual a probabilidade de um filho **AaBbDd**? E quantos genótipos diferentes são possíveis?

- Aa × aa → Aa = 1/2 (genótipos possíveis: Aa, aa → 2)
- Bb × Bb → Bb = 1/2 (genótipos: BB, Bb, bb → 3)
- Dd × DD → Dd = 1/2 (genótipos: DD, Dd → 2)

P(AaBbDd) = 1/2 × 1/2 × 1/2 = **1/8**. Número de genótipos = 2 × 3 × 2 = **12**. Note que as fórmulas 3^n e 2^n só valem quando os dois pais são heterozigotos para todos os genes; nos outros casos, conte gene por gene e multiplique.

### Voltando ao feijão

O melhorista do início cruza duas plantas duplo-heterozigotas (PpRr), em que P determina a cor preferida e R a resistência, ambos dominantes. A chance de uma planta da prole ter a cor desejada e ser resistente (P_R_) é 9/16, mas a chance de ser **homozigota** para as duas características (PPRR), ou seja, uma linhagem que não segrega mais, é só 1/4 × 1/4 = **1/16**. Por isso os programas de melhoramento precisam de muitas plantas, de várias gerações e de cruzamentos-teste.

## Como cai no ENEM e nos vestibulares

- **Cálculo direto:** proporções fenotípicas e genotípicas, probabilidade de um genótipo específico e número esperado de descendentes em uma amostra (fração × total).
- **Número de gametas:** aplicações de 2^n, muitas vezes com um par em homozigose para "pegar" quem conta todos os genes.
- **Interpretação de dados:** tabelas com números de descendentes que devem ser reconhecidos como 9:3:3:1, 1:1:1:1 ou 3:3:1:1, e a partir deles deduzir os genótipos dos pais.
- **Contextos aplicados:** melhoramento de plantas e animais (feijão, milho, gado), cruzamento-teste e relação com a meiose.
- **Integração:** vestibulares como FUVEST e UNICAMP costumam combinar a Segunda Lei com meiose, ligação gênica e heredogramas.

## Pegadinhas e erros comuns

- **"Todo diibridismo dá 9:3:3:1."** Errado. O 9:3:3:1 aparece apenas no cruzamento de **dois duplo-heterozigotos** com dominância completa e genes independentes. AaBb × aabb dá 1:1:1:1; AaBb × Aabb dá 3:3:1:1.
- **Contar genes homozigotos na fórmula 2^n.** AaBBCc forma 2² = 4 tipos de gametas, não 8.
- **Confundir 9/16 com "nove plantas".** As proporções são **probabilidades**: em 16 descendentes reais, o resultado pode fugir do esperado. Quanto maior a amostra, mais próximo da proporção teórica.
- **Achar que um gameta carrega os dois alelos de um gene.** Pela Primeira Lei, cada gameta leva **um** alelo de cada gene: VvRr forma VR, Vr, vR e vr, nunca "Vv".
- **Esquecer a condição da independência.** A Segunda Lei vale para genes em cromossomos diferentes. Genes ligados (no mesmo cromossomo e próximos) não seguem essas proporções.
- **Somar em vez de multiplicar.** Para "ter A e ter B", multiplique; some apenas quando houver caminhos alternativos ("ou"), como em Aa × Aa: P(Aa) = P(A do pai e a da mãe) + P(a do pai e A da mãe) = 1/4 + 1/4 = 1/2.
- **Situar a segregação independente na mitose ou na anáfase II.** Ela depende da orientação dos **pares de homólogos** na metáfase I e da sua separação na anáfase I.

## Resumo relâmpago

- **Segunda Lei:** alelos de genes diferentes segregam-se de forma **independente** na formação dos gametas.
- **Base meiótica:** orientação aleatória dos pares de homólogos na **metáfase I** e separação na **anáfase I**; vale para genes em cromossomos não homólogos.
- **F2 de diíbridos:** 9:3:3:1 de fenótipos, **9 genótipos** e 16 combinações de gametas.
- **9:3:3:1 = (3:1) × (3:1)**: resolva cada gene e multiplique.
- **Cruzamento-teste** do diíbrido (AaBb × aabb): **1:1:1:1**.
- **Tipos de gametas = 2^n**, com n = número de pares heterozigotos; liste-os pelo **método da ramificação**.
- **Poliibridismo** (n genes, pais iguais e heterozigotos): 2^n gametas, 4^n combinações, 3^n genótipos e 2^n fenótipos.

## Conexões

- [[primeira-lei-mendel]]: cada gene isolado continua seguindo a segregação 3:1.
- [[probabilidade-genetica]]: as regras do "E" e do "OU" são as ferramentas de todo cálculo de poliibridismo.
- [[meiose]]: a orientação independente dos homólogos na metáfase I é a explicação física da Segunda Lei.
- [[interacoes-genicas]]: quando dois genes atuam no mesmo caráter, o 9:3:3:1 se transforma em 9:7, 12:3:1, 9:3:4...
- [[linkage-mapas]]: genes no mesmo cromossomo são a principal exceção à segregação independente.
- [[variacoes-monoibridismo]]: dominância incompleta e codominância alteram as proporções de cada gene e, portanto, o produto final.
