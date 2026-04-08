function calculate() {
    // 1. Helper function to get values and convert to numbers
    const getVal = (id) => parseInt(document.getElementById(id).value) || 0;
    const getPrice = (id) => parseInt(document.getElementById(id).innerText.replace("₹", "")) || 0;

    // 2. Define all items and their corresponding IDs
    const items = [
        { qtyId: 'onelitre', priceId: 'onelitreprice', totalId: 'onelitretotal' },
        { qtyId: 'halflitre', priceId: 'halflitreprice', totalId: 'halflitretotal' },
        { qtyId: '250ml', priceId: '250mlprice', totalId: '250mltotal' },
        { qtyId: '180ml', priceId: '180mlprice', totalId: '180mltotal' },
        { qtyId: '115ml', priceId: '115mlprice', totalId: '115mltotal' },
        { qtyId: 'halflitrec', priceId: 'halflitrecprice', totalId: 'halflitrectotal' },
        { qtyId: '110mlc', priceId: '110mlcprice', totalId: '110mlctotal' }
    ];

    let grandTotalPieces = 0;
    let grandTotalPrice = 0;

    // 3. Loop through items to calculate row totals and grand totals
    items.forEach(item => {
        const qty = getVal(item.qtyId);
        const price = getPrice(item.priceId);
        const rowTotal = qty * price;

        // Update the row total in the UI
        document.getElementById(item.totalId).innerText = "₹" + rowTotal;

        // Add to grand totals
        grandTotalPieces += qty;
        grandTotalPrice += rowTotal;
    });

    // 4. Update the bottom summary row
    document.getElementById("total-peices").innerText = grandTotalPieces;
    document.getElementById("total-price").innerText = "₹" + grandTotalPrice;
}
















