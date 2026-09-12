import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const CATEGORIES = [
  "Mobile",
  "Laptop",
  "Tablet",
  "Accessories",
  "Furniture",
  "Home Temples",
];

const SORT_LABELS = {
  featured: "Featured",
  newest: "Newest",
  priceHigh: "Price: High to Low",
  priceLow: "Price: Low to High",
};

const NEW_WINDOW_DAYS = 7;

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const isRecent = (dateStr) => {
  if (!dateStr) return false;
  const diffDays = (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= NEW_WINDOW_DAYS;
};

export default function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);

  const PAGE_SIZE = 6;

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  useEffect(() => {
    const closeDropdown = () => setSortOpen(false);
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  const fetchProducts = async (pageNo = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/v1/products?page=${pageNo}&limit=${PAGE_SIZE}`
      );

      setProducts(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setPage(res.data.pagination.currentPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const visibleProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      );
    }

    if (filterCategory) {
      result = result.filter((p) => p.category === filterCategory);
    }

    switch (sortBy) {
      case "priceHigh":
        result.sort(
          (a, b) => (b.finalPrice || b.price) - (a.finalPrice || a.price)
        );
        break;
      case "priceLow":
        result.sort(
          (a, b) => (a.finalPrice || a.price) - (b.finalPrice || b.price)
        );
        break;
      case "newest":
        result.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      default:
        break; 
    }

    return result;
  }, [products, searchTerm, filterCategory, sortBy]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setSelectedProduct(null);
  };

  const handleLoginAndBook = () => {
    if (selectedProduct) {
      localStorage.setItem("pendingProduct", JSON.stringify(selectedProduct));
    }
    setShowLoginModal(false);
    navigate("/login");
  };

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  function ProductCard({ product, onProductClick }) {
    const outOfStock = Number(product.stock) === 0;
    const hasDiscount = Number(product.discount) > 0;
    const finalPrice = product.finalPrice || product.price;
    const discountPercent = hasDiscount
      ? Math.round(Number(product.discount))
      : 0;
    const showNewBadge = isRecent(product.createdAt);

    return (
      <article
        className={`product-card ${outOfStock ? "product-card--out" : ""}`}
      >
        <div className="product-card__image">
          {outOfStock && (
            <div className="product-card__stock-out">
              <span>Currently Unavailable</span>
            </div>
          )}

          <div className="product-card__badges">
            {showNewBadge && (
              <span className="product-card__badge product-card__badge--new">
                New
              </span>
            )}
            {hasDiscount && (
              <span className="product-card__badge product-card__badge--off">
                -{discountPercent}%
              </span>
            )}
          </div>

          <img
            src={`http://localhost:5000/uploads/${product.images?.[0]}`}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />

          <span className="product-card__category-tag">{product.category}</span>

          <div className="product-card__ticket">
            {hasDiscount && (
              <span className="product-card__ticket-strike">
                {formatINR(product.price)}
              </span>
            )}
            <span className="product-card__ticket-price">
              {formatINR(finalPrice)}
            </span>
          </div>
        </div>

        <div className="product-card__content">
          <span className="product-card__category">Temple Booking</span>
          <h3>{product.name}</h3>
          <p>{product.description}</p>

          <div className="product-card__bottom">
            <div className="product-card__price">
              <small>Starting from</small>
              <strong>{formatINR(finalPrice)}</strong>
            </div>

            <button
              type="button"
              className="product-card__button"
              disabled={outOfStock}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onProductClick(product);
              }}
            >
              {outOfStock ? "Notify Me" : "Book Now"} <span>→</span>
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="temple-page">
      <nav className="temple-nav">
        <div className="temple-container temple-nav__inner">
          <div className="temple-logo">
            <div className="temple-logo__symbol">ॐ</div>
            <div className="temple-logo__text">
              <strong>KDLC</strong>
              <small>Temple Booking</small>
            </div>
          </div>
          <div className="temple-nav__links">
            <a href="#home">Home</a>
            <a href="#products">Bookings</a>
            <a href="#about">About</a>
            <a href="#timings">Timings</a>
          </div>
          <button type="button" className="temple-nav__button" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </nav>

      <header className="temple-hero" id="home">
        <div className="temple-hero__pattern"></div>
        <div className="temple-container temple-hero__content">
          <div className="temple-hero__text">
            <div className="temple-hero__eyebrow">
              <span>✦</span> Divine Temple Experience
            </div>
            <h1>
              Book your <span>divine journey.</span>
            </h1>
            <p>
              Experience peaceful darshan, sacred puja, aarti seva and temple
              services. Book your visit easily and securely with KDLC Temple
              Booking.
            </p>
            <div className="temple-hero__actions">
              <button type="button" className="btn btn--primary" onClick={scrollToProducts}>
                Explore Bookings <span>→</span>
              </button>
              <a href="#about" className="btn btn--outline">Discover KDLC</a>
            </div>
            <div className="temple-hero__trust">
              <div><strong>1000+</strong><span>Devotees</span></div>
              <div className="trust-divider"></div>
              <div><strong>24/7</strong><span>Online Booking</span></div>
              <div className="trust-divider"></div>
              <div><strong>100%</strong><span>Secure</span></div>
            </div>
          </div>

          <div className="temple-hero__visual" aria-hidden="true">
            <div className="sun-glow"></div>
            <div className="temple-arch">
              <div className="arch__outer"><div className="arch__inner"></div></div>
              <div className="temple-building">
                <div className="temple-roof temple-roof--one"><span></span></div>
                <div className="temple-roof temple-roof--two"><span></span></div>
                <div className="temple-main">
                  <div className="temple-pillars"><i></i><i></i></div>
                  <div className="temple-door"><div className="door__inner">ॐ</div></div>
                </div>
              </div>
            </div>
            <div className="hero__bell">
              <div className="bell__top"></div>
              <div className="bell__body"><div className="bell__clapper"></div></div>
            </div>
          </div>
        </div>
        <div className="hero__bottom-wave"></div>
      </header>

      <section className="quick-booking">
        <div className="temple-container">
          <div className="quick-booking__box">
            <div className="quick-booking__icon">📅</div>
            <div className="quick-booking__text">
              <span>Plan your visit</span>
              <strong>Book your temple experience</strong>
            </div>
            <div className="quick-booking__details">
              <div><small>Available</small><strong>Every Day</strong></div>
              <div><small>Booking</small><strong>Online</strong></div>
            </div>
            <button type="button" className="quick-booking__button" onClick={scrollToProducts}>
              View Services <span>→</span>
            </button>
          </div>
        </div>
      </section>

      <main className="temple-products" id="products">
        <div className="temple-container">
          <div className="products-heading">
            <div>
              <div className="section-eyebrow"><span>✦</span> Temple Services</div>
              <h2>Choose your <span>blessed experience.</span></h2>
            </div>
            <p>Select a temple service below. Login is required before booking your selected service.</p>
          </div>

          {/* SEARCH + CATEGORY + SORT TOOLBAR */}
          <div className="products-toolbar">
            <div className="toolbar-search">
              <span className="toolbar-search__icon">🔍</span>
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="toolbar-right">
              <select
                className="toolbar-filter"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <div
                className="toolbar-sort"
                onClick={(e) => {
                  e.stopPropagation();
                  setSortOpen((value) => !value);
                }}
              >
                <span className="sort-label">
                  Sort By: <strong>{SORT_LABELS[sortBy]}</strong>
                </span>
                <span className={`sort-caret ${sortOpen ? "sort-caret--up" : ""}`}>▾</span>

                {sortOpen && (
                  <div className="sort-dropdown">
                    {Object.entries(SORT_LABELS).map(([key, label]) => (
                      <div
                        key={key}
                        className={`sort-option ${sortBy === key ? "active" : ""}`}
                        onClick={() => {
                          setSortBy(key);
                          setSortOpen(false);
                        }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="products-grid">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div className="product-card product-card--skeleton" key={i} />
              ))}
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="products-empty">
              <span>🙏</span>
              <p>No services match your search right now.</p>
            </div>
          ) : (
            <div className="products-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={page === index + 1 ? "active" : ""}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        )}
      </main>

      <section className="temple-about" id="about">
        <div className="temple-container temple-about__grid">
          <div className="about__visual">
            <div className="about__frame">
              <div className="about__temple-art">
                <div className="about__sun">☀</div>
                <div className="about__tower"><div></div><div></div><div></div></div>
                <div className="about__base"><span></span><span></span><span></span><span></span></div>
              </div>
              <div className="about__badge"><strong>ॐ</strong><span>Divine</span></div>
            </div>
          </div>
          <div className="about__content">
            <div className="section-eyebrow"><span>✦</span> About KDLC</div>
            <h2>A sacred place for <span>every devotee.</span></h2>
            <p>
              KDLC Temple Booking provides a simple and reliable way to plan
              your temple visit. Book darshan, puja, aarti, prasad and other
              temple services from the comfort of your home.
            </p>
            <a href="#products" className="text-button">Explore temple services <span>→</span></a>
          </div>
        </div>
      </section>

      <section className="temple-features">
        <div className="temple-container">
          <div className="features-heading">
            <div className="section-eyebrow"><span>✦</span> Why KDLC</div>
            <h2>Simple. Secure. <span>Spiritual.</span></h2>
          </div>
          <div className="features-grid">
            <div className="feature">
              <div className="feature__icon">🎟️</div>
              <h3>Easy Booking</h3>
              <p>Book your temple services quickly from anywhere.</p>
            </div>
            <div className="feature">
              <div className="feature__icon">🔐</div>
              <h3>Secure</h3>
              <p>Your booking information is protected with secure authentication.</p>
            </div>
            <div className="feature">
              <div className="feature__icon">📱</div>
              <h3>Digital Ticket</h3>
              <p>Access your booking details and confirmation digitally.</p>
            </div>
            <div className="feature">
              <div className="feature__icon">🙏</div>
              <h3>Peaceful Visit</h3>
              <p>Plan your visit in advance and enjoy a peaceful spiritual experience.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="temple-timings" id="timings">
        <div className="temple-container">
          <div className="timings-card">
            <div className="timings-card__left">
              <h2>Temple <span>Timings</span></h2>
              <p>
                Plan your visit according to the daily temple schedule and
                make your spiritual journey peaceful and memorable.
              </p>
            </div>
            <div className="timings-card__right">
              <div className="timing-row"><span>Morning Darshan</span><strong>06:00 AM – 12:00 PM</strong></div>
              <div className="timing-row"><span>Afternoon</span><strong>12:00 PM – 04:00 PM</strong></div>
              <div className="timing-row"><span>Evening Darshan</span><strong>04:00 PM – 09:00 PM</strong></div>
              <div className="timing-row timing-row--highlight"><span>Maha Aarti</span><strong>07:00 PM</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className="temple-cta">
        <div className="temple-cta__pattern"></div>
        <div className="temple-container temple-cta__content">
          <div className="cta__symbol">ॐ</div>
          <div>
            <h2>Begin your <span>divine journey.</span></h2>
            <p>Choose your temple service and book your experience today.</p>
          </div>
          <button type="button" className="cta__button" onClick={scrollToProducts}>
            Book Now <span>→</span>
          </button>
        </div>
      </section>

      <footer className="temple-footer">
        <div className="temple-container">
          <div className="footer__top">
            <div className="footer__brand">
              <div className="temple-logo temple-logo--footer">
                <div className="temple-logo__symbol">ॐ</div>
                <div className="temple-logo__text">
                  <strong>KDLC</strong>
                  <small>Temple Booking</small>
                </div>
              </div>
              <p>
                A simple and secure platform for booking temple darshan,
                puja, seva and other spiritual experiences.
              </p>
            </div>
            <div className="footer__column">
              <h4>Booking</h4>
              <a href="#products">Darshan</a>
              <a href="#products">Puja</a>
              <a href="#products">Seva</a>
              <a href="#products">Prasad</a>
            </div>
            <div className="footer__column">
              <h4>Explore</h4>
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#timings">Timings</a>
            </div>
            <div className="footer__column">
              <h4>Contact</h4>
              <span>📍 Temple Campus</span>
              <span>📞 +91 00000 00000</span>
              <span>✉️ support@kdlc.com</span>
            </div>
          </div>
          <div className="footer__bottom">
            <span>© 2026 KDLC Temple Booking. All rights reserved.</span>
            <div>
              <a href="#home">Privacy</a>
              <a href="#home">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {showLoginModal && (
        <div className="login-modal-overlay" onClick={closeLoginModal}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="login-modal__close" onClick={closeLoginModal} aria-label="Close">
              ×
            </button>
            <div className="login-modal__icon">🔐</div>
            <h2>Please Login</h2>
            <p>
              Please login to your account before booking{" "}
              <strong>{selectedProduct?.name || "this product"}</strong>.
            </p>
            <div className="login-modal__actions">
              <button type="button" className="login-modal__cancel" onClick={closeLoginModal}>
                Cancel
              </button>
              <button type="button" className="login-modal__login" onClick={handleLoginAndBook}>
                Login & Book <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}