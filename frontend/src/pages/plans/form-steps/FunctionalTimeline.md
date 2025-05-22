# Documentau00e7u00e3o do Componente FunctionalTimeline

## Visu00e3o Geral
O componente `FunctionalTimeline` u00e9 dedicado u00e0 criação e gerenciamento de uma linha do tempo funcional para as pacientes no sistema Lyz. Ele permite registrar eventos significativos na vida da paciente que podem ter impacto em sua saúde física, emocional e hormonal, possibilitando a identificação de padrões, gatilhos e correlações com sintomas e condições atuais.

## Funcionalidades Principais

### 1. Registro Cronolu00f3gico de Eventos
- **Documentau00e7u00e3o Temporal**: Organizau00e7u00e3o cronolu00f3gica de eventos de vida
- **Categorização**: Classificau00e7u00e3o por tipo e impacto de cada evento
- **Contextualizau00e7u00e3o**: Correlau00e7u00e3o entre idade da paciente e ocorru00eancias
- **Duração**: Registro de eventos pontuais ou contu00ednuos

### 2. Visualizau00e7u00e3o em Linha do Tempo
- **Disposiu00e7u00e3o Visual**: Apresentau00e7u00e3o cronolu00f3gica e alternada (esquerda/direita)
- **Marcadores de Categoria**: Identificau00e7u00e3o visual por u00edcones e cores
- **Indicadores de Impacto**: Classificau00e7u00e3o visual por nvel de influência na sau00fade
- **Representau00e7u00e3o Responsiva**: Adaptau00e7u00e3o para diversos tamanhos de tela

### 3. Gestu00e3o de Eventos
- **Adiu00e7u00e3o**: Interface completa para inclusão de novos eventos
- **Ediu00e7u00e3o**: Atualizau00e7u00e3o de informau00e7u00f5es existentes
- **Exclusu00e3o**: Remoção com confirmau00e7u00e3o de segurana
- **Ordenau00e7u00e3o Automtica**: Organizau00e7u00e3o cronolu00f3gica dos eventos

## Estrutura de Dados

O componente gerencia um objeto com a seguinte estrutura:

```javascript
{
  events: [
    {
      id: string,           // Identificador ú;nico do evento
      date: string,         // Data do evento (formato yyyy-MM-dd)
      age: string,          // Idade da paciente na épóca (opcional)
      category: string,     // Categoria do evento (health_condition, emotional, etc.)
      title: string,        // Título do evento
      description: string,  // Descrição detalhada
      impact: string,       // Nível de impacto (critical, major, moderate, minor, positive)
      duration: string,     // Duração do evento (opcional)
      ongoing: boolean      // Se o evento ainda está em andamento
    }
  ]
}
```

## Bases de Dados Embutidas

Para facilitar o preenchimento, o componente inclui listas pru00e9-definidas:

### Categorias de Eventos
Extensa catalogau00e7u00e3o com 20 tipos de eventos relevantes, incluindo:
- Eventos de sau00fade: condiu00e7u00f5es, diagnu00f3sticos, tratamentos, cirurgias
- Eventos reprodutivos: gravidez, parto, alterau00e7u00f5es menstruais
- Eventos emocionais e psicolu00f3gicos
- Alterau00e7u00f5es de estilo de vida: nutriu00e7u00e3o, exerccio, sono, estresse
- Eventos sociais: relacionamentos, educau00e7u00e3o, carreira

Cada categoria possui um u00edcone associado para identificau00e7u00e3o visual rpida.

### Nu00edveis de Impacto
Classificau00e7u00e3o em 5 nu00edveis de impacto, cada um com cor distintiva:
- **Cru00edtico**: Impacto severo e potencialmente irreversu00edvel (vermelho)
- **Significativo**: Grande impacto com efeitos duradouros (laranja)
- **Moderado**: Impacto intermedirio (amarelo)
- **Leve**: Impacto menor (verde)
- **Positivo**: Evento com impacto benfico (azul)

## Componentes da Interface

### 1. Linha do Tempo Visual
- **Linha Central Vertical**: Elemento visual conectando os eventos
- **Marcadores Circulares**: Identificadores de categoria e impacto
- **Cards Alternados**: Apresentau00e7u00e3o visual em zigzag (desktop) ou fluxo (mobile)
- **Indicadores Coloridos**: Barra lateral e marcadores com código de cores por impacto

### 2. Cards de Evento
- **Cabeu00e7alho com Tu00edtulo**: Identificau00e7u00e3o principal do evento
- **Chips Informativos**: Data, idade, categoria e impacto
- **Descriu00e7u00e3o Expandida**: Detalhamento do evento
- **Informau00e7u00f5es de Durau00e7u00e3o**: Perodo e status (em andamento ou concluído)

### 3. Diu00e1logos de Ediu00e7u00e3o
- **Formulu00e1rio Completo**: Campos para todos os atributos do evento
- **Validau00e7u00e3o Visual**: Indicadores de campos obrigatu00f3rios
- **Dicas Contextuais**: Alertas informativos baseados na categoria selecionada
- **Seleu00e7u00e3o Visual**: Menus com u00edcones e indicadores coloridos

## Validau00e7u00f5es e Segurana

### Validau00e7u00e3o de Campos
- Verificau00e7u00e3o de campos obrigatu00f3rios (data, categoria, ttulo)
- Feedback visual de erros com mensagens
- Prevenu00e7u00e3o de submissu00e3o de dados incompletos

### Confirmau00e7u00e3o de Au00e7u00f5es
- Diu00e1logo de confirmau00e7u00e3o antes da exclusu00e3o de eventos
- Aviso sobre au00e7u00f5es irreversu00edveis

## Integrau00e7u00e3o com IA

Os dados da linha do tempo funcional serão utilizados pelo sistema de IA (LangChain) para:

1. Identificar correlau00e7u00f5es entre eventos de vida e o inico/agravamento de sintomas
2. Reconhecer padru00f5es temporais entre estressores e alterau00e7u00f5es hormonais
3. Contextualizar a condiu00e7u00e3o atual dentro da histria de vida da paciente
4. Considerar eventos-chave nas recomendau00e7u00f5es de intervenções
5. Personalizar o plano teraputico com base em experiências e respostas pru00e9vias

## Animau00e7u00f5es e UX

O componente utiliza a biblioteca Framer Motion para:

- **Entrada Sequencial**: Elementos surgem em cascata para melhor legibilidade
- **Movimentos Laterais**: Cards entram alternadamente da esquerda e direita
- **Transiu00e7u00f5es Suaves**: Efeitos de fade para mudanu00e7as de estado
- **Feedback Visual**: Animau00e7u00f5es sutis durante interu00e7u00f5es

## Responsividade

O componente foi projetado para adaptar-se a diferentes tamanhos de tela:

- **Desktop**: Layout em zigzag com eventos alternando entre esquerda e direita
- **Mobile**: Layout vertical com todos os eventos alinhados u00e0 direita da linha
- **Adaptau00e7u00e3o da Linha**: Posicionamento central (desktop) ou lateral (mobile)
- **Redimensionamento de Cards**: Ajuste automtico de largura e posicionamento
