window.onload = function () {
    const nomeSalvo = localStorage.getItem('usuarioNome');
    const catSalva  = localStorage.getItem('usuarioCat');
    document.getElementById('display-user').innerText     = nomeSalvo || 'Convidado';
    document.getElementById('display-category').innerText = catSalva  || 'N/A';

    // Aplica modo (conteúdo das abas) e tema (navbar/sidebar)
    const modoSalvo  = localStorage.getItem('modoAdmin')   || 'claro';
    const temaSalvo  = localStorage.getItem('temaNavbar')  || 'azul';
    aplicarModo(modoSalvo, false);
    aplicarTemaNavbar(temaSalvo, false);

    // Restaura nota da sidebar
    const notaSalva = localStorage.getItem('sidebarNota') || '';
    const textarea  = document.getElementById('sidebar-nota');
    if (textarea) { textarea.value = notaSalva; textarea.addEventListener('input', function () { localStorage.setItem('sidebarNota', this.value); }); }

    // Submenu de ajustes sempre fechado ao carregar
    localStorage.setItem('submenuAjustesAberto', 'false');

    restaurarLogoIcone();
    carregarTela('home_content');
}

// Auto-grow textarea
document.addEventListener('input', function(e) {
    if (e.target && e.target.id === 'sidebar-nota') {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    }
});

function toggleAjustes(event) {
    event.stopPropagation();
    const sub   = document.getElementById('submenu-ajustes');
    const arrow = document.getElementById('ajustes-arrow');
    const aberto = sub.classList.toggle('open');
    arrow.classList.toggle('open', aberto);
    localStorage.setItem('submenuAjustesAberto', aberto);
}

function aplicarModo(modo, salvar = true) {
    document.body.classList.remove('modo-escuro','modo-sepia');
    if (modo === 'escuro') document.body.classList.add('modo-escuro');
    if (modo === 'sepia')  document.body.classList.add('modo-sepia');
    if (salvar) localStorage.setItem('modoAdmin', modo);
    // highlight botão ativo
    document.querySelectorAll('.btn-modo').forEach(b => b.classList.toggle('ativo', b.dataset.modo === modo));
}

function aplicarTemaNavbar(tema, salvar = true) {
    document.body.classList.remove('tema-azul','tema-verde-nav','tema-cinza-nav');
    if (tema === 'verde') document.body.classList.add('tema-verde-nav');
    if (tema === 'cinza') document.body.classList.add('tema-cinza-nav');
    // azul é o padrão (sem classe extra)
    if (salvar) localStorage.setItem('temaNavbar', tema);
    document.querySelectorAll('.btn-tema-nav').forEach(b => b.classList.toggle('ativo', b.dataset.tema === tema));
}

// Mantém compatibilidade com chamadas antigas
function aplicarTema(tema, salvar = true) {
    aplicarModo(tema, salvar);
}

function carregarTela(nomeDaTela) {
    const principal = document.querySelector('.content');
    fetch(`${nomeDaTela}.html`)
        .then(r => { if (!r.ok) throw new Error('Página não encontrada'); return r.text(); })
        .then(html => {
            principal.innerHTML = html;
            window.scrollTo(0, 0);
            document.querySelectorAll('.project-tree li').forEach(li => li.classList.remove('active'));

            if      (nomeDaTela === 'home_content')              { document.querySelector('.file_10')?.closest('li').classList.add('active'); atualizarHome(); }
            else if (nomeDaTela === 'cadastrarUsuario_content')  { }
            else if (nomeDaTela === 'listaUsuarios_content')     { document.querySelector('.file_30')?.closest('li').classList.add('active'); listarUsuarios(); }
            else if (nomeDaTela === 'cadastrarMaquinas_content') { }
            else if (nomeDaTela === 'listamaquinas_content')     { document.querySelector('.file_50')?.closest('li').classList.add('active'); listarMaquinas(); }
            else if (nomeDaTela === 'cadastrarPedido_content')   { /* popup – não carrega tela */ }
            else if (nomeDaTela === 'listaPedidos_content')      { document.querySelector('.file_70')?.closest('li').classList.add('active'); listarPedidos(); }
            else if (nomeDaTela === 'dashboard_content')         { document.querySelector('.file_80')?.closest('li').classList.add('active'); listarPedidosConcluidos(); }
            else if (nomeDaTela === 'relatorios_content')        { listarRelatorios(); }
        })
        .catch(err => { principal.innerHTML = `<p style="color:red">Erro ao carregar: ${err.message}</p>`; });
}

