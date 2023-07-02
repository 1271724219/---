/** 单个tab或Container数据 */
class BasicData {
  constructor(t) {
    this.data = t;
    this.isCheck = false;
  }

  /**
   * 切换状态
   */
  switchTo() {
    this.isCheck = !this.isCheck;
  }
}
/** 界面数据 */
class UIBasicData {
  /**
   * @param {any[]} tabData tab数据
   * @param {any[]} tabContainerData tabContainer数据
   */
  constructor(tabData, tabContainerData) {
    this.tabData = tabData.map((tab) => this.createTab(tab));
    this.tabContainerData = tabContainerData.map((container) =>
      this.createTabContainer(container)
    );
  }

  /**
   * 创建tab
   * @param {any} data 要创建的tab数据
   * @returns {BasicData} 返回创建的tab数据
   */
  createTab(data) {
    const tab = new BasicData(data);
    return tab;
  }
  /**
   *  创建tabContainer
   * @param {any} data  要创建的tabContainer数据
   * @returns {BasicData} 返回创建的tabContainer数据
   */
  createTabContainer(data) {
    const tabContainer = new BasicData(data);
    return tabContainer;
  }

  /**
   *  切换activeIndex
   * @param {number} index  要切换的tab索引
   * @returns  {void} 无返回值
   */
  switchTo(index) {
    if (index === this.activeIndex) {
      return;
    }
    //#region 重置所有tab与tabContainer的状态
    for (let i = 0; i < this.tabData.length; i++) {
      const tab = this.tabData[i];
      const tabContainer = this.tabContainerData[i];
      tab.isCheck = false;
      tabContainer.isCheck = false;
    }
    //#endregion
    this.activeIndex = index;
    this.tabData[index].switchTo();
    this.tabContainerData[index].switchTo();
  }

  /**
   * 根据选中的activeIndex获取对应的tab与tabContainer
   * @returns 返回当前激活的tab和tabContainer
   */
  getActiveTab() {
    const tab = this.tabData[this.activeIndex];
    const tabContainer = this.tabContainerData[this.activeIndex];
    return {
      tab,
      tabContainer,
    };
  }
}

class UIMain {
  constructor() {
    // 创建界面数据实例
    this.ui_data = new UIBasicData(tab_list, tab_content);
    //  获取dom
    this.doms = {
      tab_nav: document.querySelector(".tab-container>.tab-nav"),
      tab_content: document.querySelector(".tab-content"),
    };
    //  创建界面
    this.createHTML();
    //  切换到第一个tab
    this.switchTo(0);
  }
  /**
   * 根据数据创建元素
   */
  createHTML() {
    let html = "";
    //  创建tab
    for (const [index, tabData] of this.ui_data.tabData.entries()) {
      html += `<li index="${index}">${tabData.data.title}</li>`;
    }
    this.doms.tab_nav.innerHTML = html;
    //  重置html
    html = "";
    // 创建tabContainer
    for (const containerData of this.ui_data.tabContainerData) {
      html += `<div class="tab-pane">${containerData.data.content}</div>`;
    }
    this.doms.tab_content.innerHTML = html;
  }

  /**
   * 根据索引切换tab
   * @param {number} index  要切换的tab索引
   */
  switchTo(index) {
    this.ui_data.switchTo(index);
    this.updateState(index);
  }
  /**
   * 更新状态
   * @param {number} index  要更新的tab索引
   */
  updateState(index) {
    /** 获取所有的tab */
    let nav_children = this.doms.tab_nav.children;
    /** 获取所有的tabContainer */
    let content_children = this.doms.tab_content.children;
    for (let i = 0; i < nav_children.length; i++) {
      // 获取 tab
      const nav_element = nav_children[i];
      //   获取 tabContainer
      const content_element = content_children[i];
      //   移除所有的active
      nav_element.classList.remove("active");
      content_element.classList.remove("active");
    }
    const { tab, tabContainer } = this.ui_data.getActiveTab();

    if (tab.isCheck) {
      nav_children[index].classList.add("active");
      content_children[index].classList.add("active");
    }
  }
}

let ui_main = new UIMain();
// 添加事件
ui_main.doms.tab_nav.addEventListener("click", (e) => {
  // 获取tager索引
  let index = e.target.getAttribute("index");
  if(!index) return
  ui_main.switchTo(index);
});
