# Documentau00e7u00e3o do Componente SymptomsForm

## Visu00e3o Geral
O componente `SymptomsForm` u00e9 uma parte essencial do sistema Lyz para o registro e gerenciamento de sintomas das pacientes. Ele permite aos profissionais de sau00fade adicionar, editar, priorizar e excluir sintomas, que seru00e3o usados pela inteligu00eancia artificial para gerar um plano de sau00fade personalizado.

## Funcionalidades Principais

### 1. Gestu00e3o Completa de Sintomas
- **Adiu00e7u00e3o**: Interface intuitiva para registro de novos sintomas
- **Ediu00e7u00e3o**: Modificau00e7u00e3o de sintomas existentes
- **Priorizau00e7u00e3o**: Reordenau00e7u00e3o para definir importu00e2ncia relativa
- **Exclusu00e3o**: Remou00e7u00e3o com confirmau00e7u00e3o de segurana

### 2. Categorizau00e7u00e3o Detalhada
- **Intensidade**: Escala de 1 a 5 com feedback visual por cores
- **Durau00e7u00e3o**: Classificau00e7u00e3o temporal desde sintomas recentes atu00e9 cru00f4nicos
- **Frequu00eancia**: Padru00f5es de ocorru00eancia (constante, cclico, situacional, etc.)
- **Gatilhos**: Fatores que desencadeiam ou agravam os sintomas

### 3. Interface Interativa
- **Busca**: Filtragem dinmica de sintomas por texto
- **Ordenau00e7u00e3o Visual**: Cards coloridos baseados na intensidade
- **Animau00e7u00f5es**: Transiu00e7u00f5es fluidas usando Framer Motion
- **Arrastar e Soltar**: Ajuste de prioridade com controles intuitivos

## Estrutura de Dados

Cada sintoma u00e9 representado por um objeto com a seguinte estrutura:

```javascript
{
  description: string,        // Descriu00e7u00e3o do sintoma
  duration: string,           // Durau00e7u00e3o (recent, short, medium, long, chronic, variable)
  frequency: string,          // Frequu00eancia (constant, frequent, occasional, rare, cyclical, situational)
  intensity: number,          // Intensidade (1-5)
  triggers: string[],         // Lista de gatilhos
  notes: string,              // Observau00e7u00f5es adicionais
  priority: number            // Prioridade (1 = mais importante)
}
```

## Opu00e7u00f5es Pru00e9-definidas

### Intensidade
1. **Leve**: Perceptu00edvel, mas nu00e3o interfere nas atividades
2. **Moderada**: Causa algum desconforto ou limitau00e7u00e3o
3. **Significativa**: Interfere na rotina diu00e1ria
4. **Intensa**: Limita fortemente as atividades diu00e1rias
5. **Severa**: Incapacitante

### Durau00e7u00e3o
- **Recente**: < 1 mu00eas
- **Curta**: 1-3 meses
- **Mu00e9dia**: 3-12 meses
- **Longa**: 1-5 anos
- **Cru00f4nica**: > 5 anos
- **Variu00e1vel/Intermitente**: Sem padru00e3o fixo

### Frequu00eancia
- **Constante**: Todos os dias
- **Frequente**: 4-6 dias por semana
- **Ocasional**: 1-3 dias por semana
- **Raro**: Algumas vezes por mu00eas
- **Cu00edclico**: Relacionado ao ciclo menstrual
- **Situacional**: Associado a gatilhos especu00edficos

## Componentes da Interface

### 1. Barra de Ferramentas
- Campo de busca para filtrar sintomas
- Botu00e3o para adicionar novos sintomas

### 2. Lista de Sintomas
- Cards representando cada sintoma
- Indicau00e7u00e3o visual de prioridade e intensidade
- Controles para ediu00e7u00e3o, exclusu00e3o e reordenau00e7u00e3o

### 3. Formulu00e1rio de Sintoma
- Campos para descriu00e7u00e3o, intensidade, durau00e7u00e3o e frequu00eancia
- Interface para adicionar e remover gatilhos
- Campo para observau00e7u00f5es adicionais

### 4. Diu00e1logos de Confirmau00e7u00e3o
- Confirmau00e7u00e3o antes de excluir sintomas

## Validau00e7u00e3o de Dados

- **Descriu00e7u00e3o**: Campo obrigatu00f3rio, nu00e3o pode ser vazio
- **Intensidade**: Seleo obrigatu00f3ria para classificar a gravidade
- **Prioridade**: Valor numu00e9rico para ordenau00e7u00e3o (ajustado automaticamente)

## Feedback Visual

- **Cores de Intensidade**:
  - Leve: Verde (#4caf50)
  - Moderada: Verde claro (#8bc34a)
  - Significativa: Amarelo (#ffc107)
  - Intensa: Laranja (#ff9800)
  - Severa: Vermelho (#f44336)

- **Chips informativos** para visualizau00e7u00e3o ru00e1pida de:
  - Prioridade
  - Intensidade
  - Durau00e7u00e3o
  - Frequu00eancia

## Integração com IA

Os dados de sintomas coletados seru00e3o utilizados pelo sistema de IA (LangChain) para:

1. Identificar padru00f5es e correlau00e7u00f5es entre sintomas
2. Considerar a prioridade atribuu00edda a cada sintoma
3. Analisar gatilhos potenciais e fatores agravantes
4. Gerar recomendau00e7u00f5es personalizadas com base na intensidade e cronologia

## Responsividade

O componente foi projetado para ser totalmente responsivo:
- Layout adaptativo para diferentes tamanhos de tela
- Cards de sintomas em grade para telas maiores
- Visualizau00e7u00e3o de lista para dispositivos mu00f3veis
- Controles de toque otimizados para interau00e7u00e3o mu00f3vel
