class SearchBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;
 
  _submitEvent = 'submit';
  _searchEvent = 'search';
 
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this.render();
  }
 
  _emptyContent() {
    this._shadowRoot.innerHTML = '';
  }
 
  connectedCallback() {
    this._shadowRoot
      .querySelector('form')
      .addEventListener('submit', (event) => this._onFormSubmit(event, this));
    this.addEventListener(this._submitEvent, this._onSearchBarSubmit);
  }
 
  disconnectedCallback() {
    this._shadowRoot
      .querySelector('form')
      .removeEventListener('submit', (event) => this._onFormSubmit(event, this));
    this.removeEventListener(this._submitEvent, this._onSearchBarSubmit);
  }
 
  _onFormSubmit(event, searchBarInstance) {
    searchBarInstance.dispatchEvent(new CustomEvent('submit'));
    event.preventDefault();
  }

  _onSearchBarSubmit() {
    const query = this._shadowRoot.querySelector('input#name').value;
    this.dispatchEvent(
      new CustomEvent(this._searchEvent, {
        detail: { query: query || '' },
        bubbles: true,
      })
    );
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: inline;
      }

      .floating-form {
        background-color: white;
        padding: 16px;
        border-radius: 5px;
        top: 10px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
      }

      .search-form {
        display: flex;
        gap: 16px;
      }
  
      .form-group {
        flex-grow: 1;
        position: relative;
      }
  
      .form-group input {
        display: block;
        width: 100%;
        height: 60px;
        padding: 16px 10px 6px 10px;
        border: 1px solid #ccc; 
        border-radius: 4px;
        font-size: 1rem;
        background: none;
        transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      }
  
      .form-group input:focus-visible {
        outline: none;
        border-color: #F2BED1; 
        box-shadow: 0 0 8px rgba(242, 190, 209, 0.5);
      }
  
      .form-group label {
        line-height: 60px;
        font-size: 1rem;
        font-weight: 700;
        text-transform: uppercase;
        color: grey;
        white-space: nowrap;
        position: absolute;
        top: 0;
        left: 10px;
        user-select: none;
        pointer-events: none;
        transition: 150ms all ease-in-out;
      }
  
      .form-group input:focus-visible ~ label,
      .form-group input:not(:placeholder-shown) ~ label {
        left: 10px;
        top: -16px;
        font-size: 0.8rem;
        color: #F2BED1;
      }
  
      .search-form button {
        border: 0;
        padding-inline: 24px;
        background-color: #FDCEDF;
        text-transform: uppercase;
        font-size: 1rem;
        color: white;
        cursor: pointer;
        transition: 100ms linear;
      }
  
      .search-form button:hover {
        background-color: #F2BED1;
      }
  
      .search-form button:active {
        background-color: #FDCEDF;
      }
    `;
  }  
 
  render() {
    this._emptyContent();
    this._updateStyle();
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <div class="floating-form">
        <form autocomplete="off" id="searchForm" class="search-form">
          <div class="form-group">
            <input id="name" name="name" type="search" placeholder="" required />
            <label for="name">Search</label>
          </div>
          <button type="submit">Search</button>
        </form>
      </div>
    `;
  }  
}
 
customElements.define('search-bar', SearchBar);