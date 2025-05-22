# Remou00e7u00e3o dos Campos Email e Telefone do Formulu00e1rio de Paciente

## Alterau00e7u00f5es Implementadas

### 1. Remoção dos Campos do Componente de Formulário

Foi realizada a remoção dos seguintes campos do componente `PatientInfoForm.jsx`:

- Campo de Email (com validação de formato de email)
- Campo de Telefone

```jsx
// Campos removidos do formulário:
<Grid item xs={12}>
  <TextField
    required
    id="email"
    name="email"
    label="Email"
    fullWidth
    value={data.email || ''}
    onChange={handleChange}
    type="email"
  />
</Grid>
<Grid item xs={12}>
  <TextField
    id="phone"
    name="phone"
    label="Telefone"
    fullWidth
    value={data.phone || ''}
    onChange={handleChange}
  />
</Grid>
```

### 2. Atualização do Estado Inicial

Também foi atualizado o estado inicial no componente `NewPlanFixed.jsx` para remover os campos correspondentes:

```jsx
// Antes:
patient: { 
  name: '', 
  age: '', 
  email: '', // Removido
  phone: '', // Removido
  height: '', 
  weight: '', 
  birthdate: '' 
}

// Depois:
patient: { 
  name: '', 
  age: '', 
  height: '', 
  weight: '', 
  birthdate: '' 
}
```

## Justificativa

A remoção destes campos foi solicitada para simplificar o processo de cadastro de pacientes, focando apenas nas informações essenciais para a geração do plano de saúde, como dados físicos e características clínicas.

Esta modificação também aumenta a privacidade, reduzindo a coleta de dados de contato sensíveis quando estes não são necessários para o processo principal do aplicativo.

## Impacto na Aplicação

- Formulário mais conciso e focado nos dados relevantes para análise de saúde
- Menos campos para preencher, melhorando a experiência do usuário
- Redução do tempo de preenchimento do formulário
- Menor quantidade de dados pessoais armazenados no sistema

## Observações Adicionais

Caso seja necessário reintroduzir estes campos no futuro (por exemplo, para implementar um sistema de notificação de pacientes), a estrutura do código permite que sejam facilmente adicionados novamente sem afetar a funcionalidade existente.