function atualizarHome() {
    const emProducao = localStorage.getItem('EmProducao');
    const maqOperacao = (emProducao === 'Rodando') ? 1 : 0;
    document.getElementById('totalMaquinas').innerText = maqOperacao;
    const listaPedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    document.getElementById('totalPedidos').innerText = listaPedidos.length;
    document.getElementById('totalConcluido').innerText = localStorage.getItem('Concluidos') || 0;
    renderizarGrafico();
}

function AtualizarMaquinasPedidos() {
    const lista = JSON.parse(localStorage.getItem('maquinas')) || [];
    const sel   = document.getElementById('CatMaq');
    sel.innerHTML = '<option value="" disabled selected>Selecione uma categoria...</option>';
    lista.forEach(m => { const o = document.createElement('option'); o.value = o.text = m.maquina; sel.appendChild(o); });
}

/* ---- USUÁRIOS ---- */
function CadastrarUsuario() {
    const usuario=document.getElementById('username').value, cat=document.getElementById('usuarioCat').value;
    const senha1=document.getElementById('pwd1').value,      senha2=document.getElementById('pwd2').value;
    if (!usuario||!cat||!senha1||!senha2) { alert('⚠️ Preencha todos os campos!'); return; }
    if (senha1!==senha2) { alert('❌ As senhas estão diferentes!'); document.getElementById('pwd1').value=document.getElementById('pwd2').value=''; return; }
    let lista = JSON.parse(localStorage.getItem('usuarios')) || [{id:1,usuario:'eng',senha:'eng',categoria:'Administrador'}];
    const idCustom = document.getElementById('userId') ? document.getElementById('userId').value.trim() : '';
    let novoId;
    if (idCustom !== '') {
        const parsed = parseInt(idCustom, 10);
        if (isNaN(parsed) || parsed < 1 || String(parsed) !== idCustom) {
            alert('❌ O ID deve ser um número inteiro positivo.'); return;
        }
        novoId = parsed;
        if (lista.find(u => Number(u.id) === novoId)) {
            alert(`❌ O ID "${novoId}" já está em uso. Escolha outro.`); return;
        }
    } else {
        const maxId = lista.reduce((max, u) => Math.max(max, Number(u.id) || 0), 0);
        novoId = maxId + 1;
    }
    lista.push({id:novoId,usuario,senha:senha1,categoria:cat});
    localStorage.setItem('usuarios',JSON.stringify(lista));
    alert(`✅ Usuário ${usuario} cadastrado com sucesso!`);
    registrarAcao('Usuários', `Cadastrou usuário: ${usuario}`);
    document.getElementById('username').value='';
    document.getElementById('pwd1').value='';
    document.getElementById('pwd2').value='';
    document.getElementById('usuarioCat').value='';
    const userIdField = document.getElementById('userId');
    if (userIdField) userIdField.value = '';
    const popup = document.getElementById('popup-novo-usuario');
    if (popup) popup.close();
    listarUsuarios();
}

function listarUsuarios() {
    const corpo = document.getElementById('tabela-corpo');
    const lista = (JSON.parse(localStorage.getItem('usuarios')) || [])
        .slice()
        .sort((a, b) => (a.usuario||'').localeCompare(b.usuario||'', 'pt-BR', { sensitivity: 'base' }));
    corpo.innerHTML = '';
    lista.forEach(u => { corpo.innerHTML += `<tr><td>${u.id}</td><td>${u.usuario}</td><td><span class="badge">${u.categoria}</span></td><td><button class="btn-excluir" onclick="excluirUsuario(${u.id})">Remover</button> <button class="btn-editar" onclick="abrirModalEditar(${u.id})">Editar</button></td></tr>`; });
}

function excluirUsuario(id) {
    const ativo = localStorage.getItem('usuarioNome');
    const lista = JSON.parse(localStorage.getItem('usuarios')) || [];
    const u = lista.find(x => Number(x.id)===Number(id));
    if (u && u.usuario===ativo) { alert('Você não pode excluir um usuário ativo!'); return; }
    if (confirm('Remover este usuário?')) {
        const uDel=(JSON.parse(localStorage.getItem('usuarios'))||[]).find(x=>Number(x.id)===Number(id));
        localStorage.setItem('usuarios', JSON.stringify(lista.filter(x=>x.id!==id)));
        registrarAcao('Usuários', `Excluiu usuário: ${uDel?uDel.usuario:id}`);
        listarUsuarios();
    }
}

function abrirPopupNovoUsuario() {
    const p = document.getElementById('popup-novo-usuario');
    if (p) p.showModal();
}

