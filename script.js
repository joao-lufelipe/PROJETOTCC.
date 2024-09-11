document.addEventListener("DOMContentLoaded", () => {
    /* Esta linha adiciona um ouvinte de evento ao 
                  objeto document, que escuta pelo 
                  evento 'DOMContentLoaded'.
       Este evento é disparado quando todo o HTML foi 
                  completamente carregado e analisado, 
                  sem esperar por folhas de estilo,
                  imagens e subframes para terminar de carregar. 
       A função que segue será executada uma vez 
                  que esse evento ocorra. */

    const treeContainer = $('#treeContainer');
    /* Define uma constante chamada 'treeContainer' e a 
                  atribui ao elemento HTML com o ID 'treeContainer'.
       Utiliza o jQuery ($) para selecionar o elemento, o que 
                  facilita manipulações subsequentes, como 
                  adicionar a TreeView.
       O elemento é onde a TreeView de funcionários 
                  será renderizada. */

    const departamentoInput = document.getElementById('departamento');
    /* Define uma constante chamada 'departamentoInput' e a 
                  atribui ao elemento HTML com o ID 'departamento'.
       Este input mostrará o departamento do funcionário 
                  selecionado na TreeView. */

    const cargoInput = document.getElementById('cargo');
    /* Define uma constante chamada 'cargoInput' e a 
                  atribui ao elemento HTML com o ID 'cargo'.
       Este input mostrará o cargo do funcionário 
                  selecionado na TreeView. */

    const nomeInput = document.getElementById('nome');
    /* Define uma constante chamada 'nomeInput' e a 
                  atribui ao elemento HTML com o ID 'nome'.
       Este input mostrará o nome do funcionário 
                  selecionado na TreeView. */

    const salarioInput = document.getElementById('salario');
    /* Define uma constante chamada 'salarioInput' e a 
                  atribui ao elemento HTML com o ID 'salario'.
       Este input mostrará o salário do funcionário 
                  selecionado na TreeView. */

    const excelCaminhoArquivo= 'funcionarios.xlsx';
    /* Define uma constante chamada 'excelCaminhoArquivo' e 
                  a atribui com o valor 'funcionarios.xlsx'.
       Esta é a URL ou o caminho para o arquivo Excel que 
                  contém os dados dos funcionários.
       O arquivo será usado para carregar os dados para a 
                  TreeView, permitindo interações dinâmicas 
                  com a estrutura de dados de funcionários. */


    function carregarDadosExcel(url) {
    /* Define a função 'carregarDadosExcel' que aceita 
                  um parâmetro 'url'.
       Este parâmetro 'url' deve ser o caminho para um 
                  arquivo Excel. A função é responsável por 
                  carregar este arquivo e processar seus dados. */

        fetch(url)
        /* Utiliza a função global 'fetch' para realizar uma 
                  solicitação de rede ao recurso especificado 
                  pela 'url'.
        'fetch' retorna uma promessa que resolve com o objeto 
                  de resposta assim que o servidor responde 
                  com os dados. */

            .then(response => response.arrayBuffer())
            /* Quando a promessa inicial é resolvida, ou seja, 
                        quando os dados são recebidos do servidor, 
                        o método 'then' é chamado.
            Este método acessa a resposta e a converte em um 
                        ArrayBuffer usando 'response.arrayBuffer()'.
            Um ArrayBuffer é uma estrutura de dados genérica que 
                        representa um buffer de dados binários 
                        de tamanho fixo. */

            .then(data => {
                /* Após a conversão da resposta em ArrayBuffer, 
                           este próximo bloco 'then' é executado.
                Aqui, 'data' é o ArrayBuffer que contém os dados 
                           binários do arquivo Excel. */

                const workbook = XLSX.read(data, { type: 'array' });
                /* Utiliza a biblioteca SheetJS (xlsx) para ler os 
                           dados do ArrayBuffer. A função 'XLSX.read' é 
                           chamada com 'data' e um objeto de configuração 
                           especificando que os dados são um array.
                O resultado é um objeto 'workbook' que representa o 
                           arquivo Excel carregado. */

                const primeiraSheet = workbook.Sheets[workbook.SheetNames[0]];
                /* Acessa a primeira planilha do arquivo Excel. 
                           'workbook.SheetNames[0]' obtém o nome 
                           da primeira planilha, e 'workbook.Sheets[name]' 
                           acessa os dados da planilha pelo nome. */

                const jsonData = XLSX.utils.sheet_to_json(primeiraSheet, { header: 1 });
                /* Converte a primeira planilha em JSON usando 
                           'XLSX.utils.sheet_to_json'. Esta função 
                           transforma os dados da planilha em um 
                           array de objetos JSON.
                O parâmetro { header: 1 } diz à função para tratar a 
                           primeira linha da planilha como cabeçalho, 
                           facilitando o acesso aos dados por 
                           nomes de campos. */

                // Populando a TreeView com os dados da planilha
                populateTreeView(jsonData);
                /* Chama a função 'populateTreeView', passando os 
                           dados JSON. Esta função é responsável por 
                           construir a TreeView na página
                           usando os dados fornecidos. */

            })

            .catch(error => console.error("Erro ao carregar o arquivo Excel:", error));
            /* O método 'catch' é utilizado para capturar e tratar 
                           qualquer erro que possa ocorrer durante o 
                           processo de fetch ou processamento dos dados.
            Aqui, ele loga uma mensagem de erro no console, informando 
                           se algo der errado durante o carregamento ou 
                           a conversão dos dados do Excel. */
    
    }


    function populateTreeView(data) {
        /* Define a função 'populateTreeView' que aceita 
                     um parâmetro 'data'.
           'data' é um array de arrays, onde cada sub-array 
                     representa uma linha do arquivo Excel 
                     contendo os dados dos funcionários. */
    
        const treeData = [];
        /* Inicializa 'treeData', um array que eventualmente 
                     conterá a estrutura de dados formatada para 
                     uso com a biblioteca jsTree,
                     que renderiza a TreeView na página. */
    
        const departamentos = {};
        /* Cria um objeto 'departamentos' para organizar os 
                     dados em uma estrutura hierárquica baseada em 
                     departamento e cargo. */
    
        data.forEach((linha, indice) => {
            /* Utiliza o método 'forEach' para iterar sobre 
                        cada linha de 'data'.
               'linha' representa uma linha individual do arquivo 
                        Excel, e 'indice' é a posição da linha no array. */
    
            if (indice > 0) { // Ignorar cabeçalho
                /* Condicional que ignora a primeira linha do array, 
                           que geralmente contém os cabeçalhos das 
                           colunas no arquivo Excel. */
    
                const [departamento, cargo, nome, salario] = linha;
                /* Desestruturação do array 'linha' para extrair 
                           'departamento', 'cargo', 'nome', e 'salario'.
                   Cada variável representa um campo correspondente 
                           na linha do Excel. */
    
                if (!departamentos[departamento]) {

                    departamentos[departamento] = {};
                    /* Verifica se o 'departamento' já existe no 
                              objeto 'departamentos'. Se não existir, 
                              inicializa um novo objeto para esse departamento. */

                }
    
                if (!departamentos[departamento][cargo]) {

                    departamentos[departamento][cargo] = [];
                    /* Verifica se o 'cargo' já existe no objeto do 
                              'departamento' específico. Se não existir, 
                              inicializa um novo array para esse cargo. */

                }
    
                departamentos[departamento][cargo].push({ nome, salario });
                /* Adiciona um novo objeto contendo 'nome' e 'salario' ao 
                           array de 'cargo' dentro do 'departamento' correspondente.
                   Cada entrada no array representa um funcionário 
                           específico, agrupado por cargo e departamento. */

            }
        });
        

        for (const departamento in departamentos) {
            /* Inicia um loop para iterar sobre cada 'departamento' 
                        no objeto 'departamentos'.
               Cada 'departamento' atua como uma chave no objeto, e 
                        seu valor associado é outro objeto que contém cargos. */
        
            const deptNode = { text: departamento, children: [] };
            /* Cria um objeto 'deptNode' para representar o 
                        departamento na TreeView.
               'text' é o nome do departamento, que será o 
                        rótulo do nó na TreeView.
               'children' é um array que eventualmente conterá os 
                        nós de cargos como filhos deste nó de 
                        departamento. */
        
            for (const cargo in departamentos[departamento]) {
                /* Inicia um segundo loop para iterar sobre cada 
                           'cargo' dentro de um departamento específico.
                   'departamentos[departamento]' acessa o objeto de 
                           cargos para o departamento atual. */
        
                const cargoNode = { text: cargo, children: [] };
                /* Cria um objeto 'cargoNode' para representar cada 
                           cargo dentro do departamento na TreeView.
                   'text' é o nome do cargo, e 'children' é um array 
                           para conter os nós de funcionários como 
                           filhos deste nó de cargo. */
        
                departamentos[departamento][cargo].forEach(funcionario => {
                    /* Itera sobre o array de funcionários para 
                              um cargo específico.
                       Cada 'funcionario' é um objeto com propriedades 
                              como 'nome' e 'salario'. */
        
                    const nomeNode = {
                        text: funcionario.nome,
                        data: { departamento, cargo, nome: funcionario.nome, salario: funcionario.salario }
                    };
                    /* Cria um objeto 'nomeNode' para cada funcionário.
                       'text' é o nome do funcionário, que será o 
                                 rótulo do nó na TreeView.
                       'data' contém informações adicionais do funcionário, 
                                 que podem ser acessadas quando o nó é interagido. */
        
                    cargoNode.children.push(nomeNode);
                    /* Adiciona o 'nomeNode' ao array de 'children' do 'cargoNode', 
                                 efetivamente vinculando o funcionário ao seu 
                                 cargo na TreeView. */

                });
        
                deptNode.children.push(cargoNode);
                /* Adiciona o 'cargoNode' ao array de 'children' do 
                           'deptNode', vinculando o cargo ao 
                           departamento na TreeView. */

            }
        
            treeData.push(deptNode);
            /* Adiciona o 'deptNode' ao array 'treeData', que 
                           acumula todos os nós de departamentos 
                           para serem exibidos na TreeView.
               'treeData' é o array final que será usado para 
                           construir a TreeView visualmente na página. */

        }
        

        treeContainer.jstree({
            'core': {
                'data': treeData
            }
            /* A função 'jstree()' é chamada no elemento 
                        'treeContainer' para inicializar a TreeView.
               - 'core': Este objeto define as configurações 
                        básicas da TreeView.
               - 'data': Passa 'treeData' como os dados que 
                        construirão a estrutura da TreeView.
               'treeData' contém a estrutura hierárquica completa 
                        de departamentos, cargos e funcionários, que 
                        será renderizada visualmente na TreeView. */

        });
        
        treeContainer.on("select_node.jstree", function (e, data) {
            /* Adiciona um ouvinte de eventos ao 'treeContainer' 
                        para o evento 'select_node.jstree'.
               Este evento é disparado sempre que um nó na 
                        TreeView é selecionado pelo usuário.
               - 'e' é o objeto evento padrão do JavaScript.
               - 'data' é um objeto fornecido pelo jsTree que 
                        contém detalhes sobre o nó selecionado. */
        
            const noSelecionado = data.node;
            /* Declara uma constante 'noSelecionado' e atribui 
                        a ela o nó selecionado.
               'data.node' contém o nó da TreeView que foi 
                        clicado pelo usuário. */
        
            if (noSelecionado.data) {
                /* Verifica se o nó selecionado contém 
                        dados associados.
                   Esses dados foram definidos anteriormente 
                        quando os nós foram criados. */
        
                departamentoInput.value = noSelecionado.data.departamento;
                /* Atribui o valor do 'departamento' do nó selecionado 
                           ao campo de entrada 'departamentoInput'.
                   Isso atualiza o campo de entrada 'departamento' na 
                           interface do usuário para mostrar o departamento 
                           do funcionário selecionado. */
        
                cargoInput.value = noSelecionado.data.cargo;
                /* Similarmente, atualiza o campo de entrada 'cargoInput' 
                           para mostrar o cargo do funcionário selecionado. */
        
                nomeInput.value = noSelecionado.data.nome;
                /* Atualiza o campo de entrada 'nomeInput' para mostrar o 
                           nome do funcionário selecionado. */
        
                salarioInput.value = noSelecionado.data.salario;
                /* Atualiza o campo de entrada 'salarioInput' para mostrar o 
                           salário do funcionário selecionado. */

            }
        });
        
    }

    // Carregar dados do Excel ao carregar a página
    carregarDadosExcel(excelCaminhoArquivo);
    
});