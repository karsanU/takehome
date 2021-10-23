const express = require("express");
const router = new express.Router();
const globalVariables = require('../globalVariables')

const assignOrderHandler = (order) => {
    const sortedBakers = globalVariables.bakers.sort((a, b) => a.time - b.time); // O(n log n)
    const newTime = sortedBakers[0].time + order.duration;
    if (newTime > 8) return false;
    sortedBakers[0].time = newTime;
    sortedBakers[0].orders.push(order.id)
    // console.log(sortedBakers)
    return true;
}

// Add an order (takes a name and duration, the API assigns a unique ID)
router.post("/order", (req, res) => {
    // if duration is greater then 8hrs send error 
    if (req.body.duration > 8) return res.status(422).json({ message: "Duration must be minimum than 8 hours." });
    const order = {
        name: req.body.name,
        duration: +req.body.duration,
        id: new Date().getTime().toString(),
    }
    const isAssigned = assignOrderHandler(order);
    if (!isAssigned) return res.status(422).json({ message: "No Time left for bakers!" });
    globalVariables.orders.push(order);
    res.status(201).json(order.id);
});

// Cancel an order (takes an ID)
router.delete("/order/:id", (req, res) => {
    // remove the order 
    const remainingOrders = globalVariables.orders.filter(order => order.id !== req.params.id);
    // if it's not in the order list return error 
    if (remainingOrders.length === globalVariables.orders.length) return res.status(404).json({ message: "Order not found!" })
    globalVariables.orders = remainingOrders;
    // reassign the orders 
    globalVariables.bakers.forEach(baker => {
        baker.orders = [];
        baker.time = 0;
    });
    remainingOrders.forEach(assignOrderHandler); // O(n)
    res.status(201).json({ message: "Order has been canceled" });
});

// Get ordered list of orders for all bakers
router.get('/orders', (req, res) => {
    // reassign the orders 
    const orders = [...globalVariables.bakers].map(baker => {
        const orders = baker.orders.map(orderId => globalVariables.orders.find(order => order.id === orderId));
        return { ...baker, orders };
    })
    res.status(200).json(orders);
})
module.exports = router;