function salvarAlteracoes() {
    const oldId=localStorage.getItem('usuarioId');
    const nome=document.getElementById('username-edit').value;
    const cat=document.getElementById('usuarioCat-edit').value;
    const s1=document.getElementById('pwd1-edit').value;
    const s2=document.getElementById('pwd2-edit').value;
    const novoIdRaw = document.getElementById('userId-edit') ? document.getElementById('userId-edit').value.trim() : '';
    let novoId;
    if (novoIdRaw !== '') {
        const parsed = parseInt(novoIdRaw, 10);
        if (isNaN(parsed) || parsed < 1) { alert('❌ O ID deve ser um número inteiro positivo.'); return; }
        novoId = parsed;
    } else {
        novoId = Number(oldId);
    }
    if (s1 && s1!==s2) { alert('Senhas não coincidem.'); return; }
    if (!nome) { alert('Nome não pode estar vazio.'); return; }
    let lista = JSON.parse(localStorage.getItem('usuarios')) || [];
    // Check if new ID conflicts with another user
    if (String(novoId) !== String(oldId) && lista.find(u => String(u.id) === String(novoId))) {
        alert(`❌ O ID "${novoId}" já está em uso por outro usuário.`); return;
    }
    lista = lista.map(u => Number(u.id)===Number(oldId) ? {...u, id:novoId, usuario:nome, categoria:cat, senha:s1||u.senha} : u);
    localStorage.setItem('usuarios',JSON.stringify(lista));
    document.getElementById('meuPopup').close();
    registrarAcao('Usuários', `Editou usuário: ${nome}`);
    listarUsuarios(); alert('Usuário atualizado!');
}

function abrirModalEditar(id) {
    localStorage.setItem('usuarioId',id);
    const u=(JSON.parse(localStorage.getItem('usuarios'))||[]).find(x=>Number(x.id)===Number(id));
    if(u){
        document.getElementById('user').innerText=u.usuario;
        document.getElementById('userId-edit').value=u.id;
        document.getElementById('username-edit').value=u.usuario;
        document.getElementById('usuarioCat-edit').value=u.categoria;
        document.getElementById('meuPopup').showModal();
    }
}

document.addEventListener('click',e=>{const p=document.getElementById('meuPopup');if(p&&e.target===p)p.close();});

/* ---- MÁQUINAS ---- */
function abrirPopupNovaMaquina() {
    const p = document.getElementById('popup-nova-maquina');
    if (p) p.showModal();
}

function CadastrarMaquina() {
    const maquina=document.getElementById('name').value, cat=document.getElementById('Cat').value;
    if(!maquina||!cat){alert('⚠️ Preencha todos os campos!');return;}
    let lista=JSON.parse(localStorage.getItem('maquinas'))||[];
    lista.push({id:lista.length>0?lista[lista.length-1].id+1:1,maquina,categoria:cat});
    localStorage.setItem('maquinas',JSON.stringify(lista));
    alert(`✅ ${maquina} cadastrada!`);
    registrarAcao('Máquinas', `Cadastrou máquina: ${maquina}`);
    document.getElementById('name').value='';
    document.getElementById('Cat').value='';
    document.getElementById('popup-nova-maquina').close();
    listarMaquinas();
}

function listarMaquinas() {
    const corpo=document.getElementById('tabela-corpo');
    const lista=JSON.parse(localStorage.getItem('maquinas'))||[];
    corpo.innerHTML='';
    lista.forEach(m=>{corpo.innerHTML+=`<tr><td>${m.id}</td><td>${m.maquina}</td><td><span class="badge">${m.categoria}</span></td><td><button class="btn-excluir" onclick="excluirMaquina(${m.id})">Remover</button> <button class="btn-editar" onclick="abrirModalEditarMaq(${m.id})">Editar</button></td></tr>`;});
}

function excluirMaquina(id) {
    if(confirm('Remover esta máquina?')){
        const mDel=(JSON.parse(localStorage.getItem('maquinas'))||[]).find(x=>Number(x.id)===Number(id));
        localStorage.setItem('maquinas',JSON.stringify((JSON.parse(localStorage.getItem('maquinas'))||[]).filter(u=>u.id!==id)));
        registrarAcao('Máquinas', `Excluiu máquina: ${mDel?mDel.maquina:id}`);
        listarMaquinas();
    }
}

function salvarAlteracoesMaq() {
    const id=localStorage.getItem('maquinaId');
    const nome=document.getElementById('nameMaq').value;
    const cat=document.getElementById('CatMaq2').value;
    let lista=(JSON.parse(localStorage.getItem('maquinas'))||[]).map(i=>Number(i.id)===Number(id)?{id:i.id,maquina:nome,categoria:cat}:i);
    localStorage.setItem('maquinas',JSON.stringify(lista));
    document.getElementById('meuPopupMaquina').close(); registrarAcao('Máquinas', `Editou máquina: ${nome}`); listarMaquinas(); alert('✅ Máquina atualizada!');
}

