# Documentau00e7u00e3o do Componente IFMMatrix

## Visu00e3o Geral
O componente `IFMMatrix` implementa a Matriz do Instituto de Medicina Funcional (IFM), uma ferramenta de organizau00e7u00e3o clu00ednica essencial para mapear os principais fatores funcionais que influenciam a sau00fade da paciente no sistema Lyz. Ele permite a avaliau00e7u00e3o sistu00eamica e integrada de mu00faltiplos sistemas e aspectos que afetam a sau00fade, baseando-se na abordagem da medicina funcional personalizada.

## Funcionalidades Principais

### 1. Avaliau00e7u00e3o Abrangente por Sistema
- **Pontuau00e7u00e3o por Nu00f3**: Quantificau00e7u00e3o do grau de desequilu00edbrio em cada u00e1rea
- **Observau00e7u00f5es Detalhadas**: Registro de achados clu00ednicos para cada sistema
- **Intervenu00e7u00f5es Personalizadas**: Documentau00e7u00e3o de recomendau00e7u00f5es especu00edficas
- **Visualizau00e7u00e3o Integrada**: Representau00e7u00e3o visual da matriz completa

### 2. Interface Visual Interativa
- **Cards Seletivos**: Seleu00e7u00e3o intuitiva de u00e1reas para detalhamento
- **Codificau00e7u00e3o por Cores**: Visualizau00e7u00e3o ru00e1pida de u00e1reas de maior preocupau00e7u00e3o
- **Feedback Imediato**: Atualizau00e7u00e3o visual conforme alterau00e7u00f5es nas pontuau00e7u00f5es
- **u00cdcones Temu00e1ticos**: Identificau00e7u00e3o visual para cada u00e1rea funcional

### 3. Detalhamento Clnico
- **Escala de Severidade**: Graduau00e7u00e3o de 0-10 para cada fator
- **Campos Expansvu00edveis**: Espau00e7o para documentau00e7u00e3o clu00ednica detalhada
- **Intervenu00e7u00f5es Especu00edficas**: Recomendau00e7u00f5es personalizadas por u00e1rea
- **Descritu00e7u00f5es Informativas**: Explicau00e7u00f5es sobre cada componente da matriz

## Estrutura de Dados

O componente gerencia um objeto com a seguinte estrutura:

```javascript
{
  nodes: {
    assimilation: {          // Digestu00e3o e absoru00e7u00e3o
      score: number,         // Pontuau00e7u00e3o de 0-10
      notes: string,         // Observau00e7u00f5es clu00ednicas
      interventions: string  // Intervenu00e7u00f5es recomendadas
    },
    defense: { ... },        // Sistema imunolu00f3gico e reparau00e7u00e3o
    energy: { ... },         // Produu00e7u00e3o energu00e9tica
    biotransformation: { ... }, // Detoxificau00e7u00e3o
    transport: { ... },      // Circulau00e7u00e3o
    communication: { ... },  // Comunicau00e7u00e3o celular e hormonal
    structural_integrity: { ... }, // Integridade estrutural
    mental_emotional: { ... }, // Aspectos mentais-emocionais
    nutrition: { ... },      // Nutriu00e7u00e3o
    movement: { ... },       // Movimento e exercu00edcio
    sleep_relaxation: { ... }, // Sono e relaxamento
    relationships: { ... },  // Relacionamentos e redes de apoio
    exposome: { ... },       // Exposiu00e7u00e3o ambiental
    spiritual: { ... },      // Espiritualidade e propu00f3sito
    inflammation: { ... },   // Inflamau00e7u00e3o
    infection: { ... }       // Infecu00e7u00e3o e disbiose
  }
}
```

## Nu00f3s da Matriz IFM

O componente implementa os 16 nu00f3s essenciais da medicina funcional:

### Nu00f3s de Processamento Fisiolu00f3gico
1. **Assimilau00e7u00e3o**: Digestu00e3o, absoru00e7u00e3o, microbioma e permeabilidade intestinal
2. **Defesa e Reparau00e7u00e3o**: Sistema imunolu00f3gico e regenerau00e7u00e3o celular
3. **Produu00e7u00e3o de Energia**: Metabolismo energu00e9tico e funu00e7u00e3o mitocondrial
4. **Biotransformau00e7u00e3o e Eliminau00e7u00e3o**: Detoxificau00e7u00e3o e remou00e7u00e3o de toxinas
5. **Transporte**: Circulau00e7u00e3o cardiovascular e linftica
6. **Comunicau00e7u00e3o**: Regulau00e7u00e3o hormonal e neurotransmissores
7. **Integridade Estrutural**: Sistema mu00fasculos-esquelu00e9tico e celular

