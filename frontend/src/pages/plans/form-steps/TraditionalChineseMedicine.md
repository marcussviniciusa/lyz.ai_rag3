# Documentau00e7u00e3o do Componente TraditionalChineseMedicine

## Visu00e3o Geral
O componente `TraditionalChineseMedicine` u00e9 dedicado u00e0 avaliau00e7u00e3o e registro dos aspectos da Medicina Tradicional Chinesa (MTC) no sistema Lyz. Ele permite aos profissionais de sau00fade documentar e analisar o estado da paciente segundo os princpios da MTC, incluindo diagnu00f3stico por lu00edngua e pulso, balanu00e7o dos cinco elementos, avaliau00e7u00e3o de meridianos e u00f3rgu00e3os, padru00f5es de desarmonia e balanu00e7o Yin-Yang.

## Funcionalidades Principais

### 1. Avaliau00e7u00e3o Constitucional
- **Tipo de Constituiu00e7u00e3o**: Identificau00e7u00e3o do padru00e3o constitucional bsico
- **Elemento Dominante**: Classificau00e7u00e3o dentro do sistema dos Cinco Elementos
- **Balanu00e7o Yin-Yang**: Avaliau00e7u00e3o do equilu00edbrio entre as foru00e7as opostas complementares

### 2. Diagnu00f3stico Diferencial
- **Padru00f5es de Desarmonia**: Identificau00e7u00e3o dos desequilu00edbrios energu00e9ticos
- **Meridianos Afetados**: Mapeamento dos canais de energia em desequilu00edbrio
- **Balanu00e7o dos u00d3rgu00e3os**: Avaliau00e7u00e3o detalhada do sistema Zang-Fu (u00f3rgu00e3os e vsceras)

### 3. Mu00e9todos Diagnu00f3sticos Tradicionais
- **Diagnu00f3stico por Lingua**: Anu00e1lise detalhada das caractersticas da lu00edngua
- **Diagnu00f3stico por Pulso**: Avaliau00e7u00e3o das seis posiu00e7u00f5es de pulso tradicionais

## Estrutura de Dados

O componente gerencia um objeto com a seguinte estrutura:

```javascript
{
  constitution_type: string,       // Tipo constitucional da paciente
  dominant_element: string,        // Elemento dominante (Madeira, Fogo, Terra, Metal, \u00c1gua)
  disharmony_patterns: string[],   // Padru00f5es de desarmonia identificados
  imbalanced_meridians: string[],  // Meridianos em desequilu00edbrio
  
  tongue_diagnosis: {              // Avaliau00e7u00e3o da lu00edngua
    color: string,                 // Cor da lu00edngua
    shape: string,                 // Forma/morfologia
    coating: string,               // Tipo de saburra
    coating_color: string,         // Cor da saburra
    notes: string                  // Observau00e7u00f5es adicionais
  },
  
  pulse_diagnosis: {               // Avaliau00e7u00e3o do pulso nas seis posiu00e7u00f5es
    left_distal: string,           // Posiu00e7u00e3o distal esquerda (Corau00e7u00e3o/ID)
    left_middle: string,           // Posiu00e7u00e3o mu00e9dia esquerda (Fu00edgado/VB)
    left_proximal: string,         // Posiu00e7u00e3o proximal esquerda (Rim/Bexiga)
    right_distal: string,          // Posiu00e7u00e3o distal direita (Pulmu00e3o/IG)
    right_middle: string,          // Posiu00e7u00e3o mu00e9dia direita (Bau00e7o/Estnu00f4mago)
    right_proximal: string,        // Posiu00e7u00e3o proximal direita (CS/TA)
    notes: string                  // Observau00e7u00f5es adicionais
  },
  
  organ_imbalances: {              // Avaliau00e7u00e3o do sistema Zang-Fu
    liver: number,                 // Fu00edgado (-5 a +5)
    heart: number,                 // Corau00e7u00e3o (-5 a +5)
    spleen: number,                // Bau00e7o-Pu00e2ncreas (-5 a +5)
    lung: number,                  // Pulmu00e3o (-5 a +5)
    kidney: number,                // Rim (-5 a +5)
    gallbladder: number,           // Vesu00edcula Biliar (-5 a +5)
    stomach: number,               // Estnu00f4mago (-5 a +5)
    small_intestine: number,       // Intestino Delgado (-5 a +5)
    large_intestine: number,       // Intestino Grosso (-5 a +5)
    bladder: number                // Bexiga (-5 a +5)
  },
  
  yin_yang_balance: number,        // Balanu00e7o Yin-Yang (0-10, onde 5 u00e9 equilu00edbrio)
  notes: string                    // Observau00e7u00f5es gerais e recomendau00e7u00f5es
}
```