function abrirModalEditarMaq(id) {
    localStorage.setItem('maquinaId',id);
    const m=(JSON.parse(localStorage.getItem('maquinas'))||[]).find(x=>Number(x.id)===Number(id));
    if(m){document.getElementById('nameMaq').value=m.maquina;document.getElementById('CatMaq2').value=m.categoria;document.getElementById('meuPopupMaquina').showModal();}
    else alert('Máquina não encontrada');
}

document.addEventListener('click',e=>{const p=document.getElementById('meuPopupMaquina');if(p&&e.target===p)p.close();});

/* ---- PEDIDOS ---- */
function CadastrarPedido() {
    const nomeProduto=document.getElementById('nomeProduto').value, numeroPedido=document.getElementById('numeroPedido').value;
    const CatMaterial=document.getElementById('CatMaterial').value, valorTotal=document.getElementById('valorTotal').value;
    const tempoFabricacao=document.getElementById('tempoFabricacao').value, CatUrgencia=document.getElementById('CatUrgencia').value, CatMaq=document.getElementById('CatMaq').value;
    if(!nomeProduto||!numeroPedido||!CatMaterial||!valorTotal||!tempoFabricacao||!CatUrgencia||!CatMaq){alert('⚠️ Preencha todos os campos!');return;}
    let lista=JSON.parse(localStorage.getItem('pedidos'))||[], hist=JSON.parse(localStorage.getItem('historicopedidos'))||[];
    const id=lista.length>0?lista[lista.length-1].id+1:1;
    const lembrar = document.getElementById('lembrarPreenchimento') && document.getElementById('lembrarPreenchimento').checked;
    // Captura imagem se houver (novo arquivo ou base64 já carregado de salvo)
    const imgInput = document.getElementById('imagemPedido');
    const imgFile = imgInput && imgInput.files && imgInput.files[0];
    const imgPreview = document.getElementById('preview-img');
    const savedBase64 = imgPreview && imgPreview.dataset.savedBase64 ? imgPreview.dataset.savedBase64 : null;
    function salvarComImagem(imagemBase64) {
        const novo={id,nomeProduto,numeroPedido,CatMaterial,valorTotal,tempoFabricacao,CatUrgencia,CatMaq,imagemPedido:imagemBase64||null};
        lista.push(novo); localStorage.setItem('pedidos',JSON.stringify(lista));
        hist.push({...novo,id:hist.length>0?hist[hist.length-1].id+1:1}); localStorage.setItem('historicopedidos',JSON.stringify(hist));
        // Salvar preenchimento se checkbox marcado
        if (lembrar) {
            let salvos = JSON.parse(localStorage.getItem('pedidosSalvos')) || [];
            // Atualiza se já existe com mesmo nome, senão adiciona
            const idx = salvos.findIndex(s => s.nomeProduto === nomeProduto);
            const entrada = {nomeProduto,numeroPedido,CatMaterial,valorTotal,tempoFabricacao,CatUrgencia,CatMaq,imagemPedido:imagemBase64||null};
            if (idx >= 0) salvos[idx] = entrada; else salvos.push(entrada);
            localStorage.setItem('pedidosSalvos', JSON.stringify(salvos));
        }
        alert(`✅ Pedido ${numeroPedido} cadastrado!`);
        registrarAcao('Pedidos', `Cadastrou pedido: ${numeroPedido}`);
        const prev=document.getElementById('preview-imagem'); if(prev) prev.style.display='none';
        if(imgPreview) { imgPreview.src=''; delete imgPreview.dataset.savedBase64; }
        const popup = document.getElementById('popup-novo-pedido');
        if (popup) popup.close();
        listarPedidos();
    }
    if(imgFile){
        const reader=new FileReader();
        reader.onload=ev=>salvarComImagem(ev.target.result);
        reader.readAsDataURL(imgFile);
    } else if (savedBase64) {
        salvarComImagem(savedBase64);
    } else { salvarComImagem(null); }
}

function filtrarTabelaPedidos(filtro) {
    listarPedidos(filtro);
}

