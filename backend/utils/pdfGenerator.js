import PDFDocument from 'pdfkit';

export const generatePDF = async (pokemon) => {
    const { name, abilities, sprites } = pokemon;
    const doc = new PDFDocument();

    doc.fontSize(20).text(`Pokemon: ${name}`, {align: 'center' });
    doc.image(sprites.front_default, {fit: [100, 100], align: 'center' });

    doc.fontSize(14).text(`Abilities: `, { underline: true });
    abilities.forEach((ability, index) => {
        doc.text(`${index + 1}. ${ability.ability.name}`);
    });

    doc.end();

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        return Buffer.concat(buffers);
    })
}