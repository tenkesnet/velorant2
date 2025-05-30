
document.addEventListener("DOMContentLoaded", () => {
  
  loadBundles();
  
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

const loadBundles = async (): Promise<void> => {
  await fetchWithErrorHandling(
    'https://valorant-api.com/v1/bundles',
    (maps) => {
      const mapList = document.querySelector('#bundles-list') as HTMLDivElement;
      if (!mapList) return;
      // Szűrjük a térképeket, csak azok maradnak ahol van displayIcon
      const filteredMaps = maps.filter((map: any) => map.displayIcon);
      // Bootstrap grid rendszerrel formázzuk
      mapList.innerHTML = `
        <div class="container">
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            ${filteredMaps
          .map(
            (bundles: any) => `
                  <div class="col">
                    <div class="card h-100 bundles-card" data-uuid="${bundles.uuid}" style="cursor:pointer;">
                      <img src="${bundles.displayIcon}" class="card-img-top" alt="${bundles.displayName}" style="object-fit: cover; height: 200px;">
                      <div class="card-body">
                        <h5 class="card-title">${bundles.displayName}</h5>

                      
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
      mapList.querySelectorAll('.bundles-card').forEach((card) => {
        card.addEventListener('click', (event) => {
          const uuid = (event.currentTarget as HTMLElement).getAttribute('data-uuid');          
          loadMapDetails({uuid:uuid || ''});
        });
      });
    }
  );

};