function listarPedidos(filtro) {
    const corpo=document.getElementById('tabela-corpo');
    let lista=JSON.parse(localStorage.getItem('pedidos'))||[];
    corpo.innerHTML='';
    if(filtro){const f=filtro.toLowerCase();lista=lista.filter(p=>String(p.id).includes(f)||(p.nomeProduto||'').toLowerCase().includes(f)||(p.numeroPedido||'').toLowerCase().includes(f)||(p.CatMaterial||'').toLowerCase().includes(f)||(p.CatUrgencia||'').toLowerCase().includes(f)||(p.CatMaq||'').toLowerCase().includes(f));}
    const cb={Normal:'badgeNormal',Média:'badgeMedia',Alta:'badgeAlta',Critica:'badgeCritica'};
    lista.forEach(p=>{const badge=cb[p.CatUrgencia]||'badgeNormal';corpo.innerHTML+=`<tr><td>${p.id}</td><td>${p.nomeProduto}</td><td>${p.numeroPedido}</td><td>${p.CatMaterial}</td><td>${p.valorTotal}</td><td>${p.tempoFabricacao}</td><td><span class="${badge}">${p.CatUrgencia}</span></td><td>${p.CatMaq}</td><td><button class="btn-excluir" onclick="excluirPedido(${p.id})">Remover</button> <button class="btn-editar" onclick="abrirModalEditarPedido(${p.id})">Editar</button></td></tr>`;});
}

function excluirPedido(id) {
    if(confirm('Remover este pedido?')){
        const pDel=(JSON.parse(localStorage.getItem('pedidos'))||[]).find(x=>Number(x.id)===Number(id));
        localStorage.setItem('pedidos',JSON.stringify((JSON.parse(localStorage.getItem('pedidos'))||[]).filter(u=>u.id!==id)));
        registrarAcao('Pedidos', `Excluiu pedido: ${pDel?pDel.numeroPedido:id}`);
        listarPedidos();
    }
}

function salvarAlteracoesPedido() {
    const id=localStorage.getItem('pedidoId');
    const nomeProduto=document.getElementById('nomeProduto-edit').value, numeroPedido=document.getElementById('numeroPedido-edit').value;
    const CatMaterial=document.getElementById('CatMaterial-edit').value, valorTotal=document.getElementById('valorTotal-edit').value;
    const tempoFabricacao=document.getElementById('tempoFabricacao-edit').value, CatUrgencia=document.getElementById('CatUrgencia-edit').value, CatMaq=document.getElementById('CatMaq-edit').value;
    const imgEditInput = document.getElementById('imagemPedido-edit');
    const imgEditFile = imgEditInput && imgEditInput.files && imgEditInput.files[0];
    const imgEditPreview = document.getElementById('preview-img-edit');
    const imgRemoved = imgEditPreview && imgEditPreview.dataset.removed === 'true';
    function finalizarSalvar(novaImagem) {
        let lista=(JSON.parse(localStorage.getItem('pedidos'))||[]).map(i=>{
            if(Number(i.id)===Number(id)){
                const atualizado={...i,nomeProduto,numeroPedido,CatMaterial,valorTotal,tempoFabricacao,CatUrgencia,CatMaq};
                if(novaImagem !== undefined) atualizado.imagemPedido = novaImagem;
                return atualizado;
            }
            return i;
        });
        localStorage.setItem('pedidos',JSON.stringify(lista));
        if(imgEditPreview) delete imgEditPreview.dataset.removed;
        document.getElementById('meuPopupPedido').close();
        registrarAcao('Pedidos', `Editou pedido: ${numeroPedido}`);
        listarPedidos();
        alert('✅ Pedido atualizado!');
    }
    if(imgEditFile){
        const reader=new FileReader();
        reader.onload=ev=>finalizarSalvar(ev.target.result);
        reader.readAsDataURL(imgEditFile);
    } else if(imgRemoved){
        finalizarSalvar(null);
    } else {
        finalizarSalvar(undefined);
    }
}

