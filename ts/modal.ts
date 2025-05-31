export class Modal {
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