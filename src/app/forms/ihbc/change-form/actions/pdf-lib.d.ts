declare module 'pdf-lib' {
  export class PDFDocument {
    static create(): Promise<PDFDocument>;
    addPage(size: number[]): PDFPage;
    embedFont(font: StandardFonts): Promise<PDFFont>;
    save(): Promise<Uint8Array>;
  }

  export class PDFPage {
    drawText(
      text: string,
      options: {
        x: number;
        y: number;
        size: number;
        font: PDFFont;
        color?: RGB;
      },
    ): void;
  }

  export class PDFFont {}

  export class RGB {
    constructor(r: number, g: number, b: number);
  }

  export function rgb(r: number, g: number, b: number): RGB;

  export enum StandardFonts {
    Helvetica = 'Helvetica',
    HelveticaBold = 'Helvetica-Bold',
    TimesRoman = 'Times-Roman',
    TimesRomanBold = 'Times-Bold',
    Courier = 'Courier',
    CourierBold = 'Courier-Bold',
  }
}
