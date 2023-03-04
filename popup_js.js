var bitespeed_popups, currentPopup;
class Util {
  static create_UUID = () => {
    let dt = new Date().getTime();
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  };
}

class API {
  constructor() {
    this.baseUrl = "http://localhost:3000/dev";
  }
  get = async (url, query) => {
    let response = await fetch(`${this.baseUrl}${url}?${query}`);
    return await response.json();
  };
  post = async (url, body) => {
    let response = await fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  };
}

class BrowserService {
  #browserId = "";
  #shopDomain = "";
  #blockedPopups = [];

  #getCookie = (cookie) => {
    let cookieJson = {};
    document.cookie.split(";").forEach(function (el) {
      let [k, v] = el.split("=");
      cookieJson[k.trim()] = v;
    });
    return cookieJson[cookie];
  };
  #setCookie = (cookie, value, days) => {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = cookie + "=" + (value || "") + expires + "; path=/";
  };
  #setBrowserId = () => {
    let refb = this.#getCookie("refb");
    if (refb.length == 0) {
      refb = Util.create_UUID();
      this.#setCookie("refb", refb);
    }
    this.#browserId = refb;
  };
  #setShopDomain = () => {
    let indexOfwww = location.hostname.indexOf("www");
    let shopDomain =
      indexOfwww === -1
        ? location.hostname
        : location.hostname.substr(indexOfwww + 4);
    this.#shopDomain = shopDomain;
  };
  #setBlockedPopups = () => {
    let blockedPopups = this.#getCookie("blockedPopups");
    if (blockedPopups && blockedPopups.length > 0) {
      this.#blockedPopups = blockedPopups.split(",");
    } else {
      this.#blockedPopups = [];
    }
  };
  static isPhone = window.innerWidth < 768;
  constructor() {
    this.#setBrowserId();
    this.#setShopDomain();
    this.#setBlockedPopups();
  }
  static initCSSDependencies = (CSSDependencies) => {
    try {
      let links = CSSDependencies.map((link) => {
        return `<link rel="stylesheet" href="${link}">`;
      });
      document.head.insertAdjacentHTML("beforeend", links.join(""));
    } catch (e) {
      console.error(
        `Error in Bitespeed Popups: Error while loading CSS dependencies: ${e}`
      );
    }
  };
  static build = async ({ JSDependencies, CSSDependencies }) => {
    BrowserService.initCSSDependencies(CSSDependencies);
    await BrowserService.initJSDependencies(JSDependencies);
    return new BrowserService();
  };
  getShopDomain = () => {
    return this.#shopDomain;
  };
  getBrowserId = () => {
    return this.#browserId;
  };
  getBlockedPopups = () => {
    return this.#blockedPopups;
  };
  updateBlockedPopups = (popupId) => {
    this.#blockedPopups.push(popupId);
    this.#setCookie("blockedPopups", this.#blockedPopups.join(","));
  };
  static initJSDependencies = async (JSDependencies) => {
    try {
      let promises = [];
      for (let jsDependency of JSDependencies) {
        promises.push(
          new Promise((resolve) => {
            let script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.defer = true;
            script.id = "";
            if (script.readyState) {
              // IE
              script.onreadystatechange = function () {
                if (
                  script.readyState == "loaded" ||
                  script.readyState == "complete"
                ) {
                  script.onreadystatechange = null;
                  resolve();
                }
              };
            } else {
              // Others
              script.onload = function () {
                resolve();
              };
            }
            script.src = jsDependency;
            document.getElementsByTagName("head")[0].appendChild(script);
          })
        );
      }
      await Promise.all(promises);
    } catch (E) {
      console.error(
        `Error in Bitespeed Popups: Error while loading JS dependencies: ${e}`
      );
    }
  };
}
class Popup {
  #popupHtml = {};
  #popupId = "";
  #popupType = "";
  #popupBehaviour = "";
  #popupTargeting = "";
  #browserService = null;
  #backendService = null;

