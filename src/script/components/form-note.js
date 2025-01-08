class FormNote extends HTMLElement {
  _shadowRoot = null;
  _style = null;

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

    if (!query) return;

    this.dispatchEvent(
      new CustomEvent(this._searchEvent, {
        detail: { query },
        bubbles: true,
      }),
    );
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: inline;
      }

      .container {
      width: 1024px;
      border-radius: 8px;
      margin: 16px;
      background: #F8F9FA;
      padding: 16px;
      flex-grow: 1;
      height: fit-content;
      
      .form {
      display: flex;
      padding: 16px;
      flex-direction: column;
      height: 300px;
      border-radius: 16px;
      }

      .form-group {
          display: flex;
          flex-direction: column;
      }

      .form-group label {
          margin-bottom: 4px;
          font-size: 18px;
          font-weight: lighter;
      }

      input[type=text], input[type=textarea] {
          font-family: Raleway, sans-serif;
          background: #F5F1FF;
          border: 2px solid #9475EA;
          border-radius: 8px;
          padding: 16px;
          box-sizing: border-box;
          margin-bottom: 8px;
          font-size: 24px;
      }

      .btn-submit {
          width: fit-content;
          font-family: Raleway, sans-serif;
          border-radius: 16px;
          padding: 12px 24px;
          border: 2px solid #5F30E2;
          color: black;
          font-size: 24px;
          margin-top: auto;
          align-self: flex-end;
          cursor: pointer;
      }

      .btn-submit:hover {
          background: #5F30E2;
          color: white;
      }

      input[type=text], input[type=textarea], .btn-submit:focus {
          outline: none;
      }

      .text-center {
          text-align: center;
      }

      .form-title {
          margin: auto 0;
      }
    `;
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
    <div class="container" id="add-todo">
      <form class="form" action="#" id="form">
        <div class="form-group form-title">
          <label for="title">Judul</label>
          <input type="text" id="title" name="title" required>
        </div>
        <div class="form-group form-title">
          <label for="body">Isi</label>
          <input type="textarea" id="body" name="body" required>
        </div>
        <input type="submit" value="Submit" name="Submit" class="btn-submit">
      </form>
    </div>
    `;
  }
}

customElements.define('form-note', FormNote);