    const urlParams = new URLSearchParams(window.location.search);
    const viewer = urlParams.get('user') || 'inconnu';
    document.getElementById("viewer-name").innerText = viewer;

    const prompts = [
      "Esquiver dans une attaque et se la prendre quand même.",
      "Rater un combo",
      "Spam l'arme à feu parce que trop nulle",
      "*J'ai, j'ai !* (comprend un truc)",
      "Tharcivantardise",
      "*NIQUE ! NIQUE !*",
      "Obtenir plus qu'un C en note de fin",
      "Un Dope en combo (D)",
      "Un Crazy en combo (C)",
      "Un Blast en combo (B)",
      "Un Alright en combo (A)",
      "Un Sweet en combo (S)",
      "Un SShowtime en combo (SS)",
      "Un SSStylish en combo (SSS)",
      "Utiliser une étoile de vie",
      "Utiliser une étoile du diable",
      "Devoir recommencer la mission entière",
      "Obtenir une sphère bleue",
      "Obtenir un fragment de sphère bleue",
      "Obtenir une sphère jaune",
      "Obtenir une sphère violette",
      "Spam du Stinger (charge vers l'avant)",
      "Tharcilecture",
      "Tharcidoublage",
      "Stream en FWANGLAIS LEZGO",
      "Galérer à platformer",
      "Sauvegarder 2x au cas où ou par oubli,",
      "La caméra fait ses shenanigans",
      "Mob basique qui met la misère",
      "Tharcisel",
      "Ne comprend rien/tharciduper",
      "Achète un objet",
      "Achète une compétence",
      "Oublier qu'il y a une pause",
      "*WA WAAAH*",
      "*Olé bambino !*",
      "Envie de manger son micro",
      "Se tromper de touche",
      "Obtenir un D en note de fin",
      "*non non non nonnononon*",
      "Changer de style de combat",
      "Switch d'arme en combat",
      "'Gros baiseur'",
    ];

    const key = `bingoDMC3-${viewer}`;
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
      localStorage.removeItem(`bingoDMC3-${viewer}`);
      location.reload();
    });
