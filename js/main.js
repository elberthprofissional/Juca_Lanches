// Tabela de Preços Atualizada
const tabelaPrecos = {
    'Hambúrguer Simples': 18.00,
    'Hambúrguer Melhor': 19.50,
    'Hambúrguer Chefe': 21.50,
    'Juquinha Burguer': 25.50,
    'Cachorro Quente Simples': 12.00,
    'Cachorro Quente Top': 14.00,
    'Carne (Bife)': 3.00,
    'Ovo': 3.00,
    'Bacon': 3.00,
    'Presunto': 3.00,
    'Mussarela': 3.00,
    'Cheddar': 3.00,
    'Molho Verde': 1.50,
    'Água s/gás': 3.00,
    'Água c/gás': 3.50,
    'Refri 200ml': 3.00,
    'Refri lata': 6.00,
    'Refri 600ml': 7.00,
    'Coca 600ml': 8.00,
    'Mate couro e guaraná 1 litro': 9.00,
    'Mate couro e kuat 2 litros': 12.00,
    'Pepsi, guarapan, guaraná e Fanta 2 litros': 14.00,
    'Coca cola 2 litros': 16.00,
    'Suco lata': 6.00,
    'Suco 450ml': 6.50,
    'Suco 1 litro': 8.00,
    'Gatorade': 7.50
};

// Lógica de Carrinho (Array de Itens)
let carrinho = [];

// Item temporário enquanto o usuário seleciona os acréscimos
let itemSendoMontado = {
    lanche: '',
    acrescimos: [],
    bebidas: []
};

// Dados globais do pedido (Endereço e Pagamento)
let tipoEntrega = 'Entrega'; 

// ==========================================
// FUNÇÕES DO MODAL CUSTOMIZADO
// ==========================================

function mostrarAlerta(mensagem) {
    const modal = document.getElementById('custom-alert');
    const mensagemEl = document.getElementById('custom-alert-message');
    const box = document.getElementById('custom-alert-box');

    mensagemEl.innerText = mensagem;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    setTimeout(() => {
        modal.classList.remove('opacity-0');
        box.classList.remove('scale-95');
        box.classList.add('scale-100');
    }, 10);
}

