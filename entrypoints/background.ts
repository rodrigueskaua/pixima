type SidebarBrowser = typeof browser & {
  sidebarAction: { toggle: () => Promise<void> };
};

export default defineBackground(() => {
  if (import.meta.env.FIREFOX) {
    browser.action.onClicked.addListener(() => {
      (browser as SidebarBrowser).sidebarAction.toggle();
    });
    return;
  }

  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);
});
