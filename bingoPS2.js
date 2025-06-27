    const rows = 4;
    const totalCells = rows * rows;
    
    const urlParams = new URLSearchParams(window.location.search);
    const viewer = urlParams.get('user') || 'inconnu';
    document.getElementById("viewer-name").innerText = viewer;

    const prompts = [
      "Jeu à patounes",
      "Démo qui ne se lance pas ou crash",
      "Pas de version FR (démo)",
      "Retour menu soudain",
      "Son du menu PS2... aaah...",
      "'J'ai le jeu, j'ai le jeu'",
      "'Je l'adorais quand j'étais petite'",
      "'*nom du jeu*, TROP BIEN.'",
      "Jeu de racing... aled",
      "Perso féminin avec vlà le décolleté",
      "*ne lis pas les touches puis s'en plaint*",
      "*casse tout dans le jeu*",
      "*temps écoulé*",
      "*ne veut pas continuer la démo*",
      "Contrôles imbuvables",
      "Caméra pourrie",
      "'[...] j'aimerais trop le faire'",
      "*n'avait rien compris quand elle était petite*",
      "*ne comprend toujours rien*",
      "Chargement jugé long",
      "Splashscreens (généralement ils abusent)",
      "Tharcitraduction douteuse",
      "Démo qui se lance seule (celle du CD)",
      "Perso qui a du savon sous les pieds",
      "'Coming soon' ou équivalent FR",
      "*meurt dans la démo* (un vrai tharcicaca)",
      "Jeu d'horreur",
      "Tharcinote égale/en dessous de 5/10",
      "Tharcinote au dessus de 5/10",
      "SINJ",
      "Méchas",
      "Infiltration (aled)",
      "'Quelle horreur'",
      "Cinématique sous coc'",
      "Jeu de sport",
      "Jeu de combat",
      "Jeu d'aventure",
      "Jeu de tir",
      "Visuels cartoon (un peu t'sais)",
      "On incarne un animal",
      "(A)RPG",
      "NINJAAAH",
      "*relance la démo*",
      "Démo avec qu'un seul niveau jouable",
      "Démo avec plusieurs niveaux jouables",
    ];

    const key = `bingoPS2-${viewer}`;
    const data = JSON.parse(localStorage.getItem(key)) || {};
    let chosen = data.prompts;

    if (!chosen || chosen.length !== totalCells) {
      chosen = [];
      const used = new Set();
      while (chosen.length < totalCells) {
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

    for (let i = 0; i < totalCells; i++) {
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
      const hasRow = [...Array(rows).keys()].some(r =>
        [...Array(rows).keys()].every(c => grid[r * rows + c].classList.contains("checked"))
      );
      const hasCol = [...Array(rows).keys()].some(c =>
        [...Array(rows).keys()].every(r => grid[r * rows + c].classList.contains("checked"))
      );
      const hasDiag1 = [...Array(rows).keys()].every(i => grid[i * rows + i].classList.contains("checked"));
      const hasDiag2 = [...Array(rows).keys()].every(i => grid[i * rows + (rows - i)].classList.contains("checked"));

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
      localStorage.removeItem(`bingoPS2-${viewer}`);
      location.reload();
    });