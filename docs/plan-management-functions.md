# Documentau00e7u00e3o das Funu00e7u00f5es de Gerenciamento de Planos

Este documento descreve as principais funu00e7u00f5es implementadas para o gerenciamento de planos de sau00fade personalizados no sistema Lyz.

## 1. Listagem de Planos

### `getPlans(req, res)`

**Descriu00e7u00e3o**: Recupera todos os planos do usuu00e1rio atual ou da empresa (no caso de superadmins), com suporte a paginau00e7u00e3o, busca e filtros.

**Parau00e2metros de Query**:
- `page`: Nu00famero da pu00e1gina (padru00e3o: 1)
- `limit`: Quantidade de itens por pu00e1gina (padru00e3o: 10)
- `search`: Termo para busca no nome da paciente ou tu00edtulo do plano
- `status`: Filtro por status do plano
- `sortBy`: Campo para ordenau00e7u00e3o (padru00e3o: 'created_at')
- `sortOrder`: Ordem de classificau00e7u00e3o ('asc' ou 'desc', padru00e3o: 'desc')
- `company_id`: (Apenas para superadmins) Filtrar por empresa especu00edfica

**Localizau00e7u00e3o**: `/backend/src/controllers/plan.controller.js`

**Endpoint**: `GET /api/plans`

**Permissu00f5es**: Usuu00e1rios autenticados podem ver seus pru00f3prios planos. Superadmins podem ver todos os planos.

## 2. Detalhes de um Plano

### `getPlan(req, res)`

**Descriu00e7u00e3o**: Recupera os detalhes completos de um plano especu00edfico, incluindo URLs temporu00e1rias para acessar arquivos de exames armazenados no MinIO.

**Parau00e2metros**:
- `id`: ID do plano (via parau00e2metro de rota)

**Localizau00e7u00e3o**: `/backend/src/controllers/plan.controller.js`

**Endpoint**: `GET /api/plans/:id`

**Permissu00f5es**: Apenas o criador do plano ou superadmins podem visualizar os detalhes.

## 3. Criau00e7u00e3o de Plano

### `createPlan(req, res)`

**Descriu00e7u00e3o**: Cria um novo plano de sau00fade personalizado, validando os campos obrigatu00f3rios e verificando os limites da empresa.

**Parau00e2metros do Body**:
- `title`: Tu00edtulo do plano (opcional, padru00e3o u00e9 gerado com base no nome da paciente)
- `patient`: Objeto com dados da paciente (nome, idade, altura, peso)
- `menstrual_history`: Histu00f3rico menstrual
- `symptoms`: Lista de sintomas (obrigatu00f3rio ter pelo menos um)
- `health_history`: Histu00f3rico de sau00fade
- `lifestyle`: Informau00e7u00f5es sobre estilo de vida
- `exams`: Lista de exames
- `tcm_observations`: Observau00e7u00f5es de Medicina Tradicional Chinesa
- `timeline`: Linha do tempo funcional
- `ifm_matrix`: Matriz IFM

**Localizau00e7u00e3o**: `/backend/src/controllers/plan.controller.js`

**Endpoint**: `POST /api/plans`

**Permissu00f5es**: Qualquer usuu00e1rio autenticado em uma empresa ativa e com tokens disponu00edveis.

## 4. Atualizau00e7u00e3o de Plano

### `updatePlan(req, res)`

**Descriu00e7u00e3o**: Atualiza um plano existente com novos dados. Se o status for alterado para 'generating', inicia o processo de gerau00e7u00e3o do plano final usando LangChain.

**Parau00e2metros**:
- `id`: ID do plano (via parau00e2metro de rota)
- Campos a serem atualizados (via body, os mesmos da criau00e7u00e3o)
- `status`: Status do plano ('draft', 'generating', 'completed', 'error')
- `final_plan`: Conteu00fado do plano final gerado

**Localizau00e7u00e3o**: `/backend/src/controllers/plan.controller.js`

**Endpoint**: `PUT /api/plans/:id`

**Permissu00f5es**: Apenas o criador do plano pode atualizor. Planos com status 'completed' nu00e3o podem ser editados.

**Fluxo de Gerau00e7u00e3o de Plano**:
1. Quando o status u00e9 alterado para 'generating':
   - O plano u00e9 salvo com status 'generating'
   - O serviu00e7o LangChain u00e9 chamado para processar os dados
   - O plano final gerado u00e9 salvo
   - Os tokens usados su00e3o contabilizados na empresa
   - O status u00e9 atualizado para 'completed' ou 'error' em caso de falha

## 5. Exclusu00e3o de Plano

### `deletePlan(req, res)`

**Descriu00e7u00e3o**: Remove um plano e todos os arquivos associados a ele no armazenamento MinIO.

**Parau00e2metros**:
- `id`: ID do plano (via parau00e2metro de rota)

**Localizau00e7u00e3o**: `/backend/src/controllers/plan.controller.js`

**Endpoint**: `DELETE /api/plans/:id`

**Permissu00f5es**: Apenas o criador do plano pode excluir.

## 6. Exportau00e7u00e3o de Plano para PDF

### `exportPlan(req, res)`

**Descriu00e7u00e3o**: Gera e fornece um arquivo PDF do plano finalizado para download.

**Parau00e2metros**:
- `id`: ID do plano (via parau00e2metro de rota)

**Localizau00e7u00e3o**: `/backend/src/controllers/plan.controller.js`