### Nu00f3s de Estilo de Vida e Ambiente
8. **Mental-Emocional**: Estresse, resiliencia e sau00fade psicolu00f3gica
9. **Nutriu00e7u00e3o**: Padru00f5es alimentares e estado nutricional
10. **Movimento**: Atividade fu00edsica e padru00f5es respiratu00f3rios
11. **Sono e Relaxamento**: Qualidade do sono e descanso
12. **Relacionamentos**: Conexu00f5es sociais e suporte
13. **Exposoma**: Exposiu00e7u00e3o ambiental a toxinas e poluentes
14. **Espiritualidade**: Sentido de propu00f3sito e valores pessoais

### Nu00f3s de Processos Mediadores
15. **Inflamau00e7u00e3o**: Processos inflamatu00f3rios agudos e cru00f4nicos
16. **Infecu00e7u00e3o e Disbiose**: Desequilu00edbrios microbianos e infecu00e7u00f5es cru00f4nicas

## Interface do Usu00e1rio

### 1. Visu00e3o Geral da Matriz
- **Grid de Cards**: Apresentau00e7u00e3o visual de todos os 16 nu00f3s
- **Codificau00e7u00e3o de Cores**: Cada nu00f3 possui cor distintiva para ru00e1pida identificau00e7u00e3o
- **Indicadores de Score**: Visualizau00e7u00e3o do nvel de comprometimento por cor (verde, laranja, vermelho)
- **Seleu00e7u00e3o Interativa**: Cards cliqu00e1veis para acessar detalhes

### 2. Detalhamento de Nu00f3
- **Card Expandido**: Interface dedicada ao nu00f3 selecionado
- **Slider de Avaliau00e7u00e3o**: Controle para ajuste da pontuau00e7u00e3o
- **Campos de Texto**: u00c1reas para registro de observau00e7u00f5es e intervenu00e7u00f5es
- **Informau00e7u00f5es Contextuais**: Descritu00e7u00f5es e dicas sobre cada u00e1rea

## Animau00e7u00f5es e UX

O componente utiliza a biblioteca Framer Motion para:

- **Entrada Suave**: Transiu00e7u00f5es fluidas ao carregar o componente
- **Realce de Seleu00e7u00e3o**: Destaque visual para o nu00f3 selecionado
- **Esmaecimento**: Reduu00e7u00e3o de opacidade para itens nu00e3o selecionados
- **Feedback Hover**: Efeito de escala ao passar o mouse sobre os cards
- **Detalhamento Animado**: Entrada suave da seo de detalhes

## Integrau00e7u00e3o com IA

Os dados da matriz IFM seru00e3o utilizados pelo sistema de IA (LangChain) para:

1. Identificar u00e1reas prioritrias para intervenu00e7u00e3o
2. Correlacionar desequilu00edbrios entre diferentes sistemas
3. Sugerir abordagens integradas baseadas nos padru00f5es de disfunu00e7u00e3o
4. Personalizar recomendau00e7u00f5es considerando todas as u00e1reas da matriz
5. Mapear a interdependencia dos sistemas corporais e estilo de vida

## Pru00e1ticas Recomendadas

Ao utilizar o componente IFMMatrix, considere:

1. **Avaliau00e7u00e3o Abrangente**: Pontue todas as u00e1reas para uma visu00e3o completa
2. **Notas Objetivas**: Registre observau00e7u00f5es clu00ednicas relevantes e especu00edficas
3. **Intervenu00e7u00f5es Prticas**: Sugira recomendau00e7u00f5es acionu00e1veis e personalizadas
4. **Priorize Areas**: Foque primeiro nas u00e1reas com pontuau00e7u00e3o mais alta
5. **Visu00e3o Sistu00eamica**: Considere as interu00e7u00f5es entre os diferentes nu00f3s

## Responsividade

O componente foi projetado para adaptar-se a diferentes tamanhos de tela:
- **Desktop**: Grid de 4 colunas para visualizau00e7u00e3o abrangente
- **Tablet**: Grid de 3 colunas para equilibrar conteudo e espau00e7o
- **Mobile**: Grid de 2 colunas para facilidade de visualizau00e7u00e3o e interau00e7u00e3o
