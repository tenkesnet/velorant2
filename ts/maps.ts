class Modal {
  private modal: HTMLElement;
  private overlay: HTMLElement;
  private closeButton: HTMLElement;
  constructor() {
    // Create modal elements
    this.overlay = document.createElement('div');
    this.modal = document.createElement('div');
    this.closeButton = document.createElement('button');
    
    this.initialize();
  }
  private initialize(): void {
    // Setup overlay
    this.overlay.className = 'modal-overlay';
    
    // Setup modal
    this.modal.className = 'modal-content';
    
    // Setup close button
    this.closeButton.className = 'modal-close';
    this.closeButton.innerHTML = '×';
    this.closeButton.onclick = () => this.hide();
    
    // Add elements to DOM
    this.modal.appendChild(this.closeButton);
    this.overlay.appendChild(this.modal);
    document.body.appendChild(this.overlay);
    
    // Close on overlay click
    this.overlay.onclick = (e) => {
      if (e.target === this.overlay) this.hide();
      this.hide();
    };
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.hide();
    });
  }
  show(mapData: MapData): void {
    this.modal.innerHTML = `
      <button class="modal-close">×</button>
      <h2>${mapData.displayName}</h2>
      <img src="${mapData.splash}" alt="${mapData.displayName}" class="modal-image">
      <div class="modal-details">
        <p><strong>Koordináták:</strong> ${mapData.coordinates || 'N/A'}</p>
        <p><strong>Taktikai leírás:</strong> ${mapData.tacticalDescription || 'N/A'}</p>
        <h4>Calloutok:</h4>
        <ul>
          ${mapData.callouts 
            ? mapData.callouts.slice(0, 5).map(callout => 
                `<li>${callout.regionName} (${callout.superRegionName})</li>`
              ).join('')
            : '<li>Nincs adat</li>'
          }
        </ul>
      </div>
    `;
    
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  hide(): void {
    this.overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  
  loadMaps();
  
});

const fetchWithErrorHandling = async (
  url: string,
  parseCallback: (data: any) => void
): Promise<void> => {
  try {
    const response = await axios.get(url);
    parseCallback(response.data.data);
  } catch (error) {
    console.error(`Hiba történt a ${url} API-hívás során:`, error);
  }
};

const loadMapDetails = async (params: { uuid: string }): Promise<void> => {
  const other= document.querySelectorAll(':not(#map-details-'+params.uuid+')') as NodeListOf<HTMLDivElement>; // Töröljük a korábbi részleteket
other.forEach((el) => {
        if (el.id.startsWith('map-details-')) {
        el.innerHTML = ''; // Töröljük a tartalmat
        }
    });
  const detailsDiv = document.querySelector('#map-details-'+params.uuid) as HTMLDivElement;
  if (!detailsDiv) return;
  try {
    const response = await axios.get('https://valorant-api.com/v1/maps');
    const maps = response.data.data;
    const map = maps.find((m: any) => m.uuid === params.uuid);
    if (!map) {
      detailsDiv.innerHTML = '<p>Nem található ilyen térkép.</p>';
      return;
    }
    const modal = new Modal();
    modal.show(map); // Mutatjuk a modalt a térkép adataival
    
  } catch (error) {
    detailsDiv.innerHTML = '<p>Hiba történt a térkép lekérésekor.</p>';
    console.error(`Hiba történt a térkép lekérésekor:`, error);
  }
};

const loadMaps = async (): Promise<void> => {
  await fetchWithErrorHandling(
    'https://valorant-api.com/v1/maps',
    (maps) => {
      const mapList = document.querySelector('#map-list') as HTMLDivElement;
      if (!mapList) return;
      // Szűrjük a térképeket, csak azok maradnak ahol van displayIcon
      const filteredMaps = maps.filter((map: any) => map.displayIcon);
      // Bootstrap grid rendszerrel formázzuk
      mapList.innerHTML = `
        <div class="container">
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            ${filteredMaps
          .map(
            (map: any) => `
                  <div class="col">
                    <div class="card h-100 map-card" data-uuid="${map.uuid}" style="cursor:pointer;">
                      <img src="${map.displayIcon}" class="card-img-top" alt="${map.displayName}" style="object-fit: cover; height: 200px;">
                      <div class="card-body">
                        <h5 class="card-title">${map.displayName}</h5>
                        ${map.coordinates ? `<p class="card-text"><small >Coordinates: ${map.coordinates}</small></p>` : ''}
                      </div>
                      <div class="map-details" id="map-details-${map.uuid}">
                      </div>
                    </div>
                  </div>
                `
          )
          .join('')}
          </div>
        </div>
      `;
      // Itt, közvetlenül utána:
      mapList.querySelectorAll('.map-card').forEach((card) => {
        card.addEventListener('click', (event) => {
          const uuid = (event.currentTarget as HTMLElement).getAttribute('data-uuid');          
          loadMapDetails({uuid:uuid || ''});
        });
      });
    }
  );

};