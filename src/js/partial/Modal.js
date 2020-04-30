export class Modal {
  constructor() {
    this.trigger = document.querySelector('.modal-trigger');
    this.area = document.querySelector('.modal-area');
    this.dialog = this.area.querySelector('.dialog');
    this.close = this.area.querySelector('.close');

    this.trigger.addEventListener('click', (e) => {
      this.show();
    });

    this.area.addEventListener('click', (e) => {
      const regExp = new RegExp('modal-area|close');
      if (!regExp.test(e.target.className)) return;

      this.hide();
    });
  }

  show() {
    this.area.style.display = 'flex';
  }

  hide() {
    this.area.style.display = 'none';
  }
}
