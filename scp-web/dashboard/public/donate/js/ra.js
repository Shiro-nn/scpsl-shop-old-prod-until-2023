const userDonateColor = document.getElementById('userDonateColor')
const userDonateText = document.getElementById('userDonateText')
const userDonateText2 = document.getElementById('userDonateText2')

var selectedCategory = {
    id: 'selectWelcome',
    name: 'welcome'
}

const donates = {
    stock: 5,
    ra: {
        "openRaPanel": {
            name: "Открытие RemoteAdmin",
            cost: 25
        }
    }
}

let totalCost = 0

document.getElementById('openRaPanel').addEventListener('click', () => {
    console.log(`test`)
    document.querySelector('.blur').style.filter = 'none'
    document.getElementById('openRaPanel').style.display = 'none'
})

userDonateColor.addEventListener('input', () => {
    var theColor = userDonateColor.value
    userDonateText.style.color = theColor
    userDonateText2.style.color = theColor
})

document.getElementById('selectWelcome').classList.add('active')

document.getElementById('selectWelcome').addEventListener('click', () => {
    setNewWindow('selectWelcome', 'welcome')
})

document.getElementById('selectRoles').addEventListener('click', () => {
    setNewWindow('selectRoles', 'roles')
})

document.getElementById('selectInventory').addEventListener('click', () => {
    setNewWindow('selectInventory', 'inventory')
})

document.getElementById('selectEffects').addEventListener('click', () => {
    
})

// document.getElementById('selectEvents').addEventListener('click', () => {
//     setNewWindow('selectEvents', 'events')
// })

function setNewWindow(element, name) {
    if(selectedCategory.name == document.getElementById(element).getAttribute('name')) return
    document.getElementById(element).classList.add('active')
    document.getElementById(selectedCategory.id).classList.remove('active')
    document.querySelector(`[data-selected="${selectedCategory.name}"]`).style.display = 'none'
    selectedCategory = {id: element, name: name}
    document.querySelector(`[data-selected="${name}"]`).style.display = 'block'
    document.getElementById('categoryTitle').innerHTML = document.querySelector(`[data-selected="${name}"]`).getAttribute('data-title')
}