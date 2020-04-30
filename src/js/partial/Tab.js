export class Tabs {
  constructor() {
    this.tabList = document.querySelectorAll('.tab-area');

    this.tabList.forEach((element) => {
      new Tab(element, 0);
    });
  }
}

class Tab {
  constructor(area, index) {
    this.area = area;
    this.label = this.area.querySelectorAll('.link');
    this.content = this.area.querySelectorAll('.content');
    this.active = this.content[index];
    this.contentDisplay = this.active.style.display ? this.active.style.display : 'block';

    this.hide();
    this.active.style.display = this.contentDisplay;

    this.area.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.className !== 'link') return;

      this.switch(e);
    });
  }

  /**
   * cotentを全て非表示にする
   */
  hide() {
    this.content.forEach((element) => {
      element.style.display = 'none';
    });
  }

  /**
   * clickされたtabに応じてcontentを切り替える
   * @param {object} e イベントオブジェクト
   */
  switch(e) {
    const index = Array.from(this.label).findIndex((element) => {
      return element === e.target;
    });

    this.active.style.display = 'none';
    this.active = this.content[index];
    this.active.style.display = this.contentDisplay;
  }
}
