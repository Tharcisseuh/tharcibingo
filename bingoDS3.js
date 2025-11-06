    const urlParams = new URLSearchParams(window.location.search);
    const viewer = urlParams.get('user') || 'inconnu';
    document.getElementById("viewer-name").innerText = viewer;

    const prompts = [
      "Chute fatale...",
      "Boss du premier coup !",
      "Infliger un coup critique",
      "Tuer un ennemi d'un seul coup",
      "Invoquer un ou des Esprit(s)",
      "Mourir d'un boss/ennemi jugé 'facile'",
      "Mourir d'un piège",
      "'Ennemi Abattu'",
      "'Demi-dieu abattu'",
      "'Ennemi majeur abattu'",
      "'Légende abattue'",
      "'Dieu occis'",
      "Mourir d'un statut",
      "Taper avec un bouclier",
      "Utiliser une sorcellerie",
      "Utiliser une incantation",
      "Boss sans potions",
      "Attaque chargée",
      "Se mettre à poil",
      "No-Hit",
      "Combattre avec une arme+0",
      "Surcharge",
      "Charge lourde",
      "Se voit interdire les roulades",
      "Utiliser une compétence",
      "Aux POINGS (cestes, armes de poings)",
      "Visiter des catacombes...",
      "Visiter des grottes...",
      "Tromper un ennemi avec le Voile Mimétique",
      "Pousser un ennemi dans le vide",
      "Bug ou glitch",
      "Invoquer un NPC",
      "Vaincre un boss duo !",
      "Vaincre un envahisseur",
      "Parer un ennemi",
      "Mourir d'un seul coup",
      "Mur illusoire",
      "*met les lunettes pour plus de skill*",
      "Coffre piégé",
      "FASHION TIME !",
      "'C'est pas moi, c'est le jeu/manette'",
      "*se trompe de touche*",
      "Morte deux fois de suite sur le même ennemi...",
      "Réalloue ses points de stats",
      "Change de build",
      "Améliore une arme au max !",
      "Améliore la potion au max !",
      "'Faut aller se faire foutre'",
      "'Ça devient complexe...'",
      "'Oh la la...'",
      "*ne finira jamais sa phrase*",
      "'tulututu~' *chantonne*",
      "'FIFRELIN !'",
      "'MÉCRÉANT !'",
      "Faire tourner la Routourne Infernale",
      "Tuer un scarabée (le pauvre)",
      "Acheter une arme",
      "Acheter une pièce d'armure",
      "Acheter une compétence d'arme",
      "Améliorer une arme spécifiquement pour un boss",
      "Réalloue ses potions",
      "'mais on est où là ???'",
      "'oui, bon, oui'",
      "Jeu qui crash",
      "Visiter des galeries...",
      "'Allonzy, allonzons~'",
      "'J'suis perdue, on va où'",
      "'J'me prend tout!/Mets-moi tout !'",
      "'Ça m'énerve'",
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

