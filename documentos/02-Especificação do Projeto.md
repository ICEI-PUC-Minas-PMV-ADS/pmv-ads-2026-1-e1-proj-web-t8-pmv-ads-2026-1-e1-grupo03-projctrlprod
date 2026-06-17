# Especificação do Projeto

## Perfis de Usuários

<table>
<tbody>
<tr align=center>
<th colspan="4">Perfil 01 : Administrador </th>
</tr>
<tr>
<td width="100px"><b>Descrição</b></td>
<td width="370px">Gerente ou organizador que supervisiona a produção</td>
<td width="370px">Gerente ou organizador que supervisiona a produção</td>
<td width="370px">Gerente ou organizador que supervisiona a produção</td>
</tr>
<tr>
<td><b>Necessidades</b></td>
<td>
  1 - Saber se o orçamento está de acordo com a fabricação.
<td>
  2 - Controlar a ordem de fabricação das peças por fila e prioridade.
</td>  
<td>
    3 - Identificar gaps e corrigir o processo do orçamento a fabricação.
</td>
</tr>
</tbody>
</table>
<br>
<table>
<tbody>
<tr align=center>
<th colspan="4">Perfil 02 : Torneiro </th>
</tr>
<tr>
<td width="100px"><b>Descrição</b></td>
<td width="350px">Colaborador responsável pela fabricação das peças</td>
<td width="350px">Colaborador responsável pela fabricação das peças</td>
<td width="350px">Colaborador responsável pela fabricação das peças</td>
</tr>
<tr>
<td><b>Necessidades</b></td>
<td>
  1 - Entender como o sistema da empresa funciona.
</td>
<td>  
  2 - Registrar o progresso e o desenvolvimento pessoal.
</td>
<td>  
  3 - Exibir o desempenho individual para administração.
</td>
</tr>
</tbody>
</table>


## Histórias de Usuários

|EU COMO... `QUEM`   | QUERO/PRECISO ... `O QUE`                                       |PARA ... `PORQUE`                                                 |
|--------------------|-----------------------------------------------------------------|------------------------------------------------------------------|
| Torneiro           |Quero contabilizar o tempo e custo de produção de cada peça      | Para registrar o meu desempenho.                                 |
| Administrador      |quero acompanhar a fila de produção                              | para orientar melhor os colaboradores.                           |
| Administrador      |quero acompanhar o que já foi produzido                          | para não perder o controle e melhorar a tratativa com o cliente. |
| Administrador      |quero criar um orçamento para a produção de cada tipo de peça    | Para registrar o meu desempenho.                                 |
| Administrador      |quero entender melhor os meus custos de produção hora            | para ser mais assertivo e evitar prejuízos para empresa.         |
| Administrador      |quero analisar qual turno é mais produtivo                       | para organizar e balancear a equipe.                             |
| Administrador      |quero analisar qual máquina está produzindo mais peças           | para balancear o desgaste das máquinas.                          |
| Administrador      |quero saber quantos ciclos foram feitos em cada máquina          | para ver se uso mais a CNC ou torno.                             |
| Torneiro           |quero entender como o sistema funciona assim que entro na empresa| para começar logo o meu trabalho da maneira correta.             |
| Torneiro           |quero saber o quanto produzi no mês                              | para mostrar o meu rendimento.                                   |
| Administrador      |quero saber os custos fixos da produção                          | para ter uma visão completa dos gastos que estão acontecendo.    |
| Administrador      |Quero que os meus funcionários não acessem certas informações    | para manter a confidencialidade dessas informações.              |
| Torneiro           |quero poder registrar quando uma manutenção inesperada acontece  | para não alarmar a administração quanto ao custo de produção.    |


## Requisitos do Projeto

### Requisitos Funcionais

|ID       | Descrição                                                                                                                           | Prioridade |
|---------|-------------------------------------------------------------------------------------------------------------------------------------|------------|
| RF-01   | O sistema deve possibilitar o cadastro de novos colaboradores dos setores da produção e administração.                              | Alta    | 
| RF-02   | O sistema deve permitir que um torneiro inicie, pause e conclua o tempo de produção de uma determinada peça.                        | Alta    |
| RF-03   | O sistema deve possibilitar a administração programar uma fila de produção com base na sua categoria (crítica, alta, média, normal).                                                                                                                                        | Alta    |
| RF-04   | O sistema deve possibilitar que o cliente ou colaborador adicione anotações para melhorar o gerenciamento.                         | Alta    |
| RF-05   | O sistema deve possibilitar a identificação de qual máquina executou o trabalho (CNC, Torno).                                       | Alta    |
| RF-06   | O sistema deve possibilitar segregação de acesso a páginas de acordo com os perfis de usuários.                                     | Alta    |
| RF-07   | O sistema deve permitir o setor administrativo criar o orçamento da peça dentro da plataforma.                                      | Média   |
| RF-08   | O sistema deve permitir que os colaboradores vejam um relatório de pedidos detalhatamente                                          | Média   |
| RF-09   | O sistema deve permitir a apresentação de gráficos da fila de produção atual                                                        | Média   |
| RF-10   | O sistema deve possibilitar a pesquisa de uma aba dentro do menu para uma melhor visualização                                       | Média   |
| RF-11   | O sistema deve possuir uma barra de pesquisa nas abas do sistea para uma melhor busca de produtors ou máquinas                     | Média   |
| RF-12   | O sistema deve possibilitar uma personalização adequada para cada cliente ou colaborador(Cor, logo e tema)                          | Média   |
| RF-13   | O sistema deve possibilitar o usuário verificar se o produto causou lucro ou perda diretamente após a finalização do serviço        | Baixa   |



