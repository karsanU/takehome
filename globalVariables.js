const numberOfBakers = 5;
const globalVariables = {
    orders: [],
    bakers: [],
}

for (let i = 0; i < numberOfBakers; i++) {
    globalVariables.bakers.push({ bakerId: i, time: 0, orders: [] })
}

module.exports = globalVariables;