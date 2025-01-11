class AddNote extends HTMLElement {
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
    const form = this._shadowRoot.querySelector('form');
    const titleInput = this._shadowRoot.querySelector('input#title');
    const bodyInput = this._shadowRoot.querySelector('textarea#body');
    const titleValidation = this._shadowRoot.querySelector('#title-validation');
    const bodyValidation = this._shadowRoot.querySelector('#body-validation');
  
    form.addEventListener('submit', (event) => this._onFormSubmit(event));
  
    titleInput.addEventListener('blur', () => {
      if (!titleInput.value.trim()) {
        titleValidation.textContent = 'Insert title';
      } else {
        titleValidation.textContent = '';
      }
    });
  
    bodyInput.addEventListener('blur', () => {
      if (!bodyInput.value.trim()) {
        bodyValidation.textContent = 'Insert body';
      } else {
        bodyValidation.textContent = '';
      }
    });
  }

  disconnectedCallback() {
    this._shadowRoot
      .querySelector('form')
      .removeEventListener('submit', (event) => this._onFormSubmit(event));
  }

  _onFormSubmit(event) {
    event.preventDefault();

    const title = this._shadowRoot.querySelector('input#title').value.trim();
    const body = this._shadowRoot.querySelector('input#body').value.trim();

    if (!title || !body) {
      alert('Please fill in both the title and body!');
      return;
    }

    const newNote = {
      id: `notes-${Date.now()}`,
      title,
      body,
      createdAt: new Date().toISOString(),
      archived: false,
    };

    const existingNotes = JSON.parse(localStorage.getItem('NOTES_APPS')) || [];
    existingNotes.push(newNote);
    localStorage.setItem('NOTES_APPS', JSON.stringify(existingNotes));

    this._shadowRoot.querySelector('form').reset();

    this.dispatchEvent(
      new CustomEvent('noteAdded', {
        detail: { newNote },
        bubbles: true,
      }),
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
        position: sticky;
        top: 10px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
      }
  
      .form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
  
      .form-group {
        position: relative;
        width: 100%;
      }
  
      .form-group input,
      .form-group textarea {
        display: block;
        width: 100%;
        padding: 16px 10px 6px 10px;
        border: 1px solid #ccc; 
        border-radius: 4px;
        font-size: 1rem;
        background: none;
        transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      }
  
      .form-group input:focus-visible,
      .form-group textarea:focus-visible {
        outline: none;
        border-color: #F2BED1;
        box-shadow: 0 0 8px rgba(242, 190, 209, 0.5);
      }
  
      .form-group label {
        position: absolute;
        top: 16px;
        left: 10px;
        font-size: 1rem;
        font-weight: 700;
        text-transform: uppercase;
        color: grey;
        background: white;
        padding: 0 4px;
        transition: 150ms all ease-in-out;
      }
  
      .form-group input:focus-visible ~ label,
      .form-group input:not(:placeholder-shown) ~ label,
      .form-group textarea:focus-visible ~ label,
      .form-group textarea:not(:placeholder-shown) ~ label {
        top: -10px;
        left: 8px;
        font-size: 0.8rem;
        color: #F2BED1;
      }
  
      .btn-submit {
        width: 100%;
        border: none;
        padding: 12px 24px;
        background-color: #FDCEDF;
        text-transform: uppercase;
        font-size: 1rem;
        color: white;
        cursor: pointer;
        transition: 100ms linear;
      }
  
      .btn-submit:hover {
        background-color: #F2BED1;
      }
  
      .btn-submit:active {
        background-color: #FDCEDF;
      }
  
      .validation-message {
        color: red;
        font-size: 0.8rem;
        margin-top: 4px;
      }
    `;
  }  

  render() {
    this._emptyContent();
    this._updateStyle();
  
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="floating-form" id="add-todo">
        <form autocomplete="off" class="form" id="form">
          <div class="form-group">
            <input type="text" id="title" name="title" required placeholder="">
            <label for="title">Title</label>
            <span class="validation-message" id="title-validation"></span>
          </div>
          <div class="form-group">
            <textarea id="body" name="body" required placeholder=""></textarea>
            <label for="body">Body</label>
            <span class="validation-message" id="body-validation"></span>
          </div>
          <button type="submit" class="btn-submit">Add Note</button>
        </form>
      </div>
    `;
  }  
}

customElements.define('add-note', AddNote);