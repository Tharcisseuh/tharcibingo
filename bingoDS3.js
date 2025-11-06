    const urlParams = new URLSearchParams(window.location.search);
    const viewer = urlParams.get('user') || 'inconnu';
    document.getElementById("viewer-name").innerText = viewer;

    const prompts = [
      "Rencontre avec un mimic",
      "Se faire bouffer par un mimic",
      "Chute fatale",
      "Pousser un ennemi dans le vide",
      "Boss 1st try !",
      "Backstab (faire/recevoir, on est ouvert ici)",
      "Parer un ennemi",
      "One-shot un ennemi",
      "Se faire one-shot",
      "Faire une invocation (seamless compte)",
      "Être envahi",
      "Vaincre un envahisseur",
      "'Héritier du feu abattu'",
      "Mourir d'un statut",
      "Taper avec un bouclier",
      "Aux poings (cestes/griffes/poings)",
      "Weapon Art seulement",
      "Charge lourde (fat roll)",
      "Surcharge",
      "Utiliser un sort",
      "Boss sans potion",
      "Boss no roll",
      "Utiliser toutes ses potions",
      "Se mettre À POIL !",
      "Utilise une branche (camouflage)",
      "Meurt contre un NPC/Joueur",
      "Tuer son teammate",
      "Attaque chargée",
      "No-hit (boss, duel)",
      "Boss en arme+0",
      "Améliore une arme exprès pour un boss",
      "Acheter de l'équipement (pas consommable)",
      "FASHION TIME !",
      "La Routourne a tourné",
      "Bug/glitch",
      "Mur illusoire",
      "Lunettes = skill",
      "'C le jeu/manette'",
      "*se trompe de touche*",
      "Mourir 2x sur le même ennemi",
      "Réallouer ses stats",
      "Réallouer ses potions",
      "Arme max !",
      "Potion au max ! (éclats+fragments)",
      "'allonzy allonzons'",
      "'[...] faut aller se faire foutre [...]'",
      "'Ça devient complexe...'",
      "'Oh la la...'",
      "'Ça m'énerve'",
      "*ne finit pas sa phrase/bégaie*",
      "*chantonne*",
      "'bichette'",
      "'FIFRELIN !'",
      "'MÉCRÉANT !'",
      "'Jme prend tout !/Mets-moi tout !'",
    ];

    const key = `bingoDS3-${viewer}`;
    const data = JSON.parse(localStorage.getItem(key)) || {};
    let chosen = data.prompts;

    if (!chosen || chosen.length !== 25) {
      chosen = [];
      const used = new Set();
      while (chosen.length < 25) {
        const index = Math.floor(Math.random() * prompts.length);
        if (!used.has(index)) {
          used.add(index);
          chosen.push(prompts[index]);
        }
      }
      data.prompts = chosen;
      data.checked = [];
      localStorage.setItem(key, JSON.stringify(data));
    }

    const grid = [];
    const gridElement = document.getElementById("bingo-grid");
    gridElement.innerHTML = "";

    for (let i = 0; i < 25; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.innerText = chosen[i];
      if (data.checked && data.checked.includes(i)) {
        cell.classList.add("checked");
      }

      cell.addEventListener("click", () => {
        if (!data.checked) data.checked = [];
        if (data.checked.includes(i)) {
          data.checked.splice(data.checked.indexOf(i), 1);
          cell.classList.remove("checked");
        } else {
          data.checked.push(i);
          cell.classList.add("checked");
        }
        localStorage.setItem(key, JSON.stringify(data));
        checkForBingo();
      });

      gridElement.appendChild(cell);
      grid.push(cell);
    }

    function checkForBingo() {
      const rows = 5;
      const hasRow = [...Array(rows).keys()].some(r =>
        [...Array(rows).keys()].every(c => grid[r * 5 + c].classList.contains("checked"))
      );
      const hasCol = [...Array(rows).keys()].some(c =>
        [...Array(rows).keys()].every(r => grid[r * 5 + c].classList.contains("checked"))
      );
      const hasDiag1 = [...Array(rows).keys()].every(i => grid[i * 5 + i].classList.contains("checked"));
      const hasDiag2 = [...Array(rows).keys()].every(i => grid[i * 5 + (4 - i)].classList.contains("checked"));

      const msg = document.getElementById("bingo-message");
      if (hasRow || hasCol || hasDiag1 || hasDiag2) {
        if (msg.style.display !== "block") {
          msg.style.display = "block";
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
        }
      } else {
        msg.style.display = "none";
      }
    }

    document.getElementById("resetBtn").addEventListener("click", () => {
      localStorage.removeItem(`bingoDS3-${viewer}`);
      location.reload();
    });
