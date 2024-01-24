/* Global state */
let items = []
let filter = 'all'

/*
    deal with items data
*/
function itemUpdateDone(done, i) {
    items = items.map((item) => 
        i === item.i
            ? {...item, item: {...item.item, done}}
            : item
    )
}

function itemDelete(i) {
    items = items.reduce((items, item) => {
        if (i === item.i) return items

        items.push(item)
        return items
    }, []).map((item, i) => {
        return {...item, i}
    })
}

function itemAppend(item) {
    items.push({i: items.length, item})
}

function itemsDeleteDone() {
    items = items.reduce((itemsNotDone, item) => {
        if (item.item.done) return itemsNotDone

        itemsNotDone.push(item)

        return itemsNotDone
    }, []).map((item, i) => ({...item, i}))
}

/*
    Render the component
*/
function inputRender() {
    const inputEl = document.createElement("input")

    inputEl.classList.add("add")
    inputEl.setAttribute("type", "text")
    inputEl.placeholder = "What needs to be done"

    inputEl.addEventListener("keyup", (ev) => {
        // for .isComposing see https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event
        if (ev.isComposing || ev.code !== "Enter") return

        newItemCb(ev.currentTarget.value)
    })

    return inputEl
}

function makeFilterCb(cb, filterActiveClass) {
    return (ev) => {
        if (ev.target.classList.contains(filterActiveClass)) return
        console.log("filter cb, ev:", ev)

        cb()
    }
}

function controlsRender() {
    const container = document.createElement("div")
    const containerFilters = document.createElement("div")
    
    const filterClass = "filter", filterActiveClass = "active"

    const deleteDoneEl = document.createElement("button")
    const showAllEl = document.createElement("button")
    const showDoneEl = document.createElement("button")
    const showNotDoneEl = document.createElement("button")

    container.classList.add("controls")
    containerFilters.classList.add("filters")
    showAllEl.classList.add(filterClass)
    showDoneEl.classList.add(filterClass)
    showNotDoneEl.classList.add(filterClass)

    if ('all' === filter) {
        showAllEl.classList.add(filterActiveClass)
    } else if ('done' === filter) {
        showDoneEl.classList.add(filterActiveClass)
    } else {
        showNotDoneEl.classList.add(filterActiveClass)
    }

    deleteDoneEl.textContent = "delete"
    showAllEl.textContent = "all"
    showDoneEl.textContent = "done"
    showNotDoneEl.textContent = "active"

    deleteDoneEl.addEventListener("click", deleteDoneCb)
    showAllEl.addEventListener("click", makeFilterCb(showAllCb, filterActiveClass))
    showDoneEl.addEventListener("click", makeFilterCb(showDoneCb, filterActiveClass))
    showNotDoneEl.addEventListener("click", makeFilterCb(showNotDoneCb, filterActiveClass))

    const countersEl = countersRender()

    containerFilters.append(showAllEl, showDoneEl, showNotDoneEl)
    container.append(countersEl, containerFilters, deleteDoneEl)

    return container
}

function countersRender() {
    const counterClass = "counter"

    const container = document.createElement("div")
    const doneEl = document.createElement("span")
    const notDoneEl = document.createElement("span")

    doneEl.classList.add(counterClass)
    notDoneEl.classList.add(counterClass)

    doneEl.textContent = `${items.filter(item => item.item.done).length} items done`
    notDoneEl.textContent = `${items.filter(item => !item.item.done).length} items left`

    container.append(doneEl, notDoneEl)

    return container
}

function itemRender(item) {
    const container = document.createElement("li")
    const containerInput = document.createElement("div")
    const input = document.createElement("input")
    const label = document.createElement("label")
    const deleteBtn = document.createElement("button")

    container.classList.add("item")
    containerInput.classList.add("input-container")
    deleteBtn.classList.add("delete")

    input.setAttribute("type", "checkbox")
    input.id = item.i.toString()
    input.checked = item.item.done
    label.setAttribute("for", input.id)
    if (item.item.done) label.classList.add("checked")

    label.textContent = item.item.label
    deleteBtn.textContent = "delete"

    containerInput.append(input, label)
    container.append(containerInput, deleteBtn)
    
    containerInput.addEventListener("click", (ev) => {
        input.checked
            ? doneCb(item.i)
            : notDoneCb(item.i)
    })

    deleteBtn.addEventListener("click", () => {deleteCb(item.i)})

    return container
}

function itemsRender() {
    const container = document.createElement("ul")
    container.classList.add("items")

    const _items = filter === "all"
        ? items
        : filter === "done"
            ? items.filter(item => item.item.done)
            : items.filter(item => !item.item.done)

    const itemsEls = _items.map(item => itemRender(item))

    container.append(...itemsEls)

    return container
}

function render() {
    const renderControls = items.length > 0

    const container = document.createElement("div")
    container.classList.add("container")

    const inputEl = inputRender()
    const itemsEl = itemsRender()

    if (renderControls) {
        const controlsEl = controlsRender()
        container.append(inputEl, controlsEl, itemsEl)
    } else {
        container.append(inputEl, itemsEl)
    }

    const containerPrev = document.querySelector(".container")

    if (containerPrev) {
        containerPrev.replaceWith(container)
    } else {
        document.querySelector(".app").appendChild(container)
    }
}

/* Event handlers */
function newItemCb(itemLabel) {
    itemAppend({label: itemLabel, done: false}, items)
    render()
}

function doneCb(i) {
    itemUpdateDone(true, i)
    render()
}

function notDoneCb(i) {
    itemUpdateDone(false, i)
    render()
}

function deleteCb(i) {
    itemDelete(i)
    render()
}

function showAllCb() {
    filter = "all"
    render()
}

function showDoneCb() {
    filter = "done"
    render()
}

function showNotDoneCb() {
    filter = "notDone"
    render()
}

function deleteDoneCb() {
    itemsDeleteDone()
    render()
}

/* Main */
function main() {
    render()
}

document.addEventListener("DOMContentLoaded", () => {
    main()
})