function fecharAlerta() {
    const modal = document.getElementById('custom-alert');
    const box = document.getElementById('custom-alert-box');

    modal.classList.add('opacity-0');
    box.classList.remove('scale-100');
    box.classList.add('scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300); 
}

// ==========================================
// VALIDAÇÃO INLINE DE FORMULÁRIO
// ==========================================

function limparErros() {
    const campos = ['nome', 'rua', 'numero', 'bairro'];
    campos.forEach(campo => {
        const input = document.getElementById(`input-${campo}`);
        const erro = document.getElementById(`erro-${campo}`);
        if(input) {
            input.classList.remove('border-red-500');
            if(!input.classList.contains('border-white/10')) input.classList.add('border-white/10');
        }
        if(erro) erro.classList.add('hidden');
    });
}

function mostrarErro(campo, mensagem) {
    const input = document.getElementById(`input-${campo}`);
    const erro = document.getElementById(`erro-${campo}`);
    if(input) {
        input.classList.remove('border-white/10');
        input.classList.add('border-red-500');
    }
    if(erro) {
        if(mensagem) erro.innerText = mensagem;
        erro.classList.remove('hidden');
    }
}

// ==========================================
// FUNÇÕES DO CARRINHO
// ==========================================

function iniciarPedido(nomeLanche) {
    itemSendoMontado = {
        lanche: nomeLanche,
        acrescimos: [],
        bebidas: []
    };
    
    document.getElementById('nome-lanche-display').innerText = nomeLanche;
    
    document.querySelectorAll('.bebida-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('.acrescimo-checkbox').forEach(cb => cb.checked = false);
    
    abrirGaveta();
    mostrarTelaAcompanhamentos();
}

function adicionarAoCarrinho() {
    const bebidasCheckboxes = document.querySelectorAll('.bebida-checkbox:checked');
    const acrescimosCheckboxes = document.querySelectorAll('.acrescimo-checkbox:checked');
    
    itemSendoMontado.bebidas = Array.from(bebidasCheckboxes).map(cb => cb.value);
    itemSendoMontado.acrescimos = Array.from(acrescimosCheckboxes).map(cb => cb.value);
    
    let valorItem = tabelaPrecos[itemSendoMontado.lanche] || 0;
    itemSendoMontado.acrescimos.forEach(item => valorItem += tabelaPrecos[item] || 0);
    itemSendoMontado.bebidas.forEach(item => valorItem += tabelaPrecos[item] || 0);
    
    itemSendoMontado.valorTotal = valorItem;

    carrinho.push(JSON.parse(JSON.stringify(itemSendoMontado))); 
    
    atualizarBotaoFlutuante();
    mostrarTelaCarrinho();
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarBotaoFlutuante();
    if(carrinho.length === 0) {
        fecharGaveta();
    } else {
        mostrarTelaCarrinho(); 
    }
}

function calcularTotalGeral() {
    return carrinho.reduce((total, item) => total + item.valorTotal, 0);
}

function atualizarBotaoFlutuante() {
    const btnFlutuante = document.getElementById('btn-floating-cart');
    const contador = document.getElementById('floating-cart-count');
    const totalTexto = document.getElementById('floating-cart-total');

    if (carrinho.length > 0) {
        btnFlutuante.classList.remove('hidden');
        contador.innerText = carrinho.length;
        const total = calcularTotalGeral();
        totalTexto.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } else {
        btnFlutuante.classList.add('hidden');
    }
}

function renderizarListaCarrinho() {
    const listaContainer = document.getElementById('lista-carrinho');
    listaContainer.innerHTML = '';

    carrinho.forEach((item, index) => {
        let detalhes = '';
        if(item.acrescimos.length > 0) detalhes += `<p class="text-xs text-gray-400">+ ${item.acrescimos.join(', ')}</p>`;
        if(item.bebidas.length > 0) detalhes += `<p class="text-xs text-premium-gold">+ ${item.bebidas.join(', ')}</p>`;

        const valorFormatado = item.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        listaContainer.innerHTML += `
            <div class="bg-[#111] border border-white/5 p-4 rounded relative pr-12">
                <div class="flex justify-between items-start mb-1">
                    <h4 class="text-white font-serif text-lg">${item.lanche}</h4>
                    <span class="text-premium-gold font-bold shrink-0 ml-4">${valorFormatado}</span>
                </div>
                ${detalhes}
                <button onclick="removerDoCarrinho(${index})" class="absolute top-4 right-3 text-gray-500 hover:text-red-500 transition" title="Remover item">
                    <i class="ph-bold ph-trash text-xl"></i>
                </button>
            </div>
        `;
    });

    const total = calcularTotalGeral();
    document.getElementById('carrinho-subtotal-texto').innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ==========================================
// GESTÃO DE TELAS (GAVETA)
// ==========================================

function abrirGaveta() {
    const overlay = document.getElementById('checkout-overlay');
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.remove('opacity-0'), 10);

    const drawer = document.getElementById('checkout-drawer');
    drawer.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
}

function fecharGaveta() {
    const drawer = document.getElementById('checkout-drawer');
    drawer.classList.add('translate-x-full');
    
    const overlay = document.getElementById('checkout-overlay');
    overlay.classList.add('opacity-0');
    setTimeout(() => overlay.classList.add('hidden'), 300); 
    
    document.body.style.overflow = 'auto'; 
}

function esconderTodasTelas() {
    document.getElementById('step-acompanhamentos').classList.add('hidden');
    document.getElementById('footer-acompanhamentos').classList.add('hidden');
    
    document.getElementById('step-carrinho').classList.add('hidden');
    document.getElementById('footer-carrinho').classList.add('hidden');
    
    document.getElementById('step-endereco').classList.add('hidden');
    document.getElementById('footer-endereco').classList.add('hidden');
}

function mostrarTelaAcompanhamentos() {
    esconderTodasTelas();
    document.getElementById('drawer-title').innerText = "Personalizar";
    document.getElementById('step-acompanhamentos').classList.remove('hidden');
    document.getElementById('footer-acompanhamentos').classList.remove('hidden');
}

function mostrarTelaCarrinho() {
    if(carrinho.length === 0) {
        mostrarAlerta("Poxa, seu carrinho está vazio! Escolha algo do cardápio.");
        return fecharGaveta();
    }
    
    abrirGaveta();
    renderizarListaCarrinho();
    esconderTodasTelas();
    
    document.getElementById('drawer-title').innerText = "Seu Carrinho";
    document.getElementById('step-carrinho').classList.remove('hidden');
    document.getElementById('footer-carrinho').classList.remove('hidden');
}

function avancarParaEndereco() {
    esconderTodasTelas();
    carregarDadosSalvos();
    setTipoEntrega(tipoEntrega);
    
    document.getElementById('drawer-title').innerText = "Finalizar";
    document.getElementById('step-endereco').classList.remove('hidden');
    document.getElementById('footer-endereco').classList.remove('hidden');

    const total = calcularTotalGeral();
    const btnFinalizar = document.querySelector('#footer-endereco button:last-child');
    if (btnFinalizar) {
        btnFinalizar.innerHTML = `<i class="ph-light ph-whatsapp text-lg"></i> Finalizar (${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`;
    }
}

// ==========================================
// PAGAMENTO, ENDEREÇO E MEMÓRIA
// ==========================================

function toggleTroco() {
    const pagamento = document.getElementById('input-pagamento').value;
    const divTroco = document.getElementById('div-troco');
    if (pagamento === 'Dinheiro') {
        divTroco.classList.remove('hidden');
    } else {
        divTroco.classList.add('hidden');
        document.getElementById('input-troco').value = '';
    }
}

function carregarDadosSalvos() {
    const dadosSalvos = localStorage.getItem('juquinha_dados_cliente');
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        if(dados.nome) document.getElementById('input-nome').value = dados.nome;
        if(dados.pagamento) {
            document.getElementById('input-pagamento').value = dados.pagamento;
            toggleTroco();
        }
        if(dados.cep) document.getElementById('input-cep').value = dados.cep;
        if(dados.rua) document.getElementById('input-rua').value = dados.rua;
        if(dados.numero) document.getElementById('input-numero').value = dados.numero;
        if(dados.bairro) document.getElementById('input-bairro').value = dados.bairro;
        if(dados.referencia) document.getElementById('input-referencia').value = dados.referencia;
    }
}

function guardarDadosCliente(nome, pagamento, cep, rua, numero, bairro, referencia) {
    const dados = { nome, pagamento, cep, rua, numero, bairro, referencia };
    localStorage.setItem('juquinha_dados_cliente', JSON.stringify(dados));
}

function setTipoEntrega(tipo) {
    tipoEntrega = tipo;
    const btnEntrega = document.getElementById('btn-entrega');
    const btnRetirada = document.getElementById('btn-retirada');
    const blocoEndereco = document.getElementById('bloco-endereco');

    if (tipo === 'Entrega') {
        btnEntrega.className = "flex-1 py-2 text-xs font-semibold tracking-widest uppercase bg-premium-gold text-black rounded transition";
        btnRetirada.className = "flex-1 py-2 text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-white rounded transition";
        blocoEndereco.classList.remove('hidden');
    } else {
        btnRetirada.className = "flex-1 py-2 text-xs font-semibold tracking-widest uppercase bg-premium-gold text-black rounded transition";
        btnEntrega.className = "flex-1 py-2 text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-white rounded transition";
        blocoEndereco.classList.add('hidden');
    }
}

async function buscarCEP() {
    const cepInput = document.getElementById('input-cep');
    let cep = cepInput.value.replace(/\D/g, ''); 
    if (cep.length === 8) {
        try {
            let response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            let data = await response.json();
            if (!data.erro) {
                document.getElementById('input-rua').value = data.logradouro;
                document.getElementById('input-bairro').value = data.bairro;
                document.getElementById('input-numero').focus(); 
            }
        } catch (error) {
            console.log("Erro ao buscar CEP:", error);
        }
    }
}

// ==========================================
// FINALIZAR E ENVIAR PARA O WHATSAPP
// ==========================================

function finalizarPedido() {
    if(carrinho.length === 0) {
        mostrarAlerta("Poxa, seu carrinho está vazio! Escolha algo do cardápio.");
        return;
    }

    limparErros();
    let temErro = false;

    const nome = document.getElementById('input-nome').value.trim();
    const pagamento = document.getElementById('input-pagamento').value;
    const troco = document.getElementById('input-troco').value.trim();
    
    const cep = document.getElementById('input-cep').value.trim();
    const rua = document.getElementById('input-rua').value.trim();
    const numero = document.getElementById('input-numero').value.trim();
    const bairro = document.getElementById('input-bairro').value.trim();
    const referencia = document.getElementById('input-referencia').value.trim();

    if(!nome) {
        mostrarErro('nome', 'Por favor, informe como devemos te chamar.');
        temErro = true;
    }

    if(tipoEntrega === 'Entrega') {
        if(!rua) {
            mostrarErro('rua', 'Por favor, informe a rua para a entrega.');
            temErro = true;
        }
        if(!numero) {
            mostrarErro('numero', 'Informe o Numero.');
            temErro = true;
        }
        if(!bairro) {
            mostrarErro('bairro', 'Informe o seu bairro.');
            temErro = true;
        }
    }

    if(temErro) return;

    guardarDadosCliente(nome, pagamento, cep, rua, numero, bairro, referencia);

    const numeroWhatsapp = "5531988866455"; 
    
    const totalGeral = calcularTotalGeral();
    const totalFormatado = totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    let mensagem = `*🍔 NOVO PEDIDO - JUCA LANCHES*\n`;
    mensagem += `-----------------------------------\n`;
    mensagem += `👤 *Cliente:* ${nome}\n`;
    mensagem += `🛵 *Modo:* ${tipoEntrega}\n\n`;

    mensagem += `*📝 ITENS DO PEDIDO*\n`;
    
    carrinho.forEach((item) => {
        mensagem += `\n▶ *1x ${item.lanche}*`;
        if(item.acrescimos.length > 0) mensagem += `\n➕ Acréscimos: ${item.acrescimos.join(', ')}`;
        if(item.bebidas.length > 0) mensagem += `\n🥤 Bebidas: ${item.bebidas.join(', ')}`;
        mensagem += `\n💵 Subtotal do item: ${item.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
    });

    mensagem += `\n*💰 RESUMO DO VALOR*\n`;
    mensagem += `Total dos itens: ${totalFormatado}\n`;
    if (tipoEntrega === 'Entrega') {
        mensagem += `🛵 *Taxa de Entrega:* (A calcular pelo endereço)\n`;
    }

    mensagem += `\n*💳 PAGAMENTO*\n`;
    mensagem += `Forma: ${pagamento}\n`;
    if (pagamento === 'Dinheiro' && troco) {
        mensagem += `💵 *Troco para:* R$ ${troco}\n`;
    }

    if (tipoEntrega === 'Entrega') {
        mensagem += `\n*📍 ENDEREÇO DE ENTREGA*\n`;
        mensagem += `${rua}, Nº ${numero}\n`;
        mensagem += `Bairro: ${bairro}\n`;
        if (referencia) mensagem += `Ref: ${referencia}\n`;
        
        const queryMaps = encodeURIComponent(`${rua}, ${numero} - ${bairro}, Belo Horizonte`);
        mensagem += `🗺️ *Abrir no GPS:* https://www.google.com/maps/search/?api=1&query=${queryMaps}\n`;
        
        mensagem += `-----------------------------------\n`;
        mensagem += `⚠️ *Aguardo a confirmação do pedido e o valor da taxa de entrega!*`;
    } else {
        mensagem += `-----------------------------------\n`;
        mensagem += `✅ *Irei retirar no local. Aguardo a confirmação do pedido!*`;
    }

    const url = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
    
    carrinho = [];
    atualizarBotaoFlutuante();
    fecharGaveta();
    
    window.open(url, '_blank');
}

// ==========================================
// EFEITOS VISUAIS E STATUS
// ==========================================

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg', 'shadow-black/50');
    } else {
        navbar.classList.remove('shadow-lg', 'shadow-black/50');
    }
});

function verificarStatusLoja() {
    const agora = new Date();
    const diaSemana = agora.getDay(); 
    const hora = agora.getHours();
    const minutos = agora.getMinutes();
    
    const horaAtualDecimal = hora + (minutos / 60);
    let lojaAberta = false;
    let textoAbertura = "";

    if (diaSemana >= 2 && diaSemana <= 5) {
        if (horaAtualDecimal >= 19.5 && horaAtualDecimal < 23.5) lojaAberta = true;
        else if (horaAtualDecimal < 19.5) textoAbertura = "Abre hoje às 19:30h";
        else textoAbertura = diaSemana === 5 ? "Abre amanhã às 19:00h" : "Abre amanhã às 19:30h";
    } else if (diaSemana === 6) {
        if (horaAtualDecimal >= 19.0 && horaAtualDecimal < 23.5) lojaAberta = true;
        else if (horaAtualDecimal < 19.0) textoAbertura = "Abre hoje às 19:00h";
        else textoAbertura = "Abre amanhã às 19:00h";
    } else if (diaSemana === 0) {
        if (horaAtualDecimal >= 19.0 && horaAtualDecimal < 23.5) lojaAberta = true;
        else if (horaAtualDecimal < 19.0) textoAbertura = "Abre hoje às 19:00h";
        else textoAbertura = "Abre terça-feira às 19:30h";
    } else if (diaSemana === 1) {
        textoAbertura = "Abre amanhã às 19:30h";
    }

    const statusDiv = document.getElementById('status-loja');
    if (statusDiv) {
        if (lojaAberta) {
            statusDiv.innerHTML = `<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs tracking-widest uppercase font-semibold shadow-[0_0_15px_rgba(34,197,94,0.15)]"><span class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span> Aberto Agora</span>`;
        } else {
            statusDiv.innerHTML = `<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs tracking-widest uppercase font-semibold"><span class="w-2.5 h-2.5 rounded-full bg-red-500"></span> Fechado • ${textoAbertura}</span>`;
        }
    }
}

// Remove os avisos de erro instantaneamente quando o cliente começa a digitar e checa a loja
window.addEventListener('DOMContentLoaded', () => {
    const campos = ['nome', 'rua', 'numero', 'bairro'];
    campos.forEach(campo => {
        const input = document.getElementById(`input-${campo}`);
        if (input) {
            input.addEventListener('input', () => {
                input.classList.remove('border-red-500');
                if(!input.classList.contains('border-white/10')) input.classList.add('border-white/10');
                
                const erro = document.getElementById(`erro-${campo}`);
                if (erro) erro.classList.add('hidden');
            });
        }
    });
    
    verificarStatusLoja();
    setInterval(verificarStatusLoja, 60000);
});
