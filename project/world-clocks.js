const localeOffsetNZ = "+13:00"
const localeNameNZ = "Pacific/Auckland"

let offsets = {
    "America/New York": "-05:00",
    "Argentina/Buenos_Aires": "-03:00",
    "America/Los_Angeles": "-08:00",
    "America/Denver": "-6:00",
    "Europe/London": "+00:00",
    "Europe/Moscow": "+03:00",
    "Japan": "+09:00",
    "Pacific/Chatham": "+12:45",
    "Pacific/Pitcairn": "-08:00",
    "Pacific/Port_Moresby": "+10:00",
    "Pacific/Rarotonga": "-10:00",
    "ROK": "+09:00",
}
let clocks = {}
let clockUpdateInterval

const initialize = function() {
    const selection = document.querySelector("#select-locales")
    for (const o in offsets) {
        const ele = document.createElement("option")
        ele.value = o
        ele.innerHTML = o
        selection.appendChild(ele)
    }
    let dt = getDtByLocale(localeOffsetNZ)
    console.log(dt.getUTCHours())
    clocks[localeNameNZ] = dt
    clockUpdateInterval = setInterval(function() {
        updateClocks()
        renderClocks()
    }, 1000)
}

const getDtByLocale = function(locale) {
    let dt = new Date()
    let dtLocale = new Date(dt.toISOString().replace("Z", locale))
    return dtLocale
}

const updateClocks = function() {
    let dt = new Date()
    // for each offset, replace the clock
    for (const l in clocks) {
        let tz
        if (l === localeNameNZ){
            tz = localeOffsetNZ
        } else {
            tz = offsets[l]
        }
        let dtNew = new Date(dt.toISOString().replace("Z", tz))
        clocks[l] = dtNew
    }
}

const renderClocks = function() {
    for (const l in clocks) {
        const element = document.querySelector(`#${l.replace(" ", "-").replace("/", "-")}`)
        if (element !== undefined && element !== null) {
            const dt = clocks[l]
            // TODO: dt currently in UTC, fix to show correct time.
            let h = dt.getUTCHours()
            if (h === 24) {
                h = 00
            }
            element.querySelector(".hours").innerHTML = h.toString().padStart(2, "0")
            element.querySelector(".minutes").innerHTML = dt.getMinutes().toString().padStart(2, "0")
            element.querySelector(".seconds").innerHTML = dt.getSeconds().toString().padStart(2, "0")
        }
    }
}

const addClock = function() {
    const localeName = document.querySelector("#select-locales").value
    if (!(localeName in clocks)) {
        const template = document.querySelector("#template-world-clock")
        const ele = template.content.cloneNode(true).querySelector("section.world-clock")
        ele.id = localeName.replace("/", "-").replace(" ", "-")
        const localeGmt = offsets[localeName]
        ele.querySelector(".locale").innerHTML = localeName
        ele.querySelector(".gmt").innerHTML = localeGmt
        let button = ele.querySelector(".remove button")
        button.setAttribute("onclick",`removeClock("${localeName}")`)

        let dt = getDtByLocale(localeGmt)
        clocks[localeName] = dt
        const parent = document.querySelector("#clocks")
        parent.insertBefore(ele, parent.children[parent.children.length-1])
    }
}

const removeClock = function(locale) {
    const ele = document.querySelector(`#${locale.replace(" ", "-").replace("/", "-")}`)
    document.querySelector("#clocks").removeChild(ele)
    delete clocks[locale]
}

window.onload = initialize