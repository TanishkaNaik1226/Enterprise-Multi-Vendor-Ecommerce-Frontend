package com.shopstack.modules.payment.service;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.shopstack.modules.payment.entity.Invoice;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;

@Service
public class InvoiceService {

    public String generatePdfInvoice(Invoice invoice) {
        String filename = "invoice_" + invoice.getInvoiceNumber() + ".pdf";
        Document document = new Document();
        try {
            PdfWriter.getInstance(document, new FileOutputStream(filename));
            document.open();
            document.add(new Paragraph("ShopStack Invoice"));
            document.add(new Paragraph("Invoice Number: " + invoice.getInvoiceNumber()));
            document.add(new Paragraph("Order ID: " + invoice.getOrder().getId()));
            document.add(new Paragraph("GST: $" + invoice.getGstAmount()));
            document.add(new Paragraph("Total: $" + invoice.getTotalAmount()));
            document.close();
            return filename;
        } catch (DocumentException | IOException e) {
            throw new RuntimeException("Error generating PDF invoice", e);
        }
    }
}
