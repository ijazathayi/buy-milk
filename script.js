    const today = new Date().toLocaleDateString();
    const dateTh = document.getElementById("dateth").innerHTML = today;

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
        { qtyId: '110mlc', priceId: '110mlcwholesaleprice', totalId: '110mlctotal' },
        { qtyId: '85mlc', priceId: '85mlcwholesaleprice', totalId: '85mlctotal' },
        { qtyId: '10rsl', priceId: '10rslwholesaleprice', totalId: '10rsltotal' },
        { qtyId: '200mlc', priceId: '200mlcwholesaleprice', totalId: '200mlctotal' },
        { qtyId: '180mlb', priceId: '180mlbwholesaleprice', totalId: '180mlbtotal' }
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

async function downloadTableImage() {
    const originalTable = document.getElementById('myTable');

    // 1. Clone the table
    const tableClone = originalTable.cloneNode(true);

    // 2. Style the clone so it's ready for the "photo"
    tableClone.style.width = "350px";
    tableClone.style.position = "absolute";
    tableClone.style.top = "-9999px";
    document.body.appendChild(tableClone);

    // 3. Remove columns 5 and 6 (Index 4 and 5) from the clone
    const rows = tableClone.querySelectorAll('tr');
    rows.forEach(row => {
        // We delete the higher index first so the order doesn't shift
        // if (row.cells.length > 4) row.deleteCell(4);
        if (row.cells.length > 1) row.deleteCell(1);
    });

    try {
        // 4. Convert the hidden clone to a Canvas
        const canvas = await html2canvas(tableClone, {
            backgroundColor: "#ffffff",
            scale: 2 // Keeps the image crisp
        });

        // Cleanup: Remove the clone from the DOM
        document.body.removeChild(tableClone);

        // 5. Trigger the download automatically
        const link = document.createElement('a');
        link.download = `Milk_Bill_${new Date().toLocaleDateString()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

    } catch (error) {
        console.error("Error generating image:", error);
        alert("Could not generate image.");
    }
}

function shareTableImage() {
// i want in this funcrtion to share the table image on whatsapp and other social media platforms using the web share api if available, otherwise fallback to download the image
    if (navigator.share) {
        // If Web Share API is supported, we can share the image directly
        downloadTableImage().then(imageBlob => {
            const file = new File([imageBlob], `Milk_Bill_${new Date().toLocaleDateString()}.png`, { type: 'image/png' });
            navigator.share({
                title: 'Milk Bill',
                text: 'Here is the milk bill for today.',
                files: [file]
            }).catch(error => {
                console.error("Error sharing:", error);
                alert("Could not share the image.");
            });
        }).catch(error => {
            console.error("Error generating image for sharing:", error);
            alert("Could not generate image for sharing.");
        }
        );
    } else {
        // Fallback to download if Web Share API is not supported
        downloadTableImage();
    }
}