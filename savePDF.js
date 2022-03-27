const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;
let arrayURL = []
let outputName = ''

async function modifyPdf(arrayURL) {
    try {
        const bfinal = await fetch(arrayURL[0]).then(res => res.arrayBuffer())
        const finalPDF = await PDFDocument.load(bfinal);

        for (let i = 1; i < arrayURL.length; i++) {
            const existingPdfBytes = await fetch(arrayURL[i]).then(res => res.arrayBuffer())
            const fileADD = await PDFDocument.load(existingPdfBytes);

            const pagesArray = await finalPDF.copyPages(fileADD, fileADD.getPageIndices());

            for (let i = 1; i < pagesArray.length; i++) {
                finalPDF.addPage(pagesArray[i]);
            }
        }

        const pdfBytes = await finalPDF.save()
        download(pdfBytes, outputName, "application/pdf");
    }
    catch (e) {
        alert("something went wrong        (ㄒoㄒ)")
    }
}

const input = document.querySelector('#files');
const bia = document.querySelector('#filesbia');


bia.addEventListener('change', () => {
    const ten = bia.files[0].name;
    document.querySelector('#tenFileBia').textContent = ten;
    outputName = ten;
})


input.addEventListener('change', () => {
    arrayURL = [];

    document.querySelector('#countFiles').textContent = `Đã chọn ${input.files.length} File.`;

    arrayURL.push(
        URL.createObjectURL(bia.files[0])
    )
    Array.from(input.files).forEach(file => {
        arrayURL.push(
            URL.createObjectURL(file)
        )
    })
})


const ghepFile = () => {
    modifyPdf(arrayURL);
}