### Requisitos não Funcionais

|ID      | Descrição                                                                                       |Prioridade |
|--------|-------------------------------------------------------------------------------------------------|-----------|
| RNF-01 | O sistema deve ser desenvolvido em HTML, CSS e JS.                                              | Alta      | 
| RNF-02 | O sistema deve estar disponível na WEB.                                                         | Alta      | 
| RNF-03 | O sistema deve ser responsivo.                                                                  | Alta      | 
| RNF-04 | O sistema deve ser compatível com os principais navegadores do mercado (Firefox, Chrome, Edge)  | Alta      | 
| RNF-05 | O sistema deve utilizar armazenamento local do navegador.                                       | Alta      | 

# Project Specification

## User Profiles

## User Stories

| AS A... `WHO` | I WANT/NEED TO... `WHAT`                                                | SO THAT... `WHY`                                                         |
| ------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Machinist     | I want to track the production time and cost of each part               | So that I can record my performance.                                     |
| Administrator | I want to monitor the production queue                                  | So that I can better coordinate employees.                               |
| Administrator | I want to monitor what has already been produced                        | So that I can maintain control and improve communication with customers. |
| Administrator | I want to create a production estimate for each type of part            | So that I can establish accurate production costs.                       |
| Administrator | I want to better understand my hourly production costs                  | So that I can make more informed decisions and avoid company losses.     |
| Administrator | I want to analyze which shift is the most productive                    | So that I can organize and balance the workforce.                        |
| Administrator | I want to analyze which machine is producing the most parts             | So that I can balance machine wear and usage.                            |
| Administrator | I want to know how many cycles have been completed on each machine      | So that I can compare the usage of CNC machines and lathes.              |
| Machinist     | I want to understand how the system works as soon as I join the company | So that I can start my work correctly from day one.                      |
| Machinist     | I want to know how much I have produced during the month                | So that I can demonstrate my productivity.                               |
| Administrator | I want to know the fixed production costs                               | So that I can have a complete view of ongoing expenses.                  |
| Administrator | I want my employees to be restricted from accessing certain information | So that confidential information remains protected.                      |
| Machinist     | I want to be able to register unexpected maintenance events             | So that management can accurately assess production costs.               |

## Project Requirements

### Functional Requirements

| ID    | Description                                                                                                                                              | Priority |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-01  | The system must allow the registration of new employees from both production and administrative departments.                         | High   |
| FR-02  | The system must allow a machinist to start, pause, and complete the production time tracking of a specific part.                     | High   |
| FR-03  | The system must allow administrators to schedule a production queue based on priority categories (critical, high, medium, and normal).                                                                                                                                       | High   |
| FR-04  | The system should allow the client or collaborator to add notes to improve management.                                               | High   |
| FR-05  | The system must identify which machine performed the work (CNC machine or lathe).                                                    | High   |
| FR-06  | The system must provide role-based access control according to user profiles.                                                        | High   |
| FR-07  | The system must allow the administrative department to create production estimates within the platform.                              | Medium |
| FR-08  | The system should allow employees to view a detailed order report.                                                                   | Medium |
| FR-09  | The system must provide graphical representations of the current production queue.                                                   | Medium |
| FR-10  | The system should allow searching within a tab of the menu for better visualization.                                                 | Medium |
| FR-11  | The system should have a search bar in the system tabs for better searching of producers or machines.                                | Medium |
| FR-12  | The system must allow employees to register unexpected maintenance events.                                                           | Medium   |
| FR-13 | The system should allow the user to verify whether the product generated profit or loss directly after the service is completed.      | Low      |

### Non-Functional Requirements

| ID     | Description                                                                                          | Priority |
| ------ | ---------------------------------------------------------------------------------------------------- | -------- |
| NFR-01 | The system must be developed using HTML, CSS, and JavaScript.                                        | High     |
| NFR-02 | The system must be available as a web application.                                                   | High     |
| NFR-03 | The system must be responsive.                                                                       | High     |
| NFR-04 | The system must be compatible with the major web browsers on the market (Firefox, Chrome, and Edge). | High     |
| NFR-05 | The system must use the browser's local storage for data persistence.                                | High     |