  constructor(popupJson, browserService, backendService, view = "OpenView") {
    this.popupJson = popupJson;
    this.#popupHtml = JSON.parse(this.popupJson.popupHtml)[view];
    this.currentView = view;
    this.behaviour = popupJson.behaviour;
    this.#popupId = popupJson.id;
    this.#popupType = popupJson.type;
    this.#popupBehaviour = popupJson.behaviour;
    this.#popupTargeting = popupJson.targeting;
    this.#browserService = browserService;
    this.#backendService = backendService;
  }
  nextView = (e) => {
    console.log("Next View Button Clicked");
    document.querySelector(".u-popup-container").remove();
    //Check if complete view is present or any intermediate views
    let popupHtml = JSON.parse(this.popupJson.popupHtml);
    if (popupHtml["IntermediateView"] && this.currentView == "OpenView") {
      this.#popupHtml = popupHtml["IntermediateView"];
      this.currentView = "IntermediateView";
      this.show();
    } else if (
      popupHtml["CompletedView"] &&
      (this.currentView == "IntermediateView" || this.currentView == "OpenView")
    ) {
      this.#popupHtml = popupHtml["CompletedView"];
      this.currentView = "CompletedView";
      this.show();
    }
  };
  show = () => {
    document?.querySelector(".u-popup-container")?.remove();
    this.#popupHtml = this.#popupHtml.replace(/\\n/g, "");
    this.#popupHtml = this.#popupHtml.replace(/\`/g, "");
    if (this.#popupHtml)
      document.body.insertAdjacentHTML("beforeend", this.#popupHtml);

    this.#backendService.registerImpression(this.#popupId);
  };

  passWhereCondition = (where) => {
    switch (where.urlType) {
      case "all":
        return true;
      case "contains":
        return window.location.href.includes(where.url[0]);
      case "specificUrls":
        return where.url.includes(window.location.href);
      case "allExceptthese":
        return !where.url.includes(window.location.href);
    }
  };

  passWhoCondition = (who) => {
    //TODO
    return true;
  };

  greenLight = async () => {
    console.log(this);
    await new Promise((giveGreenLight, giveRedLight) => {
      if (
        true ||
        (this.passWhereCondition(this.behaviour.where) &&
          this.passWhoCondition(this.behaviour.who))
      ) {
        if (this.behaviour.When.selected === "Show immediately on page load")
          giveGreenLight();
        if (this.behaviour.When.selected === "X seconds after page load") {
          setTimeout(() => {
            giveGreenLight();
          }, this.behaviour.When.attributes * 1000);
        }
        if (this.behaviour.When.selected === "After scrolling X% of the page") {
          window.addEventListener("scroll", () => {
            const scrollTop = document.documentElement.scrollTop;
            const docHeight = Math.max(
              document.body.clientHeight,
              document.body.scrollHeight ? document.body.scrollHeight : 0
            );
            const winHeight = document.documentElement.clientHeight;
            const scrollPercent = scrollTop / (docHeight - winHeight);
            const scrollPercentRounded = Math.round(scrollPercent * 100);
            if (scrollPercentRounded >= this.behaviour.When.attributes) {
              giveGreenLight();
            }
          });
        }
        if (this.behaviour.When.selected === "When user is leaving a page") {
          window.addEventListener("mouseout", (e) => {
            if (e.clientY < 0) {
              giveGreenLight();
            }
          });
        }
        if (this.behaviour.When.selected === "afterClick") {
          window.addEventListener("click", (e) => {
            giveGreenLight();
          });
        }
      } else {
        giveRedLight();
      }
    });
  };

  handleClose = () => {
    //TODO
  };
  handleConversion = () => {
    this.#backendService.registerConversion(this.#popupId);
  };
}

class STWPopup extends Popup {
  constructor(popupJson) {
    super(popupJson);
  }
  show = () => {
    //TODO
  };
}
class VisualPopup extends Popup {
  constructor(popupJson, browserService, backendService) {
    super(popupJson, browserService, backendService);
  }
  //   show = () => {
  //     //TODO
  //   };
}
class ChatWidgetPopup extends Popup {
  constructor(popupJson) {
    super(popupJson);
  }
  show = () => {
    //TODO
  };
}

class PopupFactory {
  #browserService = null;
  #backendService = null;

  #getPopup = (popupJson) => {
    switch (popupJson.type) {
      case "STW":
        return new STWPopup(
          popupJson,
          this.#browserService,
          this.#backendService
        );
      case "visual popup":
        return new VisualPopup(
          popupJson,
          this.#browserService,
          this.#backendService
        );
      case "CHAT_WIDGET":
        return new ChatWidgetPopup(
          popupJson,
          this.#browserService,
          this.#backendService
        );
    }
  };

  constructor(browserService, backendService) {
    this.#browserService = browserService;
    this.#backendService = backendService;
  }

  getPopups = (popupJsons) => {
    let popups = {};
    let blockedPopups = this.#browserService.getBlockedPopups();
    for (let popupJson of popupJsons) {
      let popupId = popupJson.id;
      if (blockedPopups.includes(popupId)) {
        continue;
      }
      popups[`${popupId}:bitespeed_popup`] = this.#getPopup(popupJson);
    }
    return popups;
  };
}

class BackendService {
  #shopDomain = "";
  #browserId = "";

