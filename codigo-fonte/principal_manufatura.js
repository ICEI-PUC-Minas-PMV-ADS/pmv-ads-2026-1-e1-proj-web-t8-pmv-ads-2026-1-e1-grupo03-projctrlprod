
function registrarAcaoManuf(aba, acao) {
    const usuario = localStorage.getItem('usuarioNome') || 'Desconhecido';
    const agora = new Date();
    const dataHora = agora.toLocaleDateString('pt-BR') + ' ' + agora.toLocaleTimeString('pt-BR');
    let log = JSON.parse(localStorage.getItem('logAcoes')) || [];
    log.push({ usuario, aba, acao, dataHora, ts: agora.getTime() });
    localStorage.setItem('logAcoes', JSON.stringify(log));
}

window.onload = function () {
    const nomeSalvo = localStorage.getItem('usuarioNome');
    const catSalva  = localStorage.getItem('usuarioCat');
    document.getElementById('display-user').innerText     = nomeSalvo || 'Convidado';
    document.getElementById('display-category').innerText = catSalva  || 'N/A';

    // Aplica tema salvo para manufatura
    const temaManuf = localStorage.getItem('temaManufatura') || 'claro';
    if (temaManuf === 'escuro') {
        document.body.classList.add('manuf-dark');
        document.getElementById('btn-tema-manuf').textContent = '🌙';
    }

    let EmProducao = localStorage.getItem('EmProducao') || 'Iniciar';
    if (EmProducao === 'Iniciar') {
        localStorage.setItem('EmProducao', 'Pausado');
    }

    carregarTela('homeManufatura_content');
}

function alternarTemaManufatura() {
    const escuro = document.body.classList.toggle('manuf-dark');
    const btn = document.getElementById('btn-tema-manuf');
    btn.textContent = escuro ? '🌙' : '☀️';
    localStorage.setItem('temaManufatura', escuro ? 'escuro' : 'claro');
}

// Redesenha a tabela a cada 1 segundo se em produção
setInterval(() => {
    if (localStorage.getItem('EmProducao') === 'Rodando') {
        contarMinutos();
    }
}, 1000);

function carregarTela(nomeDaTela) {
    const principal = document.querySelector('.content');
    fetch(`${nomeDaTela}.html`)
        .then(response => {
            if (!response.ok) throw new Error('Página não encontrada');
            return response.text();
        })
        .then(html => {
            principal.innerHTML = html;
            window.scrollTo(0, 0);
            atualizarHome();
        })
        .catch(err => {
            principal.innerHTML = `<p style="color:red">Erro ao carregar: ${err.message}</p>`;
        });
}

function atualizarHome() {
    const listaMaquinas = JSON.parse(localStorage.getItem('maquinas')) || [];
    document.getElementById('totalMaquinas').innerText = listaMaquinas.length;

    const listaPedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    document.getElementById('totalPedidos').innerText = listaPedidos.length;

    const concluidos = localStorage.getItem('Concluidos') || 0;
    document.getElementById('totalConcluido').innerText = concluidos;

    listarPedidos();
}

