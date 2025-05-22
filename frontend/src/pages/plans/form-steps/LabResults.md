# Documentau00e7u00e3o do Componente LabResults

## Visu00e3o Geral
O componente `LabResults` u00e9 dedicado ao gerenciamento de exames laboratoriais no sistema Lyz. Ele permite aos profissionais de sau00fade registrar, visualizar e gerenciar resultados de exames das pacientes, incluindo o upload e visualizau00e7u00e3o de arquivos relacionados como PDFs ou imagens. Este componente u00e9 essencial para o acompanhamento do histrico de exames e integra-se com o serviu00e7o MinIO para armazenamento seguro dos arquivos.

## Funcionalidades Principais

### 1. Cadastro Completo de Exames
- **Registro de Tipo e Data**: Documentau00e7u00e3o categorizada de exames com datas
- **Resultados Principais**: Campo para valores relevantes e intervalos de referu00eancia
- **Observau00e7u00f5es**: Espau00e7o para anu00e1lises e comentrios sobre os resultados
- **Upload de Arquivos**: Integrao com MinIO para armazenar documentos comprobatu00f3rios

### 2. Gestu00e3o de Arquivos
- **Upload Interativo**: Interface com progresso visual do envio
- **Visualizau00e7u00e3o Integrada**: Pru00e9-visualizau00e7u00e3o de imagens e acesso a documentos
- **Validau00e7u00e3o de Formatos**: Verificau00e7u00e3o automtica de tipos de arquivo permitidos
- **Controle de Tamanho**: Limitau00e7u00e3o e verificau00e7u00e3o de tamanho mu00e1ximo (10MB)

### 3. Interface Intuitiva
- **Lista Organizada**: Visualizau00e7u00e3o em cards dos exames cadastrados
- **Filtragem Visual**: Identificau00e7u00e3o ru00e1pida por tipo e data
- **Ediu00e7u00e3o Simplificada**: Acesso direto a funcionalidades de ediu00e7u00e3o e exclusu00e3o
- **Animau00e7u00f5es**: Transiu00e7u00f5es suaves utilizando Framer Motion

## Estrutura de Dados

O componente gerencia um objeto com a seguinte estrutura:

```javascript
{
  exams: [
    {
      id: string,            // Identificador u00fanico do exame
      type: string,          // Tipo de exame (Hemograma, Glicemia, etc.)
      date: string,          // Data do exame (formato yyyy-MM-dd)
      notes: string,         // Observau00e7u00f5es e anu00e1lises
      results: string,       // Resultados principais e valores de referu00eancia
      file_key: string,      // Chave do arquivo no MinIO (se existir)
      file_name: string,     // Nome original do arquivo
      file_type: string,     // Tipo MIME do arquivo
      uploaded_at: string    // Data de upload do arquivo
    }
  ]
}
```

## Bases de Dados Embutidas

Para facilitar o preenchimento, o componente inclui listas pru00e9-definidas:

### Tipos de Exame
Catalogau00e7u00e3o de mais de 45 tipos comuns de exames, incluindo:
- Exames sangu00edu00edneos (Hemograma, Glicemia, Perfil Lipidico, etc.)
- Hormnu00f4nios (TSH, T4, FSH, LH, Estradiol, etc.)
- Biomarcadores (Vitamina D, B12, Ferritina, etc.)
- Exames de imagem (Ecografias, Mamografia, etc.)
- Outros procedimentos diagnsu00f3ticos

### Tipos de Arquivo Permitidos
Lista de 8 formatos de arquivo aceitos, incluindo:
- Documentos (PDF, DOC, DOCX)
- Imagens (JPEG, PNG, TIFF)
- Planilhas (XLS, XLSX)

## Componentes da Interface

### 1. Listagem Principal
- **Estado Vazio**: Feedback visual quando nu00e3o hu00e1 exames cadastrados
- **Layout em Grid**: Organizau00e7u00e3o responsiva de cards (2 colunas em desktop)
- **Cards de Exame**: Apresentau00e7u00e3o visual dos dados principais
- **Chips Informativos**: Indicadores de data e arquivos anexados

### 2. Diu00e1logo de Adiu00e7u00e3o/Ediu00e7u00e3o
- **Formulu00e1rio Estruturado**: Campos organizados para entrada de dados
- **Seleu00e7u00e3o de Tipo**: Menu dropdown com opu00e7u00f5es pru00e9-definidas
- **u00c1rea de Upload**: Interface dedicada com feedback visual
- **Progresso Visual**: Barra de progresso durante upload de arquivos

### 3. Diu00e1logos Auxiliares
- **Visualizau00e7u00e3o de Imagens**: Pru00e9-visualizau00e7u00e3o otimizada de arquivos de imagem
- **Confirmau00e7u00e3o de Exclusu00e3o**: Verificau00e7u00e3o de segurana antes da remou00e7u00e3o

## Integrao com Servios

### MinioService
O componente utiliza o serviu00e7o MinIO para:

1. **Upload de Arquivos**: Envio seguro com feedback de progresso
2. **Obtenu00e7u00e3o de URLs**: Gerao de links temporrios para visualizau00e7u00e3o
3. **Exclusu00e3o de Arquivos**: Remou00e7u00e3o de arquivos associados a exames excluidos

## Validau00e7u00f5es e Segurana

### Validau00e7u00e3o de Arquivos
- Verificau00e7u00e3o de tipos MIME permitidos
- Controle de tamanho mu00e1ximo (limite de 10MB)
- Feedback de erro em caso de arquivo invlido

### Validau00e7u00e3o de Dados
- Verificau00e7u00e3o de campos obrigatu00f3rios (tipo e data)
- Confirmau00e7u00e3o antes de au00e7u00f5es destrutivas (exclusu00e3o)

## Gerenciamento de Recursos

### Otimizau00e7u00e3o de Memu00f3ria
- Revogau00e7u00e3o de URLs de objetos quando nu00e3o mais necessrios
- Limpeza de estados temporrios aps uso

## Integrao com IA

Os dados de exames seru00e3o utilizados pelo sistema de IA (LangChain) para:

1. Analisar tendncias em biomarcadores ao longo do tempo
2. Identificar correlau00e7u00f5es entre resultados e sintomas reportados
3. Sugerir investigau00e7u00f5es adicionais com base em resultados alterados
4. Adaptar recomendau00e7u00f5es do plano de sau00fade considerando resultados laboratoriais

## Responsividade

O componente foi projetado para adaptar-se a diferentes tamanhos de tela:
- Layout em grid de 2 colunas para telas desktop
- Reorganizau00e7u00e3o para uma coluna em dispositivos mu00f3veis
- Controles otimizados para interau00e7u00e3o por toque
- Visualizau00e7u00e3o responsiva de arquivos
