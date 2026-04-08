function calculate() {
    // 1. Use parseFloat to keep decimal values
    const getVal = (id) => parseFloat(document.getElementById(id).value) || 0;
    const getPrice = (id) => parseFloat(document.getElementById(id).innerText.replace("₹", "")) || 0;

    const items = [
        { qtyId: 'onelitre', priceId: 'onelitrewholesaleprice', totalId: 'onelitretotal' },
        { qtyId: 'halflitre', priceId: 'halflitrewholesaleprice', totalId: 'halflitretotal' },
        { qtyId: '250ml', priceId: '250mlwholesaleprice', totalId: '250mltotal' },
        { qtyId: '180ml', priceId: '180mlwholesaleprice', totalId: '180mltotal' },
        { qtyId: '115ml', priceId: '115mlwholesaleprice', totalId: '115mltotal' },
        { qtyId: 'halflitrec', priceId: 'halflitrecwholesaleprice', totalId: 'halflitrectotal' },
        { qtyId: '110mlc', priceId: '110mlcwholesaleprice', totalId: '110mlctotal' }
    ];

    let grandTotalPieces = 0;
    let grandTotalPrice = 0;

    items.forEach(item => {
        const qty = getVal(item.qtyId);
        const price = getPrice(item.priceId);
        const rowTotal = qty * price;

        // 2. Use .toFixed(2) to show clean currency formatting (e.g., 37.50 instead of 37.5)
        document.getElementById(item.totalId).innerText = "₹" + rowTotal.toFixed(2);

        grandTotalPieces += qty;
        grandTotalPrice += rowTotal;
    });

    document.getElementById("total-peices").innerText = grandTotalPieces;
    document.getElementById("total-price").innerText = "₹" + grandTotalPrice.toFixed(2);
}