function listarPedidos(filtro) {
    const corpoTabela = document.getElementById('tabela-corpo');
    let lista = JSON.parse(localStorage.getItem('pedidos')) || [];
    corpoTabela.innerHTML = '';
    
    if (filtro) {
        const f = filtro.toLowerCase();
        lista = lista.filter(p =>
            String(p.id).includes(f) ||
            (p.nomeProduto||'').toLowerCase().includes(f) ||
            (p.numeroPedido||'').toLowerCase().includes(f) ||
            (p.CatMaterial||'').toLowerCase().includes(f) ||
            (p.CatUrgencia||'').toLowerCase().includes(f) ||
            (p.CatMaq||'').toLowerCase().includes(f)
        );
    }

    const pesoUrgencia = { Critica:4, Alta:3, Média:2, Normal:1 };
    lista.sort((a, b) => (pesoUrgencia[b.CatUrgencia]||0) - (pesoUrgencia[a.CatUrgencia]||0));

    const classesBadge = { Normal:'badgeNormal', Média:'badgeMedia', Alta:'badgeAlta', Critica:'badgeCritica' };

    lista.forEach(pedidos => {
        const badge = classesBadge[pedidos.CatUrgencia] || 'badgeNormal';
        const estaRodando = localStorage.getItem('EmProducaoId') == Number(pedidos.id) && localStorage.getItem('EmProducao') === 'Rodando';

        const displayIniciar = estaRodando ? 'none' : 'inline-block';
        const displayPausar  = estaRodando ? 'inline-block' : 'none';

        // Miniatura da imagem
        let imgHtml = '';
        if (pedidos.imagemPedido) {
            const imgSrc = pedidos.imagemPedido.replace(/"/g, '&quot;');
            imgHtml = `<img src="${imgSrc}" alt="Imagem do pedido" class="miniatura-pedido" onclick="abrirImagemPedido(${pedidos.id})" title="Clique para ampliar">`;
        }
        corpoTabela.innerHTML += `
            <tr>
                <td>${pedidos.id}</td>
                <td>${pedidos.nomeProduto}</td>
                <td>${pedidos.numeroPedido}</td>
                <td>${pedidos.CatMaterial}</td>
                <td><span class="${badge}">${pedidos.CatUrgencia}</span></td>
                <td>${pedidos.CatMaq}</td>
                <td>
                    <button data-id="${pedidos.id}" style="display:${displayIniciar};" class="btn-iniciar"   onclick="IniciarPedido(${pedidos.id})">Iniciar</button>
                    <button data-id="${pedidos.id}" style="display:${displayPausar};" class="btn-pausar"    onclick="PausarPedido(${pedidos.id})">Pause</button>
                    <button data-id="${pedidos.id}" class="btn-finalizar" onclick="FinalizarPedido(${pedidos.id})">Fim</button>
                </td>
                <td>${pedidos.horaInicio       || '--:--:--'}</td>
                <td>${pedidos.horaPausa        || '--:--:--'}</td>
                <td>${pedidos.horaFim          || '--:--:--'}</td>
                <td>${pedidos.minutosCorridos  || '--:--:--'}</td>
                <td>${imgHtml}</td>
                <td style="display:none;">${pedidos.valorTotal}</td>
                <td style="display:none;">${pedidos.tempoFabricacao}</td>
            </tr>`;
    });
}

function abrirImagemPedido(id) {
    const lista = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedido = lista.find(p => Number(p.id) === Number(id));
    if (pedido && pedido.imagemPedido) {
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:9999;cursor:pointer;';
        modal.innerHTML = `<img src="${pedido.imagemPedido}" style="max-width:95vw;max-height:92vh;width:auto;height:auto;border-radius:8px;box-shadow:0 0 40px rgba(0,0,0,0.5);">`;
        modal.onclick = () => document.body.removeChild(modal);
        document.body.appendChild(modal);
    }
}

function IniciarPedido(id) {
    const EmProducao = localStorage.getItem('EmProducao');
    if (EmProducao === 'Finalizado' || EmProducao === 'Pausado') {
        if (confirm('Tem certeza que deseja iniciar a produção?')) {
            localStorage.setItem('EmProducao', 'Rodando');
            localStorage.setItem('EmProducaoId', id);
            let lista = JSON.parse(localStorage.getItem('pedidos')) || [];
            const pedido = lista.find(p => Number(p.id) === Number(id));
            if (pedido) {
                if (!pedido.horaInicio) {
                const opcoes    = { hour: '2-digit', minute: '2-digit'};
                pedido.horaInicio = new Date().toLocaleTimeString('pt-BR', opcoes);
                }
                registrarAcaoManuf('Manufatura', `Iniciou produção do pedido: ${pedido.numeroPedido}`);
                localStorage.setItem('pedidos', JSON.stringify(lista));
                listarPedidos();
            }
        }
    } else {
        alert('Primeiro finalize a produção da peça anterior antes de iniciar uma nova.');
    }
}

function PausarPedido(id) {
    const EmProducao = localStorage.getItem('EmProducao');
    if (EmProducao === 'Rodando') {
        if (confirm('Tem certeza que deseja pausar a produção?')) {
            localStorage.setItem('EmProducao', 'Pausado');
            localStorage.setItem('EmProducaoId', id);
            let lista = JSON.parse(localStorage.getItem('pedidos')) || [];
            const pedido = lista.find(p => Number(p.id) === Number(id));
            if (pedido) {
                const opcoes    = { hour: '2-digit', minute: '2-digit'};
                pedido.horaPausa = new Date().toLocaleTimeString('pt-BR', opcoes);
                registrarAcaoManuf('Manufatura', `Pausou produção do pedido: ${pedido.numeroPedido}`);
                localStorage.setItem('pedidos', JSON.stringify(lista));
                listarPedidos();
            }
        }
    } else {
        alert('Primeiro inicie a produção de uma peça antes de pausar.');
    }
}

function FinalizarPedido(id) {
    const EmProducao = localStorage.getItem('EmProducao');
    const EmProducaoId = localStorage.getItem('EmProducaoId');
    if (EmProducao === 'Rodando') {
        if(EmProducaoId != id) {
            alert('O pedido selecionado não está em produção.');
            return;
        }
        if (confirm('Tem certeza que deseja finalizar a produção?')) {
            localStorage.setItem('EmProducao', 'Finalizado');
            localStorage.setItem('EmProducaoId', 0);
            let lista = JSON.parse(localStorage.getItem('pedidos')) || [];
            const pedido = lista.find(p => Number(p.id) === Number(id));
            if (pedido) {
                const opcoes    = { hour: '2-digit', minute: '2-digit'};
                pedido.horaFim = new Date().toLocaleTimeString('pt-BR', opcoes);
                registrarAcaoManuf('Manufatura', `Finalizou produção do pedido: ${pedido.numeroPedido}`);
                localStorage.setItem('pedidos', JSON.stringify(lista));

                const segundos = Number(localStorage.getItem('Segundos')) || 0;
                const minutos  = Number(localStorage.getItem('Minutos'))  || 0;
                const horas    = Number(localStorage.getItem('Horas'))    || 0;
                let totalMinutos = horas * 60 + minutos;
                const resultadoGeral = totalMinutos >= Number(pedido.tempoFabricacao) ? 'Prejuizo' : 'Lucro';

                let listaConcluidos = JSON.parse(localStorage.getItem('pedidosConcluidos')) || [];
                listaConcluidos.push({
                    id: listaConcluidos.length + 1,
                    nomeProduto: pedido.nomeProduto,
                    numeroPedido: pedido.numeroPedido,
                    catMaterial: pedido.CatMaterial,
                    CatUrgencia: pedido.CatUrgencia,
                    CatMaq: pedido.CatMaq,
                    TempoProducao: `${horas}:${minutos}:${segundos}`,
                    valorTotal: pedido.valorTotal,
                    tempoFabricacao: pedido.tempoFabricacao,
                    resultadoFinalMinutos: totalMinutos,
                    resultadoFinal: resultadoGeral,
                    dataFinalizacao: new Date().toISOString()
                });
                localStorage.setItem('pedidosConcluidos', JSON.stringify(listaConcluidos));

                excluirPedido(id);
                localStorage.setItem('Segundos', 0);
                localStorage.setItem('Minutos',  0);
                localStorage.setItem('Horas',    0);
                atualizarHome();
            }
        }
    } else {
        alert('Primeiro inicie a produção de uma peça antes de finalizar.');
    }
}

function contarMinutos() {
    const id  = localStorage.getItem('EmProducaoId');
    let segundos = Number(localStorage.getItem('Segundos')) || 0;
    let minutos  = Number(localStorage.getItem('Minutos'))  || 0;
    let horas    = Number(localStorage.getItem('Horas'))    || 0;

    segundos++;
    if (segundos === 60) { segundos = 0; minutos++; }
    if (minutos  === 60) { minutos  = 0; horas++;   }

    const pad = n => String(n).padStart(2, '0');

    let lista = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedido = lista.find(p => Number(p.id) === Number(id));
    if (pedido) {
        pedido.minutosCorridos = `${pad(horas)}:${pad(minutos)}:${pad(segundos)}`;
        localStorage.setItem('pedidos', JSON.stringify(lista));
        listarPedidos();
    }

    localStorage.setItem('Segundos', segundos);
    localStorage.setItem('Minutos',  minutos);
    localStorage.setItem('Horas',    horas);
}

function excluirPedido(id) {
    let lista = JSON.parse(localStorage.getItem('pedidos')) || [];
    const encontrado = lista.find(p => Number(p.id) === Number(id));
    if (encontrado) {
        lista = lista.filter(u => Number(u.id) !== Number(id));
        localStorage.setItem('pedidos', JSON.stringify(lista));
        let concluidos = Number(localStorage.getItem('Concluidos') || 0) + 1;
        localStorage.setItem('Concluidos', concluidos);
    }
}
