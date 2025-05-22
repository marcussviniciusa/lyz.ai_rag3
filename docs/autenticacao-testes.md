# Testes de Autenticau00e7u00e3o - Documentau00e7u00e3o

## Visão Geral

Este documento descreve a abordagem utilizada para testar o sistema de autenticau00e7u00e3o do Lyz Healthcare, focando em testes unitários e de integração tanto para o backend quanto para o frontend.

## Desafios Enfrentados

### Problema de Dependu00eancia do MongoDB Memory Server

Durante a implementau00e7u00e3o dos testes, enfrentamos o seguinte erro:

```
Instance failed to start because a library is missing or cannot be opened: "libcrypto.so.1.1"
```

Este erro ocorre porque o MongoDB Memory Server depende da biblioteca libcrypto.so.1.1, que não está disponível no ambiente de execuu00e7u00e3o atual.

### Soluu00e7u00e3o Implementada

Adotamos uma abordagem que elimina a dependu00eancia do MongoDB Memory Server, substituindo-a por mocks completos para o Mongoose e seus modelos. Isso permite que os testes sejam executados em qualquer ambiente, independentemente das bibliotecas disponíveis.

## Estratu00e9gia de Mocking

### Backend

1. **Mock do Mongoose**: Simulamos o comportamento do Mongoose para eliminar a necessidade de uma conexão real com o banco de dados.

```javascript
jest.mock('mongoose', () => ({
  Schema: {
    Types: {
      ObjectId: String
    }
  },
  model: jest.fn().mockReturnValue({})
}));
```

2. **Mock dos Modelos**: Criamos mocks específicos para cada modelo utilizado nos testes.

```javascript
jest.mock('../src/models/user.model', () => ({
  findById: jest.fn().mockReturnValue({
    populate: jest.fn()
  })
}));
```

3. **Mock do JWT**: Simulamos as funu00e7u00f5es de verificau00e7u00e3o e geração de tokens JWT.

```javascript
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
  sign: jest.fn()
}));
```

## Testes Implementados

### Middleware de Autenticau00e7u00e3o

1. **Testes para o middleware `authenticate`**:
   - Erro 401 quando token não fornecido
   - Erro 401 quando formato do token for inválido
   - Erro 401 quando token for inválido
   - Erro 404 quando usuário não encontrado
   - Erro 403 quando usuário estiver inativo
   - Chamada de next() quando autenticado com sucesso

2. **Testes para o middleware `authorize`**:
   - Erro 401 quando usuário não autenticado
   - Erro 403 quando usuário não tem a role necessária
   - Chamada de next() quando usuário tem a role necessária

## Lições Aprendidas

1. **Independu00eancia de Infraestrutura**: Ao utilizar mocks bem definidos, conseguimos tornar os testes independentes de componentes externos como o MongoDB.

2. **Isolamento de Testes**: Garantimos que os testes sejam executados de forma isolada, evitando interferências entre diferentes testes.

3. **Manutenu00e7u00e3o Simplificada**: A abordagem de mocking facilita a manutenção dos testes, pois alterações no código fonte não necessariamente impactam os testes quando a interface permanece a mesma.

## Próximos Passos

1. **Ampliar Cobertura de Testes**: Expandir os testes para cobrir mais casos de uso e cenários de erro.

2. **Testes de Integração**: Implementar testes que verifiquem a integração entre diferentes componentes do sistema.

3. **Testes E2E**: Desenvolver testes end-to-end que simulem o comportamento real do usuário no sistema.
