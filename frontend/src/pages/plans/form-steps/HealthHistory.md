# Documentau00e7u00e3o do Componente HealthHistory

## Visu00e3o Geral
O componente `HealthHistory` u00e9 dedicado ao registro detalhado do histu00f3rico de sau00fade da paciente no sistema Lyz. Ele permite aos profissionais de sau00fade documentar condiu00e7u00f5es mu00e9dicas, medicau00e7u00f5es, suplementos, alergias e histu00f3rico familiar, fornecendo informau00e7u00f5es essenciais para a gerau00e7u00e3o do plano personalizado baseado em ciclicidade feminina.

## Funcionalidades Principais

### 1. Registro Categorizado
- **Condiu00e7u00f5es Pru00e9vias**: Documentau00e7u00e3o de condiu00e7u00f5es de sau00fade passadas
- **Condiu00e7u00f5es Atuais**: Registro de diagnu00f3sticos e condiu00e7u00f5es presentes
- **Cirurgias**: Histu00f3rico de procedimentos ciru00fargicos
- **Medicau00e7u00f5es**: Registro de medicamentos em uso
- **Suplementos**: Informau00e7u00f5es sobre suplementau00e7u00e3o
- **Alergias**: Documentau00e7u00e3o de alergias e reacu00e7u00f5es
- **Histu00f3rico Familiar**: Registro de condiu00e7u00f5es hereditrias ou presentes em familiares

### 2. Interface Intuitiva
- **Cards Organizados**: Visualizau00e7u00e3o clara e separada por categoria
- **Listas Interativas**: Listagem completa de itens com controles de ediu00e7u00e3o
- **u00cdcones Visuais**: Identificadores visuais para cada tipo de registro
- **Animau00e7u00f5es**: Transiu00e7u00f5es suaves utilizando Framer Motion

### 3. Funcionalidades de Ediu00e7u00e3o
- **Adiu00e7u00e3o**: Interface simplificada para inclusão de novos itens
- **Ediu00e7u00e3o**: Atualizau00e7u00e3o de informau00e7u00f5es existentes
- **Exclusu00e3o**: Remou00e7u00e3o com diu00e1logo de confirmau00e7u00e3o
- **Autocompletar**: Sugeste de termos comuns para agilizar o preenchimento

## Estrutura de Dados

O componente gerencia um objeto com a seguinte estrutura:

```javascript
{
  previous_conditions: string[], // Condiu00e7u00f5es de sau00fade pru00e9vias
  current_conditions: string[],  // Condiu00e7u00f5es de sau00fade atuais
  surgeries: string[],           // Cirurgias realizadas
  medications: string[],         // Medicamentos em uso
  supplements: string[],         // Suplementos utilizados
  allergies: string[],           // Alergias e intoleru00e2ncias
  family_history: string[]       // Histu00f3rico familiar de condiu00e7u00f5es
}
```

## Bases de Dados Embutidas

Para facilitar o preenchimento, o componente inclui listas pru00e9-definidas com itens comuns:

### Condiu00e7u00f5es Mu00e9dicas Comuns
Inclui mais de 40 condiu00e7u00f5es frequentes, como hipertensu00e3o, diabetes, distrbios tireoidianos, SOP, endometriose, condiu00e7u00f5es autoimunes, entre outras.

### Medicamentos Comuns
Lista com 20 classes de medicamentos mais utilizados, incluindo analgu00e9sicos, anti-inflamatu00f3rios, antidepressivos, hormniu00f4nios, entre outros.

### Suplementos Comuns
Registro dos 20 suplementos mais utilizados, como vitaminas, minerais, u00f4mega 3, probiticos, entre outros.

### Alergias Comuns
Catalogau00e7u00e3o de 17 alergias frequentes, incluindo medicamentos, alimentos e fatores ambientais.

## Componentes da Interface

### 1. Grid de Categorias
- Organizau00e7u00e3o em grid responsivo de 2 colunas (em telas grandes)
- Cards destacados para cada categoria de informau00e7u00e3o

### 2. Cards de Categoria
- Cabeu00e7alho com icone e titulo representativo
- Lista interativa de itens cadastrados
- Botu00e3o para adiu00e7u00e3o de novos itens
- Feedback visual quando a categoria estu00e1 vazia

### 3. Diu00e1logos
- **Diu00e1logo de Adiu00e7u00e3o/Ediu00e7u00e3o**: Interface com autocomplete para inserir e modificar itens
- **Diu00e1logo de Confirmau00e7u00e3o**: Verificau00e7u00e3o antes da exclusu00e3o de itens

## Funcionalidades Auxiliares

### Autocomplete Contextual
O componente oferece sugestu00f5es relevantes com base na categoria sendo editada:

- **Condiu00e7u00f5es**: Lista extensa de diagnu00f3sticos mu00e9dicos comuns
- **Medicau00e7u00f5es**: Classes principais de medicamentos
- **Suplementos**: Suplementos nutricionais mais utilizados
- **Alergias**: Alergias mais comuns (medicamentos, alimentos, ambientais)

### Placeholders Informativos
Cada campo apresenta exemplos para guiar o formato ideal de preenchimento:

- **Condiu00e7u00f5es Pru00e9vias**: "Ex: Pneumonia (2018)"
- **Condiu00e7u00f5es Atuais**: "Ex: Hipertenu00e7u00e3o (desde 2015)"
- **Medicau00e7u00f5es**: "Ex: Losartana 50mg (1x/dia)"

## Integrau00e7u00e3o com IA

Os dados do histu00f3rico de sau00fade seru00e3o utilizados pelo sistema de IA (LangChain) para:

1. Identificar possveis interau00e7u00f5es entre medicamentos e suplementos
2. Considerar condiu00e7u00f5es de sau00fade no desenvolvimento do plano personalizado
3. Avaliar predisposu00e7u00e3o genu00e9tica baseada no histu00f3rico familiar
4. Adequar recomendau00e7u00f5es considerando alergias e intoleru00e2ncias

## Responsividade

O componente foi projetado para adaptar-se a diferentes tamanhos de tela:
- Layout em grid de 2 colunas para telas desktop
- Empilhamento de cards em coluna u00fanica para dispositivos mu00f3veis
- Interface otimizada para interau00e7u00e3o por toque
