// PDF generator...
import axios from 'axios';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';

/**
 * This function generate Pokemon PDF files...
 *
 * @param pokemon object...
 * @returns Buffer PDF
 */
export const generatePDF = async (pokemon) => {
    const { image, name, abilities } = pokemon;
    const doc = new PDFDocument({
        size: [288, 492],  // 80mm x 200mm (en puntos: 1 pulgada = 72 puntos)
        margin: 0
    });

    try {
        // Download the image from the URL
        const response = await axios.get(image, { responseType: 'arraybuffer' });

        // Ensure the image is successfully fetched
        if (!response.data || response.status !== 200) {
            throw new Error('Failed to download image');
        }

        // Convert SVG image to PNG using shar
        const imageBuffer = await sharp(response.data)
            .png()  // Convert to PNG
            .toBuffer(); // Obtaing buffer

        // Pokemon name Title
        doc.moveDown(2);
        doc.fontSize(25).text(`${name}`, { align: 'center', continued: false });

        // Blank space between the name and the image...
        doc.moveDown(0.5);

        // Pokemon img
        doc.image(imageBuffer, { fit: [240, 240], align: 'right', valign: 'center' });

        // blank space between images and abilities list...
        doc.moveDown(9);

        // abilities title
        doc.fontSize(13).text(`Abilities:`, { align: 'center', underline: true});

        doc.moveDown(1);
        // Abilities lists
        abilities.forEach((ability, index) => {
            doc.fontSize(10).text(`${index + 1}. ${ability}`, { align: 'center' });
        });

        // the end of the PDF
        doc.end();

        // Collect the generated PDF in a buffer
        return new Promise((resolve, reject) => {
            const buffers = [];
            doc.on('data', chunk => buffers.push(chunk));  // Push each chunk of data to the array
            doc.on('end', () => {
                try {
                    const finalPDFBuffer = Buffer.concat(buffers);  // Concatenate the chunks into one buffer
                    resolve(finalPDFBuffer);  // Return the final PDF buffer
                } catch (error) {
                    reject(new Error('Error generating PDF'));
                }
            });
            doc.on('error', error => {
                reject(new Error('Error generating PDF: ' + error.message));
            });
        });

    } catch (error) {
        console.log('Error al procesar el pdf: ' + error.message);
        throw new Error('Error al procesar el pdf: ' + error.message);
    }
}