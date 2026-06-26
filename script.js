    const today = new Date().toLocaleDateString();
    const dateTh = document.getElementById("dateth").innerHTML = today;
    document.getElementById("bill-date").innerHTML = "📅 " + today;

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


async function generateCanvas() {
    const originalWrapper = document.getElementById('bill-wrapper');
    const originalTable = document.getElementById('myTable');

    // Clone the entire bill wrapper (header + table)
    const wrapperClone = originalWrapper.cloneNode(true);
    const tableClone = wrapperClone.querySelector('#myTable');

    wrapperClone.style.position = "absolute";
    wrapperClone.style.top = "-9999px";
    wrapperClone.style.width = "370px";
    wrapperClone.style.background = "#ffffff";
    wrapperClone.style.padding = "0";
    document.body.appendChild(wrapperClone);

    // Sync live input values from original into clone
    const originalInputs = originalTable.querySelectorAll('input');
    const cloneInputs = tableClone.querySelectorAll('input');
    originalInputs.forEach((input, i) => {
        cloneInputs[i].value = input.value;
    });

    // Fix table width inside the clone
    tableClone.style.width = "100%";
    tableClone.style.marginBottom = "0";

    // Hide item rows where qty = 0, track section headers
    const rows = Array.from(tableClone.querySelectorAll('tr'));

    let lastSectionHeaderRow = null;
    const sectionHeaderRows = [];

    rows.forEach(row => {
        const input = row.querySelector('input[type="number"]');
        const isItemRow = !!input;
        const thEl = row.querySelector('th[colspan]');
        const isSectionHeader = !isItemRow && thEl &&
            parseInt(thEl.getAttribute('colspan')) > 1 &&
            rows.indexOf(row) > 1 &&
            !row.querySelector('td');

        if (isSectionHeader) {
            lastSectionHeaderRow = { headerRow: row, itemRows: [] };
            sectionHeaderRows.push(lastSectionHeaderRow);
        } else if (isItemRow && lastSectionHeaderRow) {
            lastSectionHeaderRow.itemRows.push(row);
        }
    });

    // Hide zero-qty item rows
    rows.forEach(row => {
        const input = row.querySelector('input[type="number"]');
        if (input) {
            const qty = parseFloat(input.value) || 0;
            if (qty === 0) row.style.display = 'none';
        }
    });

    // Hide section headers with no visible items
    sectionHeaderRows.forEach(section => {
        const anyVisible = section.itemRows.some(r => r.style.display !== 'none');
        if (!anyVisible) section.headerRow.style.display = 'none';
    });

    // Remove the wholesale price column from visible rows
    const allRows = tableClone.querySelectorAll('tr');
    allRows.forEach(row => {
        if (row.style.display === 'none') return;
        if (row.cells.length > 1) row.deleteCell(1);
    });

    const canvas = await html2canvas(wrapperClone, {
        backgroundColor: "#ffffff",
        scale: 2
    });

    document.body.removeChild(wrapperClone);
    return canvas;
}

// Keep your original download logic, but use the new helper
async function downloadTableImage() {
    const canvas = await generateCanvas();
    const link = document.createElement('a');
    link.download = `Milk_Bill_${new Date().toLocaleDateString()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}
async function shareTableImage() {
    try {
        const canvas = await generateCanvas();
        
        // Convert canvas to Blob (File object)
        canvas.toBlob(async (blob) => {
            const file = new File([blob], `Milk_Bill.png`, { type: 'image/png' });

            // Check if the browser supports sharing FILES
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Milk Bill',
                    // text: 'Shared from Buy Milk App',
                });
            } else {
                // Fallback: Just download if sharing isn't supported
                alert("Sharing not supported on this browser. Downloading instead...");
                downloadTableImage();
            }
        }, 'image/png');

    } catch (error) {
        console.error("Sharing failed:", error);
        // Fallback to download on error
        downloadTableImage();
    }
}

// async function downloadTableImage() {
//     const originalTable = document.getElementById('myTable');

//     // 1. Clone the table
//     const tableClone = originalTable.cloneNode(true);

//     // 2. Style the clone so it's ready for the "photo"
//     tableClone.style.width = "350px";
//     tableClone.style.position = "absolute";
//     tableClone.style.top = "-9999px";
//     document.body.appendChild(tableClone);

//     // 3. Remove columns 5 and 6 (Index 4 and 5) from the clone
//     const rows = tableClone.querySelectorAll('tr');
//     rows.forEach(row => {
//         // We delete the higher index first so the order doesn't shift
//         // if (row.cells.length > 4) row.deleteCell(4);
//         if (row.cells.length > 1) row.deleteCell(1);
//     });

//     try {
//         // 4. Convert the hidden clone to a Canvas
//         const canvas = await html2canvas(tableClone, {
//             backgroundColor: "#ffffff",
//             scale: 2 // Keeps the image crisp
//         });

//         // Cleanup: Remove the clone from the DOM
//         // document.body.removeChild(tableClone);

//         // 5. Trigger the download automatically
//         const link = document.createElement('a');
//         link.download = `Milk_Bill_${new Date().toLocaleDateString()}.png`;
//         link.href = canvas.toDataURL("image/png");
//         link.click();

//     } catch (error) {
//         console.error("Error generating image:", error);
//         alert("Could not generate image.");
//     }
// }




// function shareTableImage() {
// // i want in this funcrtion to share the table image on whatsapp and other social media platforms using the web share api if available, otherwise fallback to download the image
//     if (navigator.share) {
//         // If Web Share API is supported, we can share the image directly
//         downloadTableImage().then(imageBlob => {
//             const file = new File([imageBlob], `Milk_Bill_${new Date().toLocaleDateString()}.png`, { type: 'image/png' });
//             navigator.share({
//                 title: 'Milk Bill',
//                 text: 'Here is the milk bill for today.',
//                 files: [file]
//             }).catch(error => {
//                 console.error("Error sharing:", error);
//                 alert("Could not share the image.");
//             });
//         }).catch(error => {
//             console.error("Error generating image for sharing:", error);
//             alert("Could not generate image for sharing.");
//         }
//         );
//     } 
//     // else {
//     //     // Fallback to download if Web Share API is not supported
//     //     downloadTableImage();
//     // }
// }
