# Documentau00e7u00e3o do Componente LifestyleForm

## Visu00e3o Geral
O componente `LifestyleForm` u00e9 dedicado u00e0 coleta de informau00e7u00f5es detalhadas sobre o estilo de vida da paciente no sistema Lyz. Ele captura dados sobre alimentau00e7u00e3o, atividade fu00edsica, sono, estresse, ocupau00e7u00e3o e fatores ambientais que podem influenciar o ciclo hormonal e o bem-estar geral feminino.

## Funcionalidades Principais

### 1. Perfil Alimentar Completo
- **Tipo de Dieta**: Identificau00e7u00e3o do padru00e3o alimentar principal
- **Restriu00e7u00f5es**: Documentau00e7u00e3o de alergias e escolhas alimentares
- **Frequu00eancia de Refeiu00e7u00f5es**: Padru00e3o de distribuiu00e7u00e3o alimentar diu00e1ria
- **Hidratau00e7u00e3o**: Registro da ingesta hu00eddrica
- **Consumo de u00c1lcool**: Avaliau00e7u00e3o da frequu00eancia e padru00e3o de consumo

### 2. Avaliau00e7u00e3o de Atividade Fu00edsica
- **Frequu00eancia de Exercu00edcios**: Nvel geral de atividade semanal
- **Tipos de Exercu00edcio**: Catalogau00e7u00e3o das modalidades praticadas

### 3. Qualidade do Sono
- **Horas de Sono**: Quantificau00e7u00e3o da durau00e7u00e3o mu00e9dia
- **Qualidade**: Avaliau00e7u00e3o subjetiva da efetividade do descanso

### 4. Gestu00e3o de Estresse
- **Nvel de Estresse**: Escala visual de 0-10
- **Estratu00e9gias de Enfrentamento**: Tu00e9cnicas utilizadas para gestu00e3o do estresse

### 5. Contexto Ocupacional e Ambiental
- **Detalhes da Ocupau00e7u00e3o**: Descriro da atividade profissional e impactos
- **Fatores Ambientais**: Exposiu00e7u00e3o a elementos potencialmente nocivos

## Estrutura de Dados

O componente gerencia um objeto com a seguinte estrutura:

```javascript
{
  diet_type: string,             // Tipo de alimentau00e7u00e3o
  diet_restrictions: string[],    // Restriu00e7u00f5es alimentares
  meal_frequency: string,         // Frequu00eancia de refeiu00e7u00f5es
  water_intake: string,           // Consumo de u00e1gua
  alcohol_consumption: string,    // Consumo de u00e1lcool
  exercise_frequency: string,     // Frequu00eancia de exercu00edcios
  exercise_types: string[],       // Tipos de exercu00edcio
  sleep_quality: string,          // Qualidade do sono
  sleep_hours: string,            // Horas de sono por noite
  stress_level: string,           // Nvel de estresse (0-10)
  stress_management: string[],    // Estratu00e9gias de gestu00e3o do estresse
  occupation_details: string,     // Detalhes da ocupau00e7u00e3o
  environmental_factors: string[] // Fatores ambientais relevantes
}
```

## Bases de Dados Embutidas

Para facilitar o preenchimento, o componente inclui listas pru00e9-definidas com itens comuns:

### Tipos de Dieta
Lista com 16 opu00e7u00f5es, incluindo diversos padru00f5es alimentares como onvora, vegetariana, vegana, cetognica, mediterru00e2nea, entre outras.

### Restriu00e7u00f5es Alimentares
Catalogau00e7u00e3o de 19 restriu00e7u00f5es comuns, incluindo alergias, intoleru00e2ncias e escolhas alimentares.

### Tipos de Exercu00edcio
Lista com 16 modalidades de atividade fu00edsica, desde caminhada atu00e9 treinamentos especu00edficos.

### Estratu00e9gias de Gestu00e3o de Estresse
Compilau00e7u00e3o de 16 abordagens para reduu00e7u00e3o e manejo do estresse.

### Fatores Ambientais
Catalogau00e7u00e3o de 17 exposiu00e7u00f5es ambientais relevantes para a sau00fade hormonal feminina.

## Interface do Usu00e1rio

### 1. Organizau00e7u00e3o por Cards Temu00e1ticos
- Segmentau00e7u00e3o clara em 5 u00e1reas distintas
- Cards com bordas sutis para delimitau00e7u00e3o visual
- u00cdcones intuitivos para cada u00e1rea temu00e1tica

### 2. Elementos de Entrada Variados
- **Seleu00e7u00e3o u00danica**: Menus dropdown para escolhas exclusivas
- **Seleu00e7u00e3o Mu00faltipla**: Campos de autocomplete com chips para itens mu00faltiplos
- **Entrada de Texto**: Campos para informau00e7u00f5es detalhadas
- **Slider**: Controle visual para nvel de estresse

### 3. Componentes Principais
- **Alimentau00e7u00e3o**: Card com 5 campos de entrada
- **Atividade Fu00edsica**: Card com 2 campos de entrada
- **Sono**: Card com 2 campos de entrada
- **Estresse**: Card com slider visual e campo de estratu00e9gias
- **Ocupau00e7u00e3o e Ambiente**: Card com campo de texto e seleu00e7u00e3o de fatores

## Mecanismo de Validau00e7u00e3o

O componente implementa validau00e7u00f5es para garantir a qualidade dos dados:

- **Horas de Sono**: Aceita apenas valores numu00e9ricos
- **Campos Obrigatu00f3rios**: Visual de campos em branco para identificau00e7u00e3o

## Animau00e7u00f5es e UX

O componente utiliza a biblioteca Framer Motion para:  

- **Entrada Gradual**: Animau00e7u00e3o fade-in do tu00edtulo e descriu00e7u00e3o
- **Sequenciamento**: Aparecimento progressivo dos elementos
- **Transiu00e7u00f5es**: Mudanu00e7as suaves ao atualizar dados

## Integrau00e7u00e3o com IA

Os dados de estilo de vida seru00e3o utilizados pelo sistema de IA (LangChain) para:

1. Correlacionar padru00f5es alimentares com sintomas do ciclo
2. Avaliar o impacto da atividade fu00edsica na regulau00e7u00e3o hormonal
3. Considerar fatores de estresse e sono na sau00fade feminina
4. Identificar possveis desencadeadores ambientais para desbalanu00e7os hormonais
5. Gerar recomendau00e7u00f5es personalizadas para cada fase do ciclo menstrual

## Responsividade

O componente foi projetado para adaptar-se a diferentes tamanhos de tela:
- Layout responsivo usando Grid do Material UI
- Reorganizau00e7u00e3o de campos em dispositivos mu00f3veis
- Ajustes automticos de tamanho e espau00e7amento
