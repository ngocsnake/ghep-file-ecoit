import niceBytes from './module.js';

const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;

let arrayURL = [];

const current = document.querySelector('#current');

const input = document.querySelector('#files');

input.addEventListener('change', () => {
    arrayURL = [];

    let totalSize = 0;

    Array.from(input.files).forEach(file => {

        totalSize += file.size;

        arrayURL.push(
            {
                name: file.name.replace('.pdf', ''),
                url: URL.createObjectURL(file)
            }
        )
    })
    document.querySelector('#countFiles').textContent = `Đã chọn ${input.files.length} File. (${niceBytes(totalSize)})`;
})

const ghepFile = () => {
    const isConfirm = confirm('Chắc chắn ghép?');

    if (isConfirm) {
        ghepFilePDF(arrayURL)
    }
}

async function ghepFilePDF(arrayURL) {

    const arrayBia = arrayURL.filter(e => e.name.length === 25);

    arrayBia.forEach(bia => {
        bia.fileghep = arrayURL.filter(
            e => e.name !== bia.name && e.name.startsWith(bia.name)
        );
    })

    for (let i = 0; i < arrayBia.length; i++) {

        const file = arrayBia[i];

        const biaURL = file.url;
        const fileName = file.name + '.pdf'

        current.textContent = 'Đang ghép: ' + fileName + '...';

        const fileGhep = file.fileghep;

        try {
            const bfinal = await fetch(biaURL).then(res => res.arrayBuffer())
            URL.revokeObjectURL(biaURL)
            const finalPDF = await PDFDocument.load(bfinal);

            for (let i = 0; i < fileGhep.length; i++) {
                const existingPdfBytes = await fetch(fileGhep[i].url).then(res => res.arrayBuffer())
                URL.revokeObjectURL(fileGhep[i].url)
                const fileADD = await PDFDocument.load(existingPdfBytes);

                const pagesArray = await finalPDF.copyPages(fileADD, fileADD.getPageIndices());

                for (let i = 1; i < pagesArray.length; i++) {
                    finalPDF.addPage(pagesArray[i]);
                }
            }
            const pdfBytes = await finalPDF.save()
            download(pdfBytes, fileName, "application/pdf");
        }
        catch (e) {
            console.log(e);
            alert("something went wrong        (ㄒoㄒ)")
        }
        current.textContent = `\\(^o^)/`;
    }
}