  constructor({ shopDomain, browserId }) {
    this.#shopDomain = shopDomain;
    this.#browserId = browserId;
    this.API = new API();
  }
  getStorePopups = async () => {
    try {
      //change_this
      const response = await this.API.get(
        "/getPopups",
        "shopurl=testdomain.com"
      );
      console.log(response);
      if (response && response.storePopups && response.storePopups.Items) {
        return response.storePopups.Items;
      }
    } catch (e) {
      console.error(
        `Error in Bitespeed Popups: Error while fetching popups: ${e}`
      );
    }
  };
  registerImpression = (popupId) => {
    this.API.post("/impressionsInvoker", {
      id: Util.create_UUID(),
      type: "impression",
      popupId,
      browserId: this.#browserId,
      shopUrl: this.#shopDomain,
      createdAt: new Date().getTime(),
    });
  };
  registerConversion = (popupId, data) => {
    this.API.post("/impressionsInvoker", {
      id: Util.create_UUID(),
      type: "conversion",
      popupId,
      browserId: this.#browserId,
      shopUrl: this.#shopDomain,
      ...data,
      createdAt: new Date().getTime(),
    });
  };
}
const getJSDependencies = () => {
  return [
    "https://unpkg.com/axios/dist/axios.min.js",
    "https://cdn.bitespeed.co/whatsapp-snippets/intlTelInput.min.js",
    "https://cdn.bitespeed.co/whatsapp-snippets/utils.js",
  ];
};
const getCSSDependencies = () => {
  if (BrowserService.isPhone) {
    return [
      "https://cdn.bitespeed.co/snippets/bitespeed-popup-mob-min.css",
      "https://cdn.bitespeed.co/whatsapp-snippets/demo.css",
      "https://cdn.bitespeed.co/snippets/custom-1.css",
    ];
  } else {
    return [
      "https://cdn.bitespeed.co/snippets/bitespeed-popup-min.css",
      "https://cdn.bitespeed.co/whatsapp-snippets/demo.css",
      "https://cdn.bitespeed.co/snippets/custom-1.css",
    ];
  }
};
(async () => {
  console.log("Bitespeed Popups Here");
  try {
    let browserService = await BrowserService.build({
      JSDependencies: getJSDependencies(),
      CSSDependencies: getCSSDependencies(),
    });
    let backendService = new BackendService({
      shopDomain: browserService.getShopDomain(),
      browserId: browserService.getBrowserId(),
    });
    let popupJsons = await backendService.getStorePopups();
    console.log(popupJsons);
    let popupFactory = new PopupFactory(browserService, backendService);
    bitespeed_popups = popupFactory.getPopups(popupJsons);
    console.log(bitespeed_popups);
    for (let popupId in bitespeed_popups) {
      console.log(popupId, bitespeed_popups[popupId]);
      await bitespeed_popups[popupId].greenLight();
      bitespeed_popups[popupId].show();
      currentPopup = bitespeed_popups[popupId];
    }
  } catch (e) {
    console.error(`Error in Bitespeed Popups: ${e} ${e.stack}`);
  }
})();

console.log("Bitespeed Popups");

// Adding Custom functions here, these are to be called by unlayer buttons/links.

const spin_IT = function (transitionTime) {
  let main_spin_plate = document.getElementById("container_stw_aj");
  let btn_Spinner = document.getElementById("bitespeed-spin");
  let number_rotationDegree = Math.ceil(Math.random() * 1000) + 5000;

  console.log(btn_Spinner, number_rotationDegree, main_spin_plate);
  if (btn_Spinner && main_spin_plate) {
    main_spin_plate.style.transform =
      "rotate(" + number_rotationDegree + "deg)";
  }
  setTimeout(() => {
    nextView();
  }, transitionTime * 1000 + 1000);
};

function nextView() {
  let id = currentPopup.popupJson.id;
  bitespeed_popups[`${id}:bitespeed_popup`].nextView();
}

// https://stackoverflow.com/questions/40140149/use-async-await-with-array-map
