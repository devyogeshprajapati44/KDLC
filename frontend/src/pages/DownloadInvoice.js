const PDFDocument = require("pdfkit");
const Order = require("../models/Order");
const path = require("path");

exports.getInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user_id")
      .populate("product_id");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    doc.pipe(res);


    const logoPath = path.join(__dirname, "../public/logo.png");
    doc.image(logoPath, 50, 30, { width: 80 });

    doc
      .fontSize(20)
      .text("Your Company Name", 150, 30);

    doc
      .fontSize(10)
      .text("GSTIN: 09ABCDE1234F1Z5", 150, 55)
      .text("Address: Noida, Uttar Pradesh, India")
      .moveDown();

    // =========================
    // INVOICE TITLE
    // =========================
    doc
      .fontSize(18)
      .text("INVOICE", { align: "center" });

    doc.moveDown();

    // =========================
    // ORDER INFO
    // =========================
    doc.fontSize(12);
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Customer: ${order.user_id?.name}`);
    doc.text(`Email: ${order.user_id?.email || "N/A"}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);

    doc.moveDown();

    // =========================
    // PRODUCT DETAILS
    // =========================
    const price = order.price;
    const quantity = order.quantity || 1;

    const subtotal = price * quantity;
    const gstRate = 18; // 18% GST
    const gstAmount = (subtotal * gstRate) / 100;
    const grandTotal = subtotal + gstAmount;

    doc.fontSize(12).text("Product Details:", { underline: true });
    doc.text(`Product: ${order.product_id?.name}`);
    doc.text(`Quantity: ${quantity}`);
    doc.text(`Price: ₹${price}`);

    doc.moveDown();

    // =========================
    // BILL CALCULATION BOX
    // =========================
    doc.rect(50, doc.y, 500, 100).stroke();

    doc
      .fontSize(12)
      .text(`Subtotal: ₹${subtotal}`, 60, doc.y + 10)
      .text(`GST (${gstRate}%): ₹${gstAmount.toFixed(2)}`)
      .text(`Grand Total: ₹${grandTotal.toFixed(2)}`, { bold: true });

    doc.moveDown(2);

    // =========================
    // FOOTER
    // =========================
    doc
      .fontSize(10)
      .text("Thank you for your purchase!", {
        align: "center",
      });

    doc.end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Invoice generation failed" });
  }
};