const Order = require("../models/Order");
const Product = require("../models/productModel");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const mongoose = require("mongoose");
const path = require("path");

// exports.bookProduct = async (req, res) => {
//   try {
//     const { product_id, quantity = 1, discount = 0 } = req.body;

//     const product = await Product.findById(product_id);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     if (product.stock < quantity) {
//       return res.status(400).json({ message: "Out of stock" });
//     }

//     const originalTotal = product.price * quantity;
//     const discountAmount = (originalTotal * discount) / 100;
//     const finalTotal = originalTotal - discountAmount;

//        const order = await Order.create({
//           user_id: req.user.id,
//           product_id,
//           quantity,

//           price: product.price,

//           currency: {
//             code: product.currency?.code || "USD",
//             symbol: product.currency?.symbol || "$",
//           },

//           discount,
//           total_price: finalTotal,

//           status: "booked",
//           payment_status: "Pending",
//           shippingAddress: req.body.shippingAddress,
//         });


//     res.json({
//       success: true,
//       message: "Product booked successfully",
//       order
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.bookProduct = async (req, res) => {
  try {
    const {
      product_id,
      quantity = 1,
      discount = 0,
    } = req.body;

    const product = await Product.findById(product_id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Out of stock",
      });
    }

    const originalTotal = product.price * quantity;

    const discountAmount =
      (originalTotal * discount) / 100;

    const finalTotal =
      originalTotal - discountAmount;

    const order = await Order.create({
      user_id: req.user.id,
      product_id,
      quantity,

      price: product.price,

      currency: {
        code: product.currency?.code || "USD",
        symbol: product.currency?.symbol || "$",
      },

      discount,
      total_price: finalTotal,

      // Initial Order Status
      status: "booked",

      // Payment Status
      payment_status: "Pending",

      // Shipping Address
      shippingAddress: req.body.shippingAddress,

      // ===============================
      // ORDER TRACKING HISTORY
      // ===============================
      trackingHistory: [
        {
          status: "booked",
          message: "Your order has been booked successfully",
          updatedAt: new Date(),
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Product booked successfully",
      order,
    });

  } catch (error) {
    console.error("Book product error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.checkoutOrder = async (req, res) => {
  
  try {
        const { order_id, payment } = req.body;

        const order = await Order.findById(order_id).populate("product_id");

        if (!order) {
          return res.status(404).json({
            success: false,
            message: "Order not found"
          });
        }


        // Order status
        order.status = "booked";


        // Payment details
        order.payment_status = payment?.payment_status || "Paid";
        order.payment_method = payment?.method || "";
        order.transactionId = payment?.transactionId || "";


        await order.save();


        await Product.findByIdAndUpdate(
          order.product_id._id,
          {
            $inc: {
              stock: -order.quantity
            }
          }
        );


        res.json({
          success: true,
          message: "Payment successful",
          order
        });


      } catch (error) {

        console.log("CHECKOUT ERROR:", error);

        res.status(500).json({
          success: false,
          message: error.message
        });

      }
    };



exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id || req.user.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found in token"
      });
    }

  const orders = await Order.find({ user_id: userId })
    .populate("user_id", "name email")
  .populate(
        "product_id",
        "name price currency finalPrice discount images"
      )
    .lean();


    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.getInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("product_id")
      .populate("user_id");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const user = order.user_id;
    const product = order.product_id;
    const shipping = order.shippingAddress || {};
    const currency = order.currency || { code: "INR", symbol: "₹" };
    const currencySymbol = currency.symbol;

    const qty = Number(order.quantity);
    const price = Number(order.price || product.price);
    const subtotal = qty * price;

    const discountPercent = Number(order.discount || 0);
    const discountAmount = (subtotal * discountPercent) / 100;

    const finalTaxable = order.total_price
      ? Number(order.total_price)
      : subtotal - discountAmount;

    const applyGST = currency.code === "INR";
    const CGST_RATE = applyGST ? 9 : 0;
    const SGST_RATE = applyGST ? 9 : 0;
    const finalCgst = (finalTaxable * CGST_RATE) / 100;
    const finalSgst = (finalTaxable * SGST_RATE) / 100;
    const finalGrandTotal = finalTaxable + finalCgst + finalSgst;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    doc.registerFont(
      "DejaVu",
      path.join(__dirname, "../fonts/DejaVuSans.ttf")
    );
    doc.registerFont(
      "DejaVu-Bold",
      path.join(__dirname, "../fonts/DejaVuSans-Bold.ttf")
    );

    doc.font("DejaVu");
    doc.pipe(res);
    const PRIMARY = "#1E293B";
    const ACCENT = "#2563EB";
    const GRAY = "#64748B";
    const LIGHT_BG = "#F1F5F9";

    // ================= HEADER =================
    doc.rect(0, 0, 595, 90).fill(PRIMARY);

    doc
      .fillColor("#fff")
      .fontSize(22)
      .font("DejaVu-Bold")
      .text("TAX INVOICE", 40, 30);

    doc
      .fontSize(9)
      .font("DejaVu")
      .fillColor("#CBD5E1")
      .text("KDLC Innovation Pvt Ltd", 40, 58)
      .text("GSTIN: 09ABCDE1234F1Z5  |  Noida, Uttar Pradesh, India", 40, 71);

    const qrData = await QRCode.toDataURL(
      `Invoice:${order._id}|Amount:${currencySymbol}${finalGrandTotal.toFixed(2)}`
    );
    doc.rect(490, 15, 65, 65).fill("#fff");
    doc.image(qrData, 493, 18, { width: 59 });

    const y = 115;
    const lineGap = 16;
    const addressLabelWidth = 220; 

    const rawAddress = shipping.address || "-";
    const addressLines = rawAddress
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const uniqueAddressLines = [...new Set(addressLines)];
    const cleanAddress = uniqueAddressLines.join(", ");

    const fullAddress = [cleanAddress, shipping.city, shipping.state, shipping.pincode]
      .filter(Boolean)
      .join(", ");

    doc.font("DejaVu").fontSize(9.5);
    const addressBlockHeight = doc.heightOfString(fullAddress || "-", {
      width: addressLabelWidth,
    });

    const rowsBeforeAddress = 3;
    const billTopPadding = 34; 
    const addressLabelY = y + billTopPadding + rowsBeforeAddress * lineGap;
    const addressTextY = addressLabelY + lineGap;

    const contentBottom = addressTextY + addressBlockHeight;
    const boxHeight = Math.max(155, contentBottom - y + 20); 

    doc.roundedRect(40, y, 250, boxHeight, 4).fillAndStroke(LIGHT_BG, "#E2E8F0");
    doc.roundedRect(310, y, 250, boxHeight, 4).fillAndStroke(LIGHT_BG, "#E2E8F0");

    doc
      .fillColor(ACCENT)
      .font("DejaVu-Bold")
      .fontSize(10)
      .text("BILL TO / SHIPPING ADDRESS", 55, y + 12, { width: 220 });

    let billY = y + billTopPadding;

    doc.fillColor("#0F172A").font("DejaVu-Bold").fontSize(9.5);
    doc.text("Name :", 55, billY, { continued: true });
    doc.font("DejaVu").text(` ${shipping.name || user?.name || "-"}`);

    billY += lineGap;
    doc.font("DejaVu-Bold").text("Mobile :", 55, billY, { continued: true });
    doc.font("DejaVu").text(` ${shipping.phone || user?.phone || "-"}`);

    billY += lineGap;
    doc.font("DejaVu-Bold").text("E-mail :", 55, billY, { continued: true });
    doc.font("DejaVu").text(` ${user?.email || "-"}`);

    doc.font("DejaVu-Bold").fontSize(9.5).text("Address :", 55, addressLabelY);
    doc
      .font("DejaVu")
      .fontSize(9.5)
      .text(fullAddress || "-", 55, addressTextY, { width: addressLabelWidth });

    doc
      .fillColor(ACCENT)
      .font("DejaVu-Bold")
      .fontSize(10)
      .text("ORDER DETAILS", 325, y + 12);

    let orderY = y + billTopPadding;
    doc.fillColor("#0F172A").font("DejaVu").fontSize(10);
    doc.text(`Order ID: ${order._id}`, 325, orderY, { width: 220 });
    orderY += lineGap;
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, 325, orderY);
    orderY += lineGap;
    doc.text(`Status: ${order.status}`, 325, orderY);
    orderY += lineGap;
    doc.text(`Payment: ${order.payment_status} (${order.payment_method})`, 325, orderY, { width: 220 });
    orderY += lineGap;
    doc.text(`Txn ID: ${order.transactionId || "-"}`, 325, orderY, { width: 220 });

    const tableTop = y + boxHeight + 20;

    doc.rect(40, tableTop, 520, 28).fill(PRIMARY);

    doc.fillColor("#fff").fontSize(10).font("DejaVu-Bold");
    doc.text("PRODUCT", 50, tableTop + 9);
    doc.text("QTY", 250, tableTop + 9);
    doc.text("PRICE", 310, tableTop + 9);
    doc.text("DISC.", 400, tableTop + 9);
    doc.text("TOTAL", 470, tableTop + 9);

    const rowY = tableTop + 40;

    doc.fillColor("#0F172A").font("DejaVu").fontSize(10);
    doc.text(product?.name || "-", 50, rowY, { width: 190 });
    doc.text(String(qty), 250, rowY);
    doc.text(`${currencySymbol}${price.toLocaleString("en-IN")}`, 310, rowY);
    doc.text(`${discountPercent}%`, 400, rowY);
    doc.text(`${currencySymbol} ${finalTaxable.toLocaleString("en-US")}`, 470, rowY);

    doc
      .moveTo(40, rowY + 25)
      .lineTo(560, rowY + 25)
      .strokeColor("#E2E8F0")
      .stroke();

    // ================= TOTALS BOX =================
    const boxY = rowY + 50;

    doc.roundedRect(320, boxY, 240, 150, 4).fillAndStroke(LIGHT_BG, "#E2E8F0");

    doc.fillColor("#334155").font("DejaVu").fontSize(10);

    doc.text("Subtotal", 335, boxY + 18);
    doc.text(`${currencySymbol} ${subtotal.toLocaleString("en-US")}`, 470, boxY + 18, {
      align: "right",
      width: 75,
    });

    doc.text(`Discount (${discountPercent}%)`, 335, boxY + 38);
    doc.text(`- ${currencySymbol} ${discountAmount.toFixed(2)}`, 470, boxY + 38, {
      align: "right",
      width: 75,
    });

    doc.text(`CGST (${CGST_RATE}%)`, 335, boxY + 58);
    doc.text(`${currencySymbol} ${finalCgst.toFixed(2)}`, 470, boxY + 58, {
      align: "right",
      width: 75,
    });

    doc.text(`SGST (${SGST_RATE}%)`, 335, boxY + 78);
    doc.text(`${currencySymbol} ${finalSgst.toFixed(2)}`, 470, boxY + 78, {
      align: "right",
      width: 75,
    });

    doc
      .moveTo(335, boxY + 102)
      .lineTo(540, boxY + 102)
      .strokeColor("#CBD5E1")
      .stroke();

    doc
      .fillColor(ACCENT)
      .font("DejaVu-Bold")
      .fontSize(13)
      .text("Grand Total", 335, boxY + 115);

    doc
      .fillColor(ACCENT)
      .font("DejaVu-Bold")
      .fontSize(13)
      .text(`${currencySymbol} ${finalGrandTotal.toFixed(2)}`, 440, boxY + 115, {
        align: "right",
        width: 105,
      });

    // ================= TERMS & CONDITIONS =================
    const terms = [
      "Goods once sold will not be taken back or exchanged.",
      "All disputes are subject to Noida, Uttar Pradesh jurisdiction only.",
      "Payment is due as per the agreed order terms.",
      "Please verify product details on delivery before acceptance.",
    ];

    let termsY = boxY + 170;

    if (termsY + 40 + terms.length * 14 + 60 > 780) {
      doc.addPage();
      termsY = 40;
    }

    doc
      .fillColor(ACCENT)
      .font("DejaVu-Bold")
      .fontSize(10)
      .text("TERMS & CONDITIONS", 40, termsY);

    doc.fillColor("#334155").font("DejaVu").fontSize(8.5);
    terms.forEach((line, i) => {
      doc.text(`${i + 1}. ${line}`, 40, termsY + 18 + i * 14, { width: 320 });
    });

    // ================= SIGNATURE =================
    const sigY = termsY + 18 + terms.length * 14 + 30;

    doc
      .moveTo(400, sigY)
      .lineTo(560, sigY)
      .strokeColor("#94A3B8")
      .stroke();

    doc
      .fillColor(PRIMARY)
      .font("DejaVu-Bold")
      .fontSize(9)
      .text("Authorized Signatory", 400, sigY + 6, { width: 160, align: "center" });

    doc
      .fillColor(GRAY)
      .font("DejaVu")
      .fontSize(8)
      .text("KDLC Innovation Pvt Ltd", 400, sigY + 20, { width: 160, align: "center" });

    // ================= FOOTER =================
    doc
      .fontSize(8.5)
      .fillColor(GRAY)
      .font("DejaVu")
      .text("This invoice is valid without a signature.", 40, 780, {
        align: "center",
        width: 520,
      });

    doc.end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Delete Order Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getSingleOrder = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id)
      .populate("product_id")
      .populate("user_id", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// exports.updateOrderStatus = async (req, res) => {
//   try {
    
//     const role = req.user?.role?.toUpperCase();

//     if (
//       role !== "ADMIN" &&
//       role !== "SUPER_ADMIN"
//     ) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "Only ADMIN or SUPER_ADMIN can update order status",
//       });
//     }

//     const { id } = req.params;
//     const { status } = req.body;

//     const allowedStatus = [
//       "booked",
//       "processing",
//       "shipped",
//       "delivered",
//       "cancelled",
//     ];

//     if (!allowedStatus.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status value",
//       });
//     }

//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     order.status = status;

//     await order.save();
    
//     return res.status(200).json({
//       success: true,
//       message: "Status updated successfully",
//       data: order,
//     });

//   } catch (err) {
//     console.error(
//       "Update Order Status Error:",
//       err
//     );

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "booked",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const statusMessages = {
      booked: "Your order has been booked successfully",
      processing: "Your order is being processed",
      shipped: "Your order has been shipped",
      delivered: "Your order has been delivered successfully",
      cancelled: "Your order has been cancelled",
    };

    // Same status dobara update na ho
    if (order.status === status) {
      return res.status(400).json({
        success: false,
        message: `Order is already ${status}`,
      });
    }

    order.status = status;

    // Tracking history initialize
    if (!order.trackingHistory) {
      order.trackingHistory = [];
    }

    // Tracking history add
    order.trackingHistory.push({
      status,
      message: statusMessages[status],
      updatedAt: new Date(),
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });

  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user_id", "name email phone address")
      .populate("product_id", "name price");

    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getOrderTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("product_id", "name images price")
      .populate("user_id", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Admin roles
    const isAdmin = ["ADMIN", "SUPER_ADMIN", "MANAGER"].includes(
      req.user.role
    );

    // Customer sirf apna order track kare
    if (
      !isAdmin &&
      order.user_id._id.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to track this order",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order tracking fetched successfully",
      data: {
        _id: order._id,
        status: order.status,
        quantity: order.quantity,
        total_price: order.total_price,
        currency: order.currency,
        trackingHistory: order.trackingHistory || [],
        product: order.product_id,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
      },
    });

  } catch (error) {
    console.error("Get order tracking error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};