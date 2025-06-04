function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function sortearEquipes() {
  const campos = document.querySelectorAll(".linha-nome-sexo");
  const forcarEquilibrio = document.getElementById("forcar-equilibrio").checked;

  const nomesMapeados = [];
  const nomesUnicos = new Set();

  campos.forEach(campo => {
    const nome = campo.querySelector("input").value.trim();
    const sexo = campo.querySelector("select").value;
    const nomeNormalizado = removerAcentos(nome.toLowerCase());

    if (nome && !nomesUnicos.has(nomeNormalizado)) {
      nomesUnicos.add(nomeNormalizado);
      nomesMapeados.push({ nome, sexo });
    }
  });

  if (nomesMapeados.length % 4 !== 0 || nomesMapeados.length < 4) {
    alert("O número de participantes deve ser múltiplo de 4 e no mínimo 4.");
    return;
  }

  const mulheres = nomesMapeados.filter(p => p.sexo === "F");
  const homens = nomesMapeados.filter(p => p.sexo === "M");
  const semGenero = nomesMapeados.filter(p => p.sexo === "");

  const total = nomesMapeados.length;
  const numEquipes = Math.floor(total / 4);
  const equipes = Array.from({ length: numEquipes }, () => []);

  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";

  embaralhar(mulheres);
  embaralhar(homens);
  embaralhar(semGenero);

  // Etapa 1: Distribuir mulheres
  if (forcarEquilibrio && mulheres.length >= numEquipes) {
    for (let i = 0; i < numEquipes; i++) {
      equipes[i].push(mulheres[i]);
    }
    // Adiciona mulheres restantes
    for (let i = numEquipes; i < mulheres.length; i++) {
      equipes[i % numEquipes].push(mulheres[i]);
    }
  } else {
    // Balanceamento apenas
    for (let i = 0; i < mulheres.length; i++) {
      equipes[i % numEquipes].push(mulheres[i]);
    }
  }

  // Etapa 2: Adicionar homens e sem gênero
  const restantes = [...homens, ...semGenero];
  embaralhar(restantes);

  let equipeIndex = 0;
  for (const participante of restantes) {
    while (equipes[equipeIndex].length >= 4) {
      equipeIndex = (equipeIndex + 1) % numEquipes;
    }
    equipes[equipeIndex].push(participante);
    equipeIndex = (equipeIndex + 1) % numEquipes;
  }

  // Exibir resultado
  for (let i = 0; i < numEquipes; i++) {
    const divEquipe = document.createElement("div");
    divEquipe.className = "equipe";
    const nomesEquipe = equipes[i].map(p => p.nome).join(", ");
    divEquipe.innerHTML = `<strong>Equipe ${i + 1}:</strong> ${nomesEquipe}`;
    resultado.appendChild(divEquipe);
  }
}

function gerarCampos() {
  const qtd = parseInt(document.getElementById("quantidade").value);
  const container = document.getElementById("campos-nomes");
  container.innerHTML = "";

  for (let i = 0; i < qtd; i++) {
    const div = document.createElement("div");
    div.className = "linha-nome-sexo";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Jogador(a) ${i + 1}`;

    const select = document.createElement("select");
    const op1 = new Option("Sexo", "");
    const op2 = new Option("Feminino", "F");
    const op3 = new Option("Masculino", "M");
    select.append(op1, op2, op3);

    div.append(input, select);
    container.appendChild(div);
  }
}
