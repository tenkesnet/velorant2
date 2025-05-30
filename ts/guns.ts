interface WeaponStats {
  fireRate: number;
  magazineSize: number;
  equipTimeSeconds: number;
  reloadTimeSeconds: number;
  wallPenetration: string;
}

interface ShopData {
  cost?: number;
}

interface Skin {
  displayIcon: string | null;
  displayName: string;
}

interface Weapon {
  displayName: string;
  category: string;
  displayIcon: string | null;
  weaponStats?: WeaponStats;
  shopData?: ShopData;
  skins: Skin[];
}

let allWeapons: Weapon[] = [];
let selectedCategory: string = "all";

const weaponList = document.getElementById("weapon-list") as HTMLElement;
const searchInput = document.getElementById("search") as HTMLInputElement;
const filters = document.getElementById("filters") as HTMLElement;

document.addEventListener("DOMContentLoaded", () => {
  if (!weaponList || !searchInput || !filters) return;
  loadWeapons();
  searchInput.addEventListener("input", renderWeapons);
});

async function loadWeapons() {
  try {
    const response = await axios.get("https://valorant-api.com/v1/weapons");
    const data: Weapon[] = response.data.data;
    allWeapons = data.filter(weapon => weapon.displayIcon);
    renderWeapons();
    renderCategoryButtons();
  } catch (error) {
    console.error("Hiba történt a fegyverek betöltésekor:", error);
  }
}

function renderWeapons() {
  weaponList.innerHTML = "";
  const searchText = searchInput.value.toLowerCase();

  allWeapons.forEach(weapon => {
    const name = weapon.displayName.toLowerCase();
    const category = weapon.category.toLowerCase();

    const matchesSearch = name.includes(searchText);
    const matchesCategory = selectedCategory === "all" || category === selectedCategory;

    if (matchesSearch && matchesCategory) {
      const card = document.createElement("div");
      card.className = "col-sm-6 col-md-4 col-lg-3";
      card.innerHTML = `
        <div class="card h-100 bg-dark text-white border-0 rounded-4 shadow-sm">
          <img src="${weapon.displayIcon}" class="card-img-top p-3 bg-black" style="height:220px;">
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title text-center">${weapon.displayName}</h5>
              <p class="text-center mb-3">${weapon.category.replace("EEquippableCategory::", "")}</p>
              ${
                weapon.weaponStats ? `
                <ul class="list-unstyled weapon-stats text-start">
                  <li><strong>Tűzgyorsaság:</strong> ${weapon.weaponStats.fireRate} lövés/mp</li>
                  <li><strong>Tárkapacitás:</strong> ${weapon.weaponStats.magazineSize}</li>
                  <li><strong>Felszerelési idő:</strong> ${weapon.weaponStats.equipTimeSeconds}s</li>
                  <li><strong>Újratöltési idő:</strong> ${weapon.weaponStats.reloadTimeSeconds}s</li>
                  <li><strong>Falszúrás:</strong> ${weapon.weaponStats.wallPenetration.replace("EWallPenetrationDisplayType::", "")}</li>
                  <li><strong>Ár:</strong> ${weapon.shopData?.cost ?? 'N/A'} kredit</li>
                  ${
                    weapon.skins.slice(0, 5).map(skin =>
                      skin.displayIcon
                        ? `<li><img src="${skin.displayIcon}" alt="${skin.displayName}" class="skin-img" /></li>`
                        : ''
                    ).join('')
                  }
                </ul>` : '<p class="text-muted">Nincsenek részletes statisztikák.</p>'
              }
            </div>
          </div>
        </div>
      `;
      weaponList.appendChild(card);
    }
  });
}

function renderCategoryButtons() {
  const categories = ["all", ...new Set(allWeapons.map(w => w.category.toLowerCase()))];
  filters.innerHTML = "";

  categories.forEach(cat => {
    const button = document.createElement("button");
    button.textContent = cat === "all" ? "Mind" : cat.replace("eequippablecategory::", "");
    button.className = "btn btn-outline-light btn-sm me-2";
    if (cat === selectedCategory) button.classList.add("active");

    button.addEventListener("click", () => {
      selectedCategory = cat;
      renderCategoryButtons();
      renderWeapons();
    });

    filters.appendChild(button);
  });
}
