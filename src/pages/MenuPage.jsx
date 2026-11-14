
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../constants/constants";
import QRCode from "react-qr-code";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LOGO from "../assets/panchos.png";
import {
  faPhone,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { optimizeImage } from "../utils/optimizeImage";

const CLIENT_ID = "anahuac";

function Menu() {
  const { slug } = useParams();

  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState(null);

  // Fetch menu using the slug from the URL
  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setMenu(null);

      try {
        const res = await fetch(
          `${BACKEND_URL}/api/${CLIENT_ID}/public-menu/${slug}`
        );

        if (!res.ok) {
          throw new Error("Menu not found");
        }

        const data = await res.json();
        setMenu(data);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
        setMenu(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchMenu();
    } else {
      setLoading(false);
    }
  }, [slug]);

  // Build sections object
  const sections = {};

  menu?.sections?.forEach((section) => {
    sections[section.section] = [
      ...(section.groups?.flatMap((g) => g.items) || []),
      ...(section.items || []),
    ];
  });

  return (
    <div className="menu-container">

      {/* Loading */}
      {loading && (
        <p style={{ textAlign: "center" }}>
          Loading menu...
        </p>
      )}

      {/* No Menu */}
      {!loading && (!menu || !menu.sections) && (
        <p style={{ textAlign: "center" }}>
          No menu available
        </p>
      )}

      {/* Menu */}
      {!loading && menu?.sections && (
        <>
          <img className="logo" src={LOGO} alt="Restaurant logo" />

          <div className="restaurant-info">
            <div className="left-box">
              <p>
                <FontAwesomeIcon icon={faPhone} /> 404-325-2898
              </p>
            </div>

            <div className="right-box">
              <p className="location">
                <FontAwesomeIcon icon={faLocationDot} /> Brookhaven, GA
              </p>
            </div>
          </div>

          <div className="menu-content">
            {Object.entries(sections).map(
              ([sectionName, items]) => (
                <section
                  key={sectionName}
                  className="menu-section"
                >
                  <button
                    className="section-toggle"
                    onClick={() =>
                      setOpenSection(
                        openSection === sectionName
                          ? null
                          : sectionName
                      )
                    }
                  >
                    <span>
                      {sectionName.toUpperCase()}
                    </span>

                    <span className="toggle-icon">
                      {openSection === sectionName ? "−" : "+"}
                    </span>
                  </button>

                  {openSection === sectionName && (
                    <div className="grid">
                      {items.map((item) => (
                        <div
                          key={item.id || item._id}
                          className="option-card"
                        >
                          {item.image && (
                            <div className="product-img-wrapper">
                              <img
                                src={optimizeImage(item.image)}
                                alt={item.name}
                                className="product-img"
                                loading="lazy"
                              />
                            </div>
                          )}

                          <div className="item-details">
                            {item.basePrice != null ? (
                              <>
                                <div className="price-name">
                                  $
                                  {Number(item.basePrice).toFixed(2)}{" "}
                                  {item.name}
                                </div>

                                {item.description && (
                                  <div className="description">
                                    {item.description}
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="item-name">
                                  {item.name}
                                </div>

                                {item.description && (
                                  <div className="description">
                                    {item.description}
                                  </div>
                                )}

                                <div className="variants">
                                  {item.modifiers
                                    ?.filter(
                                      (modifier) =>
                                        modifier.type === "variant"
                                    )
                                    .map((variant) => (
                                      <div
                                        key={variant.id}
                                        className="variant-row"
                                      >
                                        <span>{variant.name}</span>

                                        <span>
                                          $
                                          {Number(
                                            variant.price
                                          ).toFixed(2)}
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )
            )}
          </div>
        </>
      )}

      {/* QR Code */}
      {menu?.slug && (
        <div className="qr-section">
          <h3>Print This QR Code</h3>

          <QRCode
            value={`https://qr-user-menu.netlify.app/menu/${menu.slug}`}
            size={220}
          />
        </div>
      )}
    </div>
  );
}

export default Menu;