## Bases de Dados Embutidas

Para facilitar o preenchimento, o componente inclui listas pru00e9-definidas:

### Cinco Elementos
Sistema fundamental da MTC que inclui Madeira, Fogo, Terra, Metal e u00c1gua, cada um com representau00e7u00e3o visual e cor correspondente.

### Meridianos Principais
Lista dos 14 meridianos principais da acupuntura, incluindo os 12 meridianos regulares e os dois vasos extraordinrios principais (Vaso Concepu00e7u00e3o e Vaso Governador).

### Padru00f5es de Desarmonia
Catalogau00e7u00e3o de 13 padru00f5es comuns de desequilu00edbrio na MTC, como deficencias e excessos de Qi, Sangue, Yin e Yang, além de patologias como Calor, Frio, Umidade, etc.

### Tipos de Constituiu00e7u00e3o
Lista com 9 classificau00e7u00f5es constitucionais na MTC, desde o tipo equilibrado atu00e9 vrios desequilu00edbrios constitucionais.

### Diagnu00f3stico pela Lu00edngua
Estrutura categorizada para avaliau00e7u00e3o da lu00edngua segundo quatro aspectos:
- Cor da lu00edngua (6 opu00e7u00f5es)
- Forma/morfologia (8 opu00e7u00f5es)
- Tipo de saburra (6 opu00e7u00f5es)
- Cor da saburra (5 opu00e7u00f5es)

## Interface do Usu00e1rio

### 1. Organizau00e7u00e3o em Cards Temu00e1ticos
- **Constituiu00e7u00e3o e Elemento**: Card com seleu00e7u00e3o de tipo constitucional, elemento e balanu00e7o Yin-Yang
- **Padru00f5es de Desarmonia**: Card com seletor mu00faltiplo de padru00f5es e meridianos afetados
- **Diagnu00f3stico pela Lu00edngua**: Card com quatro seleu00e7u00f5es para aspectos da lu00edngua
- **Diagnu00f3stico pelo Pulso**: Card com campos para as seis posiu00e7u00f5es de pulso
- **Balanu00e7o dos u00d3rgu00e3os**: Card com sliders para os dez u00f3rgu00e3os principais

### 2. Elementos Visuais e Interativos
- **u00cdcones Coloridos**: Representau00e7u00e3o visual dos cinco elementos com cores tradicionais
- **Sliders Interativos**: Controles para avaliau00e7u00e3o graduada de u00f3rgu00e3os e balanu00e7o Yin-Yang
- **Chips para Seleu00e7u00f5es Mu00faltiplas**: Interface visual para padru00f5es e meridianos
- **Simbolo Yin-Yang Rotativo**: Representau00e7u00e3o visual dinu00e2mica do balanu00e7o energu00e9tico

## Animau00e7u00f5es e UX

O componente utiliza a biblioteca Framer Motion para:

- **Entrada Sequencial**: Cards surgem com atraso progressivo para melhor experincia
- **Transiu00e7u00f5es Suaves**: Efeitos de fade e movimento ao carregar seo
- **Interatividade Visual**: Transformau00e7u00f5es em tempo real, como a rotau00e7u00e3o do smbolo Yin-Yang

## Integrau00e7u00e3o com IA

Os dados da avaliau00e7u00e3o de MTC seru00e3o utilizados pelo sistema de IA (LangChain) para:

1. Correlacionar padru00f5es de MTC com sintomas modernos
2. Adaptar recomendau00e7u00f5es de estilo de vida baseadas no tipo constitucional
3. Considerar ciclos da MTC nas recomendau00e7u00f5es baseadas em ciclicidade feminina
4. Criar pontes conceituais entre medicina oriental e ocidental
5. Gerar planos de tratamento integrativo personalizado

## Responsividade

O componente foi projetado para adaptar-se a diferentes tamanhos de tela:
- Layout em grade fluido usando Grid do Material UI
- Adaptau00e7u00e3o de dois para um card por linha em dispositivos mu00f3veis
- Ajuste automtico de tamanho dos controles para telas menores
