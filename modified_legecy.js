function loadScript(url, callback, async = true, defer = false, id = "") {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = async;
  script.defer = defer;
  script.id = id;
  if (script.readyState) {
    // IE
    script.onreadystatechange = function () {
      if (script.readyState == "loaded" || script.readyState == "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    // Others
    script.onload = function () {
      callback();
    };
  }
  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

var showWAChatWidget;
var waHandler;
var hideWAChatWidget;
var setClass;
var hidePopup;
var closeWheel;
var getSpinTheWheelCode;
const pickScript = () => {
  const whatsappFunc = async () => {
    console.log("WHATSAPP RAN()--");
    var indexOfwww = location.hostname.indexOf("www");
    var shopDomainStripped =
      indexOfwww === -1
        ? "." + location.hostname
        : location.hostname.substr(indexOfwww + 3);
    var globalShopUrl =
      indexOfwww === -1
        ? location.hostname
        : location.hostname.substr(indexOfwww + 4);

    let globalPopups;
    let globalWAPageId;
    let globalPhoneNoObjs = {};
    const closedPopups = [];
    let globalFinalHtml;
    let globalPageId;
    var noRepeat = "";
    let spaceReplacedDiscountCode;
    let discountCode;
    let discountText;
    let globalDegree;
    let isLogsEnabled;
    const popups = {};

    (async function () {
      try {
        //WHATSAPP
        await getFinalHtml();
        loadScript("https://unpkg.com/axios/dist/axios.min.js", () => {});
        loadScript(
          "https://cdn.bitespeed.co/whatsapp-snippets/intlTelInput.min.js",
          () => {
            // console.log("intlTell loaded");
          }
        );
        loadScript(
          "https://cdn.bitespeed.co/whatsapp-snippets/utils.js",
          () => {
            // console.log("util.js loaded");
            appendAll();
          }
        );
        // console.log("intlTell loaded");
        // }
      } catch (err) {
        console.log("Error while loading Bitespeed popup script");
        console.log(err);
      }
    })();

    function loadScript(url, callback, async = true, defer = false, id = "") {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = async;
      script.defer = defer;
      script.id = id;
      if (script.readyState) {
        // IE
        script.onreadystatechange = function () {
          if (
            script.readyState == "loaded" ||
            script.readyState == "complete"
          ) {
            script.onreadystatechange = null;

            callback();
          }
        };
      } else {
        // Others
        script.onload = function () {
          callback();
        };
      }
      script.src = url;
      document.getElementsByTagName("head")[0].appendChild(script);
    }

    // Load the script
    async function appendAll() {
      // $(async() => {
      // document.addEventListener("DOMContentLoaded", async() => {
      var tempDisplayedPopups = getCookie("displayedPopups");

      if (tempDisplayedPopups) {
        try {
          noRepeat = JSON.parse(tempDisplayedPopups);
        } catch (err) {
          noRepeat = tempDisplayedPopups;
        }
        //   console.log("IN APPEND ALL");
      }
      appendCSS();
      await renderPopups();
      // });
    }

    function create_UUID() {
      var e = new Date().getTime();
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (t) {
          var o = (e + 16 * Math.random()) % 16 | 0;
          return (
            (e = Math.floor(e / 16)), ("x" == t ? o : (3 & o) | 8).toString(16)
          );
        }
      );
    }

    function appendCSS() {
      // console.log("IN APPEND CSS");
      var links;
      if (window.innerWidth < 768) {
        links =
          '<link rel="stylesheet" href="https://cdn.bitespeed.co/snippets/bitespeed-popup-mob-min.css"> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css"> <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">';
      } else {
        links =
          '<link rel="stylesheet" href="https://cdn.bitespeed.co/snippets/bitespeed-popup-min.css"> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css"> <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">';
      }
      //WHATSAPP
      links +=
        '<link rel="stylesheet" href="https://cdn.bitespeed.co/whatsapp-snippets/demo.css">';
      links +=
        '<link rel="stylesheet" href="https://cdn.bitespeed.co/whatsapp-snippets/intlTelInput.min.css">';
      links +=
        '<link rel="stylesheet" href="https://cdn.bitespeed.co/whatsapp-snippets/bitespeed-wa.css">';
      try {
        // $("head").append(links);
        document.head.insertAdjacentHTML("beforeend", links);
        //   console.log("SUCCESSFULLY APPENDED CSS");
      } catch (err) {
        console.log("Error while appending CSS ", err);
      }
    }

    function isValidObj(obj) {
      if (
        obj === null ||
        obj === "null" ||
        obj === "" ||
        obj === undefined ||
        obj === "undefined"
      )
        return false;
      return true;
    }

    function setCookie(name, value) {
      document.cookie =
        name + "=" + value + ";domain=" + shopDomainStripped + "; path=/";
    }

    function setCookieWithExpiry(name, value, days) {
      let currDate = new Date();
      currDate.setTime(currDate.getTime() + 24 * days * 60 * 60 * 1000);
      document.cookie =
        name + "=" + value + ";expires=" + currDate.toUTCString();
    }

    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length == 2) return parts.pop().split(";").shift();
    }

    function makeid(len) {
      var id = [];
      var letters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var n = letters.length;
      for (let i = 0; i < len; i++) {
        id.push(letters.charAt(Math.floor(Math.random() * n)));
      }
      return id.join("");
    }

    // generates unique user ID and sets "refb" cookie; Returns uuid
    function createRef() {
      let uuid = create_UUID();
      document.cookie =
        "refb=" +
        uuid +
        ";expires=" +
        new Date(new Date().setFullYear(new Date().getFullYear() + 10)) +
        ";domain=" +
        shopDomainStripped +
        "; path=/";
      return uuid;
    }

    // sends impression to db, updates noRepeat, sets "displayedPopups" cookie
    async function sendImpression(impression, id) {
      if (!noRepeat.includes(impression)) {
        noRepeat = noRepeat + "+" + impression;
        try {
          let res = await axios({
            method: "post",
            url: `https://9pkplnrgv3.execute-api.us-east-1.amazonaws.com/prod/conversionAndImpressionHandler?id=${id}&field=impressions`,
          });
          setCookie("displayedPopups", noRepeat);
          if (res.status != 200) {
            throw res.data; // throws the error message
          }
          // if (isLogsEnabled) console.log(res.data);
        } catch (err) {
          if (isLogsEnabled) console.log("Error while sending impression", err);
          throw err;
        }
      }
    }

    // sends WA text based on shopUrl(language) and display width
    function sendWAText(id) {
      let text = encodeURIComponent(
        "https://" +
          window.location.hostname +
          window.location.pathname +
          "\n\n" +
          globalPopups[id].generalSettings.defaultText
      );
      // handle text in other languages
      switch (globalWAPageId) {
        case "dogal-koy-sepetim.myshopify.com":
          text = encodeURIComponent(
            "Ürünleriniz hakkında detaylı bilgi alabilir miyim ?"
          );
          break;
        case "2b-eco.myshopify.com":
          text = encodeURIComponent("Pode me ajudar?");
          break;
        case "leginfi.myshopify.com":
          text = encodeURIComponent(
            "Estoy interesado en este producto y tengo algunas preguntas. ¿Pueden ayudarme?"
          );
          break;
      }
      if (window.innerWidth < 768) {
        window.open(
          "https://api.whatsapp.com/send?phone=" +
            globalPopups[id].generalSettings.supportNumber.replace("-", "") +
            "&text=" +
            text
        );
        //   if (isLogsEnabled) console.log("SENT WA TEXT", " device=mobile");
      } else {
        window.open(
          "https://web.whatsapp.com/send?phone=" +
            globalPopups[id].generalSettings.supportNumber.replace("-", "") +
            "&text=" +
            text
        );
        //   if (isLogsEnabled) console.log("SENT WA TEXT", " device=desktop");
      }
    }

    // Called when 'send' button of any Opt-in tools is clicked
    // collects phoneNo and data, and dispatches new 'message' event
    waHandler = (data, id, isChatWidget = false) => {
      if (isChatWidget) {
        //   if (isLogsEnabled) console.log("SENDING WA TEXT");
        sendWAText(id);
      }

      let phoneNo = globalPhoneNoObjs[id].getNumber();
      phoneNo = phoneNo.replace("+", "");
      phoneNo = phoneNo.replace("-", "");
      if (
        (phoneNo.slice(0, 2) == 91 && phoneNo.slice(2).length != 10) ||
        phoneNo.match(/^[0-9]+$/) == null ||
        phoneNo.match(/^[0-9]+$/) == null
      ) {
        return;
      }
      // if (isLogsEnabled) console.log("THIS IS PHONE NUMBER", phoneNo);

      let dataStr = JSON.stringify(data.split("."));

      let event = new CustomEvent("message", {
        detail: {
          isWA: true,
          data: dataStr,
          phoneNo: phoneNo,
        },
      });
      window.dispatchEvent(event);
    };

    showWAChatWidget = (id) => {
      // console.log("whatsapp showWaChatWidget");
      if (globalPopups[id].generalSettings.collectPhone) {
        if (document.querySelector("#wa-chat-bubble")) {
          document.querySelector("#wa-chat-bubble").style.display = "block";
          document
            .querySelector("#wa-chat-bubble")
            .classList.remove("bounceDown");
          document.querySelector("#wa-chat-bubble").classList.add("bounceUp");
          document.querySelector("#wa-chat-btn-root").style.display = "none";
          return;
        }
      } else {
        sendWAText(id);
      }
    };

    hideWAChatWidget = () => {
      if (document.querySelector("#wa-chat-btn-root")) {
        document.querySelector("#wa-chat-btn-root").style.display = "block";
        document.querySelector("#wa-chat-bubble").classList.remove("bounceUp");
        document.querySelector("#wa-chat-bubble").classList.add("bounceDown");
        document.querySelector("#wa-chat-bubble").style.display = "none";
        return;
      }
    };

    // calls the 'popupHtml' lambda function and initializes values of global variable
    async function getFinalHtml() {
      let uuid = getCookie("refb");
      if (!isValidObj(uuid)) {
        uuid = createRef();
      }
      // initializes globalDegree variables
      globalDegree = 900 + Math.random() * 1080;
      // console.log("THIS WILLL TRIGGER THE LAMBDA");
      //  Access-Control-Allow-Origin
      try {
        var res = await axios({
          method: "get",
          url: "http://35.168.147.231:3005/automation/getPopupHtml?TableName=newPopupHtml&shopUrl=POC shopurl",
          headers: { "access-control-allow-origin": "*" },
        });
        console.log(res?.data);
      } catch (error) {
        console.log(" in better form: ", error);
      }
      res = res;

      // initialize global variables
      globalFinalHtml = res?.data?.Items;
      globalPopups = res?.data?.Items;
      globalWAPageId = res?.data.shopUrl;
      globalPageId = "390assda-1-2248324320sofjsd";
      isLogsEnabled = false;
      if (res.spinTheWheelObj) {
        discountCode = res.spinTheWheelObj.code;
        spaceReplacedDiscountCode = discountCode.split(" ").join("bsp");
        discountText = res.spinTheWheelObj.text;
      }
    }

    // function appendHtml(finalHtml) {
    //   // if (isLogsEnabled) console.log("IN APPEND HTML");
    //   for (let i = 0; i < finalHtml.length; i++) {
    //     finalHtml[i] = unescape(finalHtml[i]);
    //     finalHtml[i] = finalHtml[i].replace(/\\n/g, "");
    //     finalHtml[i] = finalHtml[i].replace(/\`/g, "");
    //     if (finalHtml[i])
    //       // $("body").append(finalHtml[i]);
    //       document.body.insertAdjacentHTML("beforeend", finalHtml[i]);
    //   }
    // }

    function appendHtml(finalHtml) {
      // if (isLogsEnabled) console.log("IN APPEND HTML");
      finalHtml = finalHtml.replace(/\\n/g, "");
      finalHtml = finalHtml.replace(/\`/g, "");
      if (finalHtml) document.body.insertAdjacentHTML("beforeend", finalHtml);
    }

    async function popupDisplayDecider(popup, id, popupType) {
      try {
        if (popup.behaviour.when.showAt == "exit") {
          await displayOnExit(popupType, id);
        }
        if (
          popup.behaviour.when.showAt == "time" ||
          popup.behaviour.when.showAt == "welcome"
        ) {
          await displayWithTime(popupType, popup.behaviour.when.value, id);
        }
        if (popup.behaviour.when.showAt == "scroll") {
          await displayOnScroll(popupType, popup.behaviour.when.value, id);
        }
      } catch (err) {
        throw err;
      }
    }

    async function renderPopups() {
      let userId = getCookie("BS_UNIQUE_USER_ID");
      if (!isValidObj(userId)) {
        let currDate = new Date();
        setCookieWithExpiry(
          "BS_UNIQUE_USER_ID",
          (userId = String(currDate.getTime()) + makeid(10)),
          15
        );
      }

      try {
        keys = Object.keys(globalPopups);
        globalPopups.forEach(async (popup) => {
          console.log("popup = ", popup);

          if (popup) {
            let optedInWA = String(getCookie("bitespeedOptedInWA"));
            // ARMAAN_AJ change this logic. Remove true
            if (
              true ||
              !(
                isValidObj(optedInWA) &&
                globalPopups[keys[0]].behaviour.who.showAt == "unOpted"
              ) ||
              globalPopups[keys[0]].behaviour.who.showAt != "unOpted"
            ) {
              //RENDERING WHATSAPP POPUPS
              if (isLogsEnabled) console.log("RENDERING WHATSAPP POPUPS");
              // append all the html strings
              // ARMAAN_AJ change this logic. Make view dynamic and/or in an order
              const toBeAppended = JSON.parse(popup?.popupHtml)?.OpenView;
              console.log("appending html", toBeAppended);
              appendHtml(toBeAppended);

              // iterate over each active popup
              //   keys.forEach(async (popupId) => {
              //     //   console.log("is logs enabled = ", isLogsEnabled);
              //     await renderPopup(globalPopups, globalPopups[popupId], popupId);
              //   });
            } else {
              console.log(
                "Show to unopted - user is " + isValidObj(optedInWA)
                  ? "opted "
                  : "unopted " + "Still show whatsapp"
              );
              appendHtml(globalFinalHtml);
              keys.forEach(async (popupId) => {
                if (globalPopups[popupId].type == "customerChatWidget")
                  await renderPopup(
                    globalPopups,
                    globalPopups[popupId],
                    popupId
                  );
              });
            }
          }
        });
      } catch (err) {
        if (isLogsEnabled) console.log(err);
        appendHtml(globalFinalHtml);
      }
    }

    async function renderPopup(popups, popup, id) {
      // persistent pill
      if ("collapsed" in popup) {
        if (!noRepeat.includes(id)) {
          // console.log("Before calling sendImpression");
          await sendImpression("pillImpressionSent", id);
          if (isLogsEnabled)
            console.log("RENDERING PERSISTENT DISCOUNT WIDGET");
        }
      }
      // customer chat widget
      else if (
        popup.type == "customerChatWidget" ||
        popup.type == "customerChatWidgetWA"
      ) {
        await sendImpression("widgetImpressionSent", id);
        if (typeof FB !== "undefined") FB.XFBML.parse();
        if (isLogsEnabled) console.log("RENDERING CUSTOMER CHAT WIDGET");
      } else if (popup.type == "orderUpdates") {
        try {
          // TODO: verify if this is correct, orderUpdates not working
          let res = await axios({
            method: "post",
            url: `https://9pkplnrgv3.execute-api.us-east-1.amazonaws.com/prod/conversionAndImpressionHandler?id=${id}&field=impressions`,
          });
          if (res.status != 200) {
            throw res.data; // throws the error message
          }

          if (isLogsEnabled) console.log("SUCCESFULLY SENT ORDER UPDATE");
        } catch (err) {
          if (isLogsEnabled)
            console.log("Error while sending order updates ", err);
          // throw err;
        }
      }
      // visual popup or spin the wheel
      else if (popup.open) {
        try {
          switch (popup.open.type) {
            case "modalImageAtTop":
              await popupDisplayDecider(popup, id, "visualPopupImageAtTop");
              break;
            case "modalImageBehind":
              await popupDisplayDecider(popup, id, "visualPopupImageBehind");
              break;
            case "modalImageAtRight":
              await popupDisplayDecider(popup, id, "visualPopupImageAtRight");
              break;
            case "spinTheWheel":
            case "spinTheWheelWA":
              wheelLoad(popups, popup.id);
              await popupDisplayDecider(popup, id, "wheelContainer");
              break;
            default:
              break;
          }
        } catch (err) {}
      }

      //WHATSAPP
      try {
        if (globalPopups[id].channel == "WA") {
          if (isLogsEnabled) console.log("IN intlTelInput handler");
          let input = document.querySelector("#bitespeed-phone-" + id);
          let telClassName = "";
          if (popup.type == "customerChatWidget") {
            telClassName = "bitespeed-phone-customer-chat-widget";
          }
          let iti = await window.intlTelInput(input, {
            geoIpLookup: async function (callback) {
              const data = await axios.get(
                "https://get.geojs.io/v1/ip/country.json"
              );
              if (data && data.country) callback(data.country);
              else callback("IN");
            },
            initialCountry: "auto",
            separateDialCode: true,
            customContainer: telClassName,
          });
          if (popup.type == "customerChatWidget") {
            // $("#wa-chat-bubble").css('display', 'none');
            // $("#wa-chat-bubble").css('visibility', 'initial');
            document.querySelector("#wa-chat-bubble").style.display = "none";
            document.querySelector("#wa-chat-bubble").style.visibility =
              "initial";
          }
          // globalPhoneNoObjs initialized here
          globalPhoneNoObjs[id] = iti;
          if (isLogsEnabled) console.log("intlTelInput HANDLED SUCCESSFULLY");
        }
      } catch (err) {
        if (isLogsEnabled)
          console.error("Error while handling intlTelInput", err);
      }
    }

    setClass = (popupPosition, id) => {
      const keys = Object.keys(globalPopups);
      let type;
      let classLayout;
      for (let i = 0; i < keys.length; i++) {
        if ("collapsed" in globalPopups[keys[i]]) {
          type = globalPopups[keys[i]].open.type;
          break;
        }
      }
      if (type == "modalImageAtTop") classLayout = "popupImageAtPillClick";
      else classLayout = "popupImageAtPillClickBehind";

      document.getElementById(
        classLayout
      ).className = `popup onPillClick p${popupPosition}`;
      document.getElementById("pillPopup").style.display = "flex";
      document.getElementById("permanentPill").style.display = "none";
    };

    async function displayOnExit(popupType, id) {
      document.addEventListener(
        "mouseleave",
        async (e) => {
          if (e.y <= 0 && !closedPopups.includes(popupType)) {
            if (!noRepeat.includes(id)) {
              if (popupType == "wheelContainer") {
                document.getElementById("wheelContainer").style.transform =
                  "translate(100%, 0)";
              } else {
                $(`#${popupType}`).fadeIn();
              }
              try {
                await sendImpression(id, id);
              } catch (err) {
                throw err;
              }
            }
          }
        },
        false
      );
    }

    async function displayOnScroll(popupType, percentage, id) {
      window.addEventListener("scroll", async () => {
        // const scrollTop = $(window).scrollTop();
        const scrollTop = document.documentElement.scrollTop;
        // const docHeight = $(document).height();
        const docHeight = Math.max(
          document.body.clientHeight,
          document.body.scrollHeight ? document.body.scrollHeight : 0
        );
        // const winHeight = $(window).height();
        const winHeight = document.documentElement.clientHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100);
        if (
          scrollPercentRounded > percentage &&
          !closedPopups.includes(popupType)
        ) {
          if (!noRepeat.includes(id)) {
            if (popupType == "wheelContainer") {
              document.getElementById("wheelContainer").style.transform =
                "translate(100%, 0)";
            } else {
              document.getElementById(`${popupType}`).style.display = "flex";
            }
            try {
              await sendImpression(id, id);
            } catch (err) {
              throw err;
            }
          }
        }
      });
    }

    async function displayWithTime(popupType, time, id) {
      setTimeout(async () => {
        if (!noRepeat.includes(id)) {
          if (popupType == "wheelContainer") {
            document.getElementById("wheelContainer").style.transform =
              "translate(100%, 0)";
          } else {
            // $(`#${popupType}`).fadeIn();
            // TODO: is fadeIn required?
            document.getElementById(`${popupType}`).style.display = "flex";
          }
          try {
            await sendImpression(id, id);
          } catch (err) {
            throw err;
          }
        }
      }, time * 1000);
    }

    hidePopup = (popupType) => {
      // $(`#${popupType}`).css("display", "none");
      document.getElementById(`${popupType}`).style.display = "none";
      if (popupType === "permanentPill") {
        document.getElementById("pillPopup").style.display = "none";
      }
      // initializes and modifies closedPopups
      closedPopups.push(popupType);
    };

    closeWheel = () => {
      document.getElementById("wheelContainer").style.transform =
        "translate(0%, 0)";
    };

    function spin(degree) {
      const finalAngles = [];
      let winningValue;
      const dash1 = `${degree + 15}deg`;
      finalAngles.push((degree + 15) % 360);
      const dash2 = `${degree + 45}deg`;
      finalAngles.push((degree + 45) % 360);
      const dash3 = `${degree + 75}deg`;
      finalAngles.push((degree + 75) % 360);
      const dash4 = `${degree + 105}deg`;
      finalAngles.push((degree + 105) % 360);
      const dash5 = `${degree + 135}deg`;
      finalAngles.push((degree + 135) % 360);
      const dash6 = `${degree + 165}deg`;
      finalAngles.push((degree + 165) % 360);
      const dash7 = `${degree + 195}deg`;
      finalAngles.push((degree + 195) % 360);
      const dash8 = `${degree + 225}deg`;
      finalAngles.push((degree + 225) % 360);
      const dash9 = `${degree + 255}deg`;
      finalAngles.push((degree + 255) % 360);
      const dash10 = `${degree + 285}deg`;
      finalAngles.push((degree + 285) % 360);
      const dash11 = `${degree + 315}deg`;
      finalAngles.push((degree + 315) % 360);
      const dash12 = `${degree + 345}deg`;
      finalAngles.push((degree + 345) % 360);
      const spinAngle = `${degree}deg`;
      for (let i = 0; i < 12; i++) {
        if (finalAngles[i] > 300 && finalAngles[i] < 330) {
          const num = String(6);
          setTimeout(() => {}, 3000);
          winningValue = i + 1;
        }
      }
      document.getElementById("dash-1").style.transform = `rotateZ(${dash1})`;
      document.getElementById("dash-2").style.transform = `rotateZ(${dash2})`;
      document.getElementById("dash-3").style.transform = `rotateZ(${dash3})`;
      document.getElementById("dash-4").style.transform = `rotateZ(${dash4})`;
      document.getElementById("dash-5").style.transform = `rotateZ(${dash5})`;
      document.getElementById("dash-6").style.transform = `rotateZ(${dash6})`;
      document.getElementById("dash-7").style.transform = `rotateZ(${dash7})`;
      document.getElementById("dash-8").style.transform = `rotateZ(${dash8})`;
      document.getElementById("dash-9").style.transform = `rotateZ(${dash9})`;
      document.getElementById("dash-10").style.transform = `rotateZ(${dash10})`;
      document.getElementById("dash-11").style.transform = `rotateZ(${dash11})`;
      document.getElementById("dash-12").style.transform = `rotateZ(${dash12})`;
      document.getElementById(
        "dash-act"
      ).style.transform = `rotateZ(${spinAngle})`;
      document.getElementById(
        "wheelLogo"
      ).style.transform = `rotateZ(${spinAngle})`;
      if (isLogsEnabled) console.log("SPINNING THE WHEEL");
    }

    function wheelLoad(popups, id) {
      const { length } = popups[id].data;
      let dataIndex = 0;
      for (let i = 0; i < 12; i++) {
        if (dataIndex === length) {
          dataIndex = 0;
        }

        const div = document.createElement("div");
        div.className = `dash dash${i + 1}`;
        const currentDiv = `dash-${i + 1}`;
        div.id = currentDiv;
        document.getElementById("wheelContainer").appendChild(div);
        document.getElementById(currentDiv).style.fontFamily =
          popups[id].open.props.offerFont;
        if (popups[id].dashColorLight) {
          if ((i + 1) % 2 === 0) {
            document.getElementById(currentDiv).style.color =
              popups[id].dashColorLight;
          } else {
            document.getElementById(currentDiv).style.color =
              popups[id].dashColorDark;
          }
        }
        const innerDiv = document.createElement("div");
        innerDiv.innerHTML = `${popups[id].data[dataIndex].text}`;
        innerDiv.className = "dashInner";
        document.getElementById(currentDiv).appendChild(innerDiv);
        if (window.innerWidth < 767) {
          document.getElementById(currentDiv).style.top = "85%";
          document.getElementById(currentDiv).style.left = "12.5vh";
        } else {
          document.getElementById(currentDiv).style.top = "80%";
          document.getElementById(currentDiv).style.left = "19vh";
        }

        dataIndex += 1;
      }
    }

    window.addEventListener("message", async (message) => {
      try {
        let res;
        if (message.detail && message.detail.EUCustomer) {
          res = JSON.parse(message.detail.data);
        } else if (message.detail && message.detail.isWA) {
          res = JSON.parse(message.detail.data);
          await axios.post("https://app.bitespeed.co/fbWebhook", {
            object: "page",
            channel: "WA",
            entry: [
              {
                id: globalWAPageId,
                time: new Date().getTime(),
                messaging: [
                  {
                    recipient: {
                      id: globalWAPageId,
                    },
                    timestamp: new Date().getTime(),
                    sender: {
                      id: message.detail.phoneNo,
                    },
                    optin: {
                      ref: res.join("."),
                    },
                  },
                ],
              },
            ],
          });
          let queryRes = await axios({
            method: "post",
            url: `https://9pkplnrgv3.execute-api.us-east-1.amazonaws.com/prod/conversionAndImpressionHandler?id=${res[0]}&field=conversions`,
          });
          if (queryRes.status != 200) {
            //   console.log("queryRes.status", queryRes)
            throw queryRes.data; // throws the error message
          }
          if (isLogsEnabled) console.log(queryRes.data);
        } else {
          // console.log("message","data", message.data);
          res = JSON.parse(JSON.stringify(message.data));
        }

        // make phone no container transparent
        try {
          let intlPhoneNoContainer = document
            .querySelector(`.${res[1]}`)
            .querySelector("#intlPhoneNoContainer");

          if (intlPhoneNoContainer) intlPhoneNoContainer.style.opacity = "0";
        } catch (e) {
          // console.log("BEST," ,e)
        }

        if (res[0] && globalPopups[res[0]] && res[1] != "customerChatWidget") {
          // console.log("ATLEAST HERE")
          var CookieDate = new Date();
          CookieDate.setFullYear(CookieDate.getFullYear() + 1);
          if (message.detail && message.detail.isWA) {
            //   console.log("MAYBE HERE")
            document.cookie =
              "bitespeedOptedInWA=true" +
              ";expires=" +
              CookieDate.toUTCString() +
              ";domain=" +
              shopDomainStripped +
              ";path=/";

            if (isLogsEnabled) console.log("COOKIE SET");
          } else {
            //   console.log("WAS HERE AT document.cookie = bitespeedOptedIn=true")
            document.cookie =
              "bitespeedOptedIn=true" +
              ";expires=" +
              CookieDate.toUTCString() +
              ";domain=" +
              shopDomainStripped +
              ";path=/";
          }
          if (
            res[1] == "masterContainerImageAtTopPhill" ||
            res[1] == "masterContainerImageBehindPhill"
          ) {
            noRepeat = noRepeat + "+" + res[0];
            setCookie("displayedPopups", noRepeat);
          }
          if (res[1] == "spinTheWheelContainer") {
            let tempTitle = globalPopups[res[0]].completed.props.title.text;
            if (tempTitle.indexOf("{OFFER WON}") !== -1) {
              setTimeout(() => {
                let completedTitle =
                  tempTitle.substr(0, tempTitle.indexOf("{OFFER WON}")) +
                  discountText +
                  tempTitle.substr(tempTitle.indexOf("{OFFER WON}") + 11);
                // $(`#${res[1]}title`).html(completedTitle);
                document.getElementById(`${res[1]}title`).innerHTML =
                  completedTitle;

                document.getElementById(`${res[1]}title`).style.color =
                  globalPopups[res[0]].completed.props.title.color;
                document.getElementById(`${res[1]}title`).style["font-family"] =
                  globalPopups[res[0]].completed.props.title.fontFamily;
              }, 3000);
            } else {
              document.getElementById(`${res[1]}title`).innerHTML =
                globalPopups[res[0]].completed.props.title.text;

              document.getElementById(`${res[1]}title`).style.color =
                globalPopups[res[0]].completed.props.title.color;
              document.getElementById(`${res[1]}title`).style["font-family"] =
                globalPopups[res[0]].completed.props.title.fontFamily;
            }

            setTimeout(() => {
              document.getElementById(`${res[1]}text`).innerHTML =
                "Discount Code - " + discountCode;
            }, 3000);

            document.getElementById(`${res[1]}text`).style.color =
              globalPopups[res[0]].completed.props.text.color;
            document.getElementById(`${res[1]}text`).style["font-family"] =
              globalPopups[res[0]].completed.props.text.fontFamily;

            document.getElementById(`${res[1]}wheelLogo`).src =
              globalPopups[res[0]].completed.props.wheelLogoUrl;

            if (document.getElementById(`${res[1]}heroLogo`))
              document.getElementById(`${res[1]}heroLogo`).src =
                globalPopups[res[0]].completed.props.heroLogo;
            spin(globalDegree);
          } else {
            document.getElementById(`${res[1]}title`).innerHTML =
              globalPopups[res[0]].completed.props.title.text;

            document.getElementById(`${res[1]}text`).style.color =
              globalPopups[res[0]].completed.props.title.color;
            document.getElementById(`${res[1]}text`).style["font-family"] =
              globalPopups[res[0]].completed.props.title.fontFamily;
            if (globalPopups[res[0]].discountOption == "Yes") {
              document.getElementById(`${res[1]}subtitle`).innerHTML =
                globalPopups[res[0]].generalSettings.discountCode;

              document.getElementById(`${res[1]}subtitle`).style["font-size"] =
                globalPopups[res[0]].completed.props.subtitle.fontSize + "vh";
            } else {
              document.getElementById(`${res[1]}subtitle`).innerHTML =
                globalPopups[res[0]].completed.props.subtitle.text;
            }

            document.getElementById(`${res[1]}subtitle`).style.color =
              globalPopups[res[0]].completed.props.subtitle.color;
            document.getElementById(`${res[1]}subtitle`).style["font-family"] =
              globalPopups[res[0]].completed.props.subtitle.fontFamily;

            // $(`#${res[1]}text`).html(globalPopups[res[0]].completed.props.text.text);
            document.getElementById(`${res[1]}text`).innerHTML =
              globalPopups[res[0]].completed.props.text.text;

            document.getElementById(`${res[1]}text`).style.color =
              globalPopups[res[0]].completed.props.text.color;
            document.getElementById(`${res[1]}text`).style["font-family"] =
              globalPopups[res[0]].completed.props.text.fontFamily;
            document.getElementById(`${res[1]}text`).style["font-size"] =
              globalPopups[res[0]].completed.props.text.fontSize + "vh";

            if (document.getElementById(`${res[1]}mainImage`))
              document.getElementById(`${res[1]}mainImage`).style[
                "background-image"
              ] = `url(${globalPopups[res[0]].completed.props.imageUrl})`;

            if (document.getElementById(`${res[1]}popupDiv`))
              document.getElementById(`${res[1]}popupDiv`).style[
                "background-image"
              ] = `url(${globalPopups[res[0]].completed.props.imageUrl})`;

            if (res[1] == "masterContainerImageBehindPhill") {
              if (document.getElementById("popupImageAtPillClick"))
                document.getElementById("popupImageAtPillClick").style[
                  "background-image"
                ] = `url(${globalPopups[res[0]].completed.props.imageUr})`;
            }

            if (document.getElementById(`${res[1]}textContainer`))
              document.getElementById(`${res[1]}textContainer`).style[
                "background-image"
              ] = globalPopups[res[0]].completed.props.content.backgroundColor;
          }
        }
      } catch (err) {
        // error
        if (isLogsEnabled) console.log("Error occured", err);
      }
    });
  };
  return whatsappFunc;
};

(async function () {
  loadScript("https://unpkg.com/axios/dist/axios.min.js", async () => {
    const script = pickScript();
    script();
  });
})();