**Endpoint**: `GET /api/plans/:id/export`

**Permissu00f5es**: O criador do plano ou superadmins podem exportar. Apenas planos com status 'completed' podem ser exportados.

## Modelo de Dados do Plano

```javascript
{
  title: String,                 // Tu00edtulo do plano
  patient: {                     // Dados da paciente
    name: String,                // Nome (obrigatu00f3rio)
    age: Number,                 // Idade
    height: Number,              // Altura em cm
    weight: Number               // Peso em kg
  },
  menstrual_history: {           // Histu00f3rico menstrual
    menarche_age: Number,        // Idade da menarca
    cycle_duration: Number,      // Durau00e7u00e3o mu00e9dia do ciclo em dias
    menstruation_duration: Number, // Durau00e7u00e3o mu00e9dia da menstruau00e7u00e3o em dias
    is_menopausal: Boolean,      // Estu00e1 em climatu00e9rio/menopausa
    last_menstruation: Date,     // Data da u00faltima menstruau00e7u00e3o
    contraceptives: String       // Uso de contraceptivos
  },
  symptoms: [{                   // Lista de sintomas
    description: String,         // Descriu00e7u00e3o do sintoma
    priority: Number            // Prioridade (1 = mais importante)
  }],
  health_history: {              // Histu00f3rico de sau00fade
    medical_history: String,     // Histu00f3rico mu00e9dico
    family_history: String,      // Histu00f3rico familiar
    allergies: String,           // Alergias e intoleru00e2ncias
    previous_treatments: String, // Tratamentos anteriores
    current_medications: String, // Medicamentos atuais
    current_supplements: String  // Suplementos atuais
  },
  lifestyle: {                   // Estilo de vida
    sleep_quality: String,       // Qualidade do sono
    sleep_hours: Number,         // Horas mu00e9dias de sono por noite
    exercise: String,            // Frequu00eancia e tipo de exercu00edcios
    stress_level: String,        // Nu00edvel de estresse percebido
    diet_quality: String,        // Qualidade da alimentau00e7u00e3o
    relationships_quality: String, // Qualidade dos relacionamentos
    treatment_goals: String      // Objetivos do tratamento
  },
  exams: [{                      // Lista de exames
    name: String,                // Nome do exame
    date: Date,                  // Data do exame
    results: String,             // Resultados
    file_key: String,            // Chave do arquivo no MinIO
    file_url: String,            // URL temporaria (nu00e3o armazenada)
    analysis: String             // Anu00e1lise feita pela IA
  }],
  tcm_observations: {            // Medicina Tradicional Chinesa
    face: String,                // Observau00e7u00f5es da face
    tongue: String,              // Observau00e7u00f5es da lu00edngua
    pulse: String,               // Observau00e7u00f5es do pulso
    energy_signs: String         // Sinais energu00e9ticos
  },
  timeline: [{                   // Linha do tempo funcional
    date: Date,                  // Data do evento
    description: String,         // Descriu00e7u00e3o
    type: String                 // Tipo de evento
  }],
  ifm_matrix: {                  // Matriz IFM
    assimilation: String,        // Assimilau00e7u00e3o
    defense: String,             // Defesa e reparo
    energy: String,              // Energia
    biotransformation: String,   // Biotransformau00e7u00e3o e eliminau00e7u00e3o
    transport: String,           // Transporte
    communication: String,       // Comunicau00e7u00e3o
    structure: String           // Estrutura
  },
  status: String,                // Status: 'draft', 'generating', 'completed', 'error'
  final_plan: {                  // Plano final gerado pela IA
    content: String,             // Conteu00fado completo
    recommendations: [{          // Recomendau00e7u00f5es
      type: String,              // Tipo (dieta, suplementos, etc)
      description: String        // Descriu00e7u00e3o
    }],
    token_usage: Number          // Tokens utilizados na gerau00e7u00e3o
  },
  created_by: ObjectId,          // Referencia ao usuu00e1rio criador
  company_id: ObjectId,          // Referencia u00e0 empresa
  generation_started_at: Date,   // Data de inu00edcio da gerau00e7u00e3o
  generation_completed_at: Date, // Data de conclusu00e3o da gerau00e7u00e3o
  generation_error: String,      // Erro de gerau00e7u00e3o, se houver
  created_at: Date,              // Data de criau00e7u00e3o
  updated_at: Date               // Data de atualizau00e7u00e3o
}
```

## Serviu00e7os Relacionados

### MinioService

Responsu00e1vel por gerenciar o armazenamento de arquivos (exames) no MinIO.

**Funu00e7u00f5es principais**:
- `uploadFile(file, path)`: Upload de arquivo
- `getPresignedUrl(fileKey)`: Obter URL temporaria para acesso ao arquivo
- `deleteFile(fileKey)`: Excluir arquivo

### LangChainService

Responsu00e1vel pela integrau00e7u00e3o com LangChain para gerau00e7u00e3o do plano final com base nos dados fornecidos.

**Funu00e7u00e3o principal**:
- `generatePlan(planData)`: Processa os dados do plano e gera o plano final personalizado

### PDFService

Responsu00e1vel pela gerau00e7u00e3o de arquivos PDF dos planos finalizados.

**Funu00e7u00e3o principal**:
- `generatePlanPDF(plan)`: Gera um arquivo PDF a partir dos dados do plano