function abrirPopupNovoPedido() {
    AtualizarMaquinasPedidos();
    // Reset form fields
    ['nomeProduto','numeroPedido','valorTotal','tempoFabricacao'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
    const selMat=document.getElementById('CatMaterial'); if(selMat) selMat.value='';
    const selUrg=document.getElementById('CatUrgencia'); if(selUrg) selUrg.value='';
    const cb=document.getElementById('lembrarPreenchimento'); if(cb) cb.checked=false;
    const prev=document.getElementById('preview-imagem'); if(prev) prev.style.display='none';
    const prevImg=document.getElementById('preview-img'); if(prevImg){prevImg.src=''; delete prevImg.dataset.savedBase64;}
    const imgInput=document.getElementById('imagemPedido'); if(imgInput) imgInput.value='';
    const dd=document.getElementById('dropdown-salvos'); if(dd) dd.style.display='none';
    const btnDd=document.getElementById('btn-dropdown-salvos'); if(btnDd) btnDd.textContent='▼';
    const p = document.getElementById('popup-novo-pedido');
    if (p) p.showModal();
}

function fecharPopupNovoPedido() {
    const p = document.getElementById('popup-novo-pedido');
    if (p) p.close();
}

function toggleDropdownSalvos() {
    const dd = document.getElementById('dropdown-salvos');
    const btn = document.getElementById('btn-dropdown-salvos');
    if (!dd) return;
    if (dd.style.display === 'none' || dd.style.display === '') {
        renderDropdownSalvos();
        dd.style.display = 'block';
        if (btn) btn.textContent = '▲';
    } else {
        dd.style.display = 'none';
        if (btn) btn.textContent = '▼';
    }
}

function renderDropdownSalvos() {
    const dd = document.getElementById('dropdown-salvos');
    if (!dd) return;
    const salvos = JSON.parse(localStorage.getItem('pedidosSalvos')) || [];
    if (salvos.length === 0) {
        dd.innerHTML = '<div style="padding:10px 14px;color:#888;font-size:13px;">Nenhum pedido salvo ainda</div>';
        return;
    }
    salvos.sort((a, b) => (a.nomeProduto||'').localeCompare(b.nomeProduto||'', 'pt-BR', {sensitivity:'base'}));
    dd.innerHTML = salvos.map((s, i) =>
        `<div onclick="preencherComSalvo(${i})" style="padding:10px 14px;cursor:pointer;border-bottom:1px solid rgba(128,128,128,0.2);font-size:14px;" onmouseover="this.style.background='rgba(99,102,241,0.12)'" onmouseout="this.style.background=''">${s.nomeProduto}</div>`
    ).join('');
}

function preencherComSalvo(idx) {
    const salvos = JSON.parse(localStorage.getItem('pedidosSalvos')) || [];
    salvos.sort((a, b) => (a.nomeProduto||'').localeCompare(b.nomeProduto||'', 'pt-BR', {sensitivity:'base'}));
    const s = salvos[idx];
    if (!s) return;
    const set = (id, val) => { const el = document.getElementById(id); if(el) el.value = val || ''; };
    set('nomeProduto', s.nomeProduto);
    set('numeroPedido', s.numeroPedido);
    set('valorTotal', s.valorTotal);
    set('tempoFabricacao', s.tempoFabricacao);
    if (s.CatMaterial) { const el=document.getElementById('CatMaterial'); if(el) el.value=s.CatMaterial; }
    if (s.CatUrgencia) { const el=document.getElementById('CatUrgencia'); if(el) el.value=s.CatUrgencia; }
    if (s.CatMaq) { const el=document.getElementById('CatMaq'); if(el) el.value=s.CatMaq; }
    const prevImg = document.getElementById('preview-img');
    const prevBox = document.getElementById('preview-imagem');
    if (s.imagemPedido && prevImg && prevBox) {
        prevImg.src = s.imagemPedido;
        prevImg.dataset.savedBase64 = s.imagemPedido;
        prevBox.style.display = 'flex';
    } else if (prevBox) {
        prevBox.style.display = 'none';
        if (prevImg) { prevImg.src = ''; delete prevImg.dataset.savedBase64; }
    }
    const dd = document.getElementById('dropdown-salvos');
    if (dd) dd.style.display = 'none';
    const btn = document.getElementById('btn-dropdown-salvos');
    if (btn) btn.textContent = '▼';
}

function AtualizarMaquinasPedidosEdit() {
    const sel = document.getElementById('CatMaq-edit');
    if (!sel) return;
    const lista = JSON.parse(localStorage.getItem('maquinas')) || [];
    sel.innerHTML = '<option value="" disabled>Selecione uma máquina...</option>';
    lista.forEach(m => { sel.innerHTML += `<option value="${m.maquina}">${m.maquina}</option>`; });
}

function abrirModalEditarPedido(id) {
    localStorage.setItem('pedidoId',id);
    AtualizarMaquinasPedidosEdit();
    const p=(JSON.parse(localStorage.getItem('pedidos'))||[]).find(x=>Number(x.id)===Number(id));
    if(p){
        document.getElementById('nomeProduto-edit').value=p.nomeProduto;
        document.getElementById('numeroPedido-edit').value=p.numeroPedido;
        document.getElementById('CatMaterial-edit').value=p.CatMaterial;
        document.getElementById('valorTotal-edit').value=p.valorTotal;
        document.getElementById('tempoFabricacao-edit').value=p.tempoFabricacao;
        document.getElementById('CatUrgencia-edit').value=p.CatUrgencia;
        document.getElementById('CatMaq-edit').value=p.CatMaq;
        // Reset campo de imagem
        const imgInput = document.getElementById('imagemPedido-edit');
        if(imgInput) imgInput.value = '';
        const prevEdit = document.getElementById('preview-imagem-edit');
        const prevImgEdit = document.getElementById('preview-img-edit');
        if(prevImgEdit) delete prevImgEdit.dataset.removed;
        if(p.imagemPedido && prevEdit && prevImgEdit){
            prevImgEdit.src = p.imagemPedido;
            prevEdit.style.display = 'flex';
        } else if(prevEdit){
            prevEdit.style.display = 'none';
            if(prevImgEdit) prevImgEdit.src = '';
        }
        document.getElementById('meuPopupPedido').showModal();
    } else alert('Pedido não encontrado');
}

document.addEventListener('click',e=>{const p=document.getElementById('meuPopupPedido');if(p&&e.target===p)p.close();});

// Fechar dropdown de salvos ao clicar fora
document.addEventListener('click', function(e) {
    const dd = document.getElementById('dropdown-salvos');
    const btn = document.getElementById('btn-dropdown-salvos');
    if (dd && dd.style.display !== 'none' && !dd.contains(e.target) && e.target !== btn) {
        dd.style.display = 'none';
        if (btn) btn.textContent = '▼';
    }
});

// Preview de imagem delegado (novo pedido e editar pedido)
document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'imagemPedido') {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = ev => {
                const img = document.getElementById('preview-img');
                const box = document.getElementById('preview-imagem');
                if (img) { img.src = ev.target.result; delete img.dataset.savedBase64; }
                if (box) box.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        }
    }
    if (e.target && e.target.id === 'imagemPedido-edit') {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = ev => {
                const img = document.getElementById('preview-img-edit');
                const box = document.getElementById('preview-imagem-edit');
                if (img) { img.src = ev.target.result; delete img.dataset.removed; }
                if (box) box.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        }
    }
});

