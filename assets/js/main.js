// ==========================================================================
// Splunk Workshop Theme — main entry
// ==========================================================================
import { initThemeToggle } from "./theme-toggle.js";
import { initTOC }         from "./toc.js";
import { initTabs }        from "./tabs.js";
import { initCopyCode }    from "./copy-code.js";
import { initCodeExpand }  from "./code-expand.js";
import { initLightbox }    from "./lightbox.js";
import { initProgress }    from "./progress.js";
import { initWorkshopProgress } from "./workshop-progress.js";
import { initSidebarTree }      from "./sidebar-tree.js";
import { initMobileNav }   from "./mobile-nav.js";
import { initQuiz }        from "./quiz.js";
import { initPresenter }    from "./presenter.js";
import { initKeyboardNav }  from "./keyboard-nav.js";
import { initSearch }       from "./search.js";
import { initLangSwitch }   from "./lang-switch.js";

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initTOC();
  initTabs();
  initCopyCode();
  initCodeExpand();
  initLightbox();
  initProgress();
  initWorkshopProgress();
  initSidebarTree();
  initMobileNav();
  initQuiz();
  initPresenter();
  initKeyboardNav();
  initSearch();
  initLangSwitch();
});
