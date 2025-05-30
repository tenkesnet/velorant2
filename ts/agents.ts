interface Ability {
  displayName: string;
  description: string;
  displayIcon: string | null;
}

interface Role {
  displayName: string;
  displayIcon: string;
}

interface Agent {
  displayName: string;
  description: string;
  fullPortrait: string | null;
  displayIcon: string;
  role?: Role;
  abilities: Ability[];
}

document.addEventListener("DOMContentLoaded", () => {
  loadAgents();
});

async function loadAgents(): Promise<void> {
  const list = document.getElementById("agent-list");
  if (!list) return;

  try {
    const response = await axios.get("https://valorant-api.com/v1/agents?isPlayableCharacter=true");
    const agents: Agent[] = response.data.data;
    displayAgents(agents);
  } catch (error) {
    console.error("Nem sikerült betölteni az agenteket:", error);
    list.innerHTML = `<p style="text-align:center; color:#ff4655;">Hiba történt az adatok betöltésekor.</p>`;
  }
}

function displayAgents(agents: Agent[]): void {
  const list = document.getElementById("agent-list");
  if (!list) return;

  list.className = "container my-4";
  list.innerHTML = '<div class="row g-4"></div>';
  const row = list.querySelector(".row");
  if (!row) return;

  agents.forEach(agent => {
    const card = document.createElement("div");
    card.className = "col-md-6 col-lg-4";

    const portrait = agent.fullPortrait || agent.displayIcon;

    card.innerHTML = `
      <div class="card h-100 shadow border-0 rounded-4">
        <img src="${portrait}" class="card-img-top" alt="${agent.displayName}" style="height: 400px; object-fit: contain; background: #000;">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 class="card-title">${agent.displayName}</h5>
            <p class="card-text">${agent.description}</p>
            ${
              agent.role
                ? `<p>
                    <img src="${agent.role.displayIcon}" alt="${agent.role.displayName}" style="height: 100px; width: 100px; margin: 0 auto;" class="mb-2">
                    <strong>${agent.role.displayName}</strong>
                  </p>`
                : ""
            }
          </div>
          <div>
            <h6 class="mt-3">Képességek:</h6>
            ${agent.abilities
              .map(
                ability => `
              <div class="d-flex align-items-start mb-2">
                ${
                  ability.displayIcon
                    ? `<img src="${ability.displayIcon}" alt="${ability.displayName}" style="width:32px; height:32px;" class="me-2">`
                    : ""
                }
                <div>
                  <strong>${ability.displayName}</strong><br>
                  <small>${ability.description}</small>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;

    row.appendChild(card);
  });
}