function removerImagemPedido() {
    const input = document.getElementById('imagemPedido');
    const box = document.getElementById('preview-imagem');
    const img = document.getElementById('preview-img');
    if (input) input.value = '';
    if (box) box.style.display = 'none';
    if (img) { img.src = ''; delete img.dataset.savedBase64; }
}

function removerImagemPedidoEdit() {
    const input = document.getElementById('imagemPedido-edit');
    const box = document.getElementById('preview-imagem-edit');
    const img = document.getElementById('preview-img-edit');
    if (input) input.value = '';
    if (box) box.style.display = 'none';
    if (img) { img.src = ''; img.dataset.removed = 'true'; }
}

function ZerarMarcador() {
    if(confirm('Zerar contagem?')){ localStorage.setItem('Concluidos',0); atualizarHome(); }
}

function listarPedidosConcluidos() {
    const corpo=document.getElementById('tabela-corpo');
    const lista=JSON.parse(localStorage.getItem('pedidosConcluidos'))||[];
    corpo.innerHTML='';
    const cb={Prejuizo:'badgePrejuizo',Lucro:'badgeLucro'};
    lista.forEach(p=>{const badge=cb[p.resultadoFinal]||'badgePrejuizo';corpo.innerHTML+=`<tr><td>${p.id}</td><td>${p.nomeProduto}</td><td>${p.numeroPedido}</td><td>${p.catMaterial}</td><td>${p.valorTotal}</td><td>${p.tempoFabricacao}</td><td>${p.resultadoFinalMinutos}</td><td>${p.CatMaq}</td><td><span class="${badge}">${p.resultadoFinal}</span></td></tr>`;});
}

/* ---- LOGO ICON ---- */
function trocarIconeLogo() {
    document.getElementById('logo-file-input').click();
}
function carregarIconeLogo(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        const src = ev.target.result;
        document.getElementById('logo-icon').src = src;
        localStorage.setItem('logoIcone', src);
    };
    reader.readAsDataURL(file);
}
function restaurarLogoIcone() {
    const salvo = localStorage.getItem('logoIcone');
    if (salvo) document.getElementById('logo-icon').src = salvo;
}

/* ---- MENU SEARCH ---- */
function filtrarMenu(filtro) {
    const itens = document.querySelectorAll('#project-tree li.folder');
    const f = filtro.toLowerCase();
    itens.forEach(li => {
        const label = (li.getAttribute('data-label') || li.innerText || '').toLowerCase();
        li.style.display = (!f || label.includes(f)) ? '' : 'none';
    });
}

/* ---- GENERIC TABLE FILTER ---- */
function filtrarTabela(filtro, reloadFn) {
    // For simple cases: just call the list function then filter rows
    const f = filtro.toLowerCase();
    const linhas = document.querySelectorAll('#tabela-corpo tr');
    linhas.forEach(tr => {
        tr.style.display = (!f || tr.innerText.toLowerCase().includes(f)) ? '' : 'none';
    });
}

function filtrarTabelaDashboard(filtro) {
    filtrarTabela(filtro, listarPedidosConcluidos);
}

/* ---- GRÁFICO HOME ---- */
let graficoInstance = null;

function renderizarGrafico() {
    const canvas = document.getElementById('graficoProducao');
    const emptyMsg = document.getElementById('chart-empty-msg');
    if (!canvas) return; // não está na aba home

    const lista = JSON.parse(localStorage.getItem('pedidosConcluidos')) || [];

    if (lista.length === 0) {
        canvas.style.display = 'none';
        if (emptyMsg) emptyMsg.style.display = 'block';
        return;
    }

    canvas.style.display = 'block';
    if (emptyMsg) emptyMsg.style.display = 'none';

    // Gera labels: últimos 30 dias, hoje é o último
    const hoje = new Date();
    const labels = [];
    const contagens = {};
    for (let i = 29; i >= 0; i--) {
        const d = new Date(hoje);
        d.setDate(hoje.getDate() - i);
        const chave = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        labels.push(chave);
        contagens[chave] = 0;
    }

    // Conta pedidos concluídos por dia usando dataFinalizacao
    const hojeChave = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    lista.forEach(p => {
        let chave;
        if (p.dataFinalizacao) {
            chave = new Date(p.dataFinalizacao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        } else {
            // Sem data: conta como hoje
            chave = hojeChave;
        }
        if (contagens.hasOwnProperty(chave)) {
            contagens[chave]++;
        }
    });

    const dados = labels.map(l => contagens[l]);

    const body = document.body;
    const isDark  = body.classList.contains('modo-escuro') || body.classList.contains('tema-dark');
    const isSepia = body.classList.contains('modo-sepia')  || body.classList.contains('tema-sepia');
    const isVerde = body.classList.contains('tema-verde');

    const corTexto  = isDark ? '#9e9e9e' : (isSepia ? '#7a5c44' : (isVerde ? '#2e7d32' : '#64748b'));
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

    // Destrói instância anterior se existir
    if (graficoInstance) {
        graficoInstance.destroy();
        graficoInstance = null;
    }

    graficoInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Produções finalizadas',
                data: dados,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99,102,241,0.10)',
                pointBackgroundColor: dados.map(v => v > 0 ? '#6366f1' : 'transparent'),
                pointRadius: dados.map(v => v > 0 ? 5 : 0),
                fill: true,
                tension: 0.3,
                spanGaps: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: corTexto } },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ${ctx.parsed.y} pedido(s) finalizado(s)`
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: corTexto, maxTicksLimit: 10 },
                    grid:  { color: gridColor }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: corTexto, stepSize: 1, precision: 0 },
                    grid:  { color: gridColor }
                }
            }
        }
    });
}


/* ===== RELATÓRIOS / AUDIT LOG ===== */
function registrarAcao(aba, acao) {
    const usuario = localStorage.getItem('usuarioNome') || 'Desconhecido';
    const agora = new Date();
    const dataHora = agora.toLocaleDateString('pt-BR') + ' ' + agora.toLocaleTimeString('pt-BR');
    let log = JSON.parse(localStorage.getItem('logAcoes')) || [];
    log.push({ usuario, aba, acao, dataHora, ts: agora.getTime() });
    localStorage.setItem('logAcoes', JSON.stringify(log));
}

function listarRelatorios(filtro) {
    const corpo = document.getElementById('tabela-relatorios');
    if (!corpo) return;
    let log = JSON.parse(localStorage.getItem('logAcoes')) || [];
    // Decrescente: mais recente primeiro
    log = log.slice().reverse();
    if (filtro) {
        const f = filtro.toLowerCase();
        log = log.filter(r =>
            (r.usuario||'').toLowerCase().includes(f) ||
            (r.aba||'').toLowerCase().includes(f) ||
            (r.acao||'').toLowerCase().includes(f) ||
            (r.dataHora||'').toLowerCase().includes(f)
        );
    }
    corpo.innerHTML = '';
    if (log.length === 0) {
        corpo.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:24px;">Nenhuma ação registrada ainda.</td></tr>';
        return;
    }
    log.forEach((r, i) => {
        corpo.innerHTML += `<tr>
            <td>${i + 1}</td>
            <td>${r.usuario}</td>
            <td>${r.aba}</td>
            <td>${r.acao}</td>
            <td style="white-space:nowrap;">${r.dataHora}</td>
        </tr>`;
    });
}

function filtrarRelatorios(filtro) {
    listarRelatorios(filtro);
}
