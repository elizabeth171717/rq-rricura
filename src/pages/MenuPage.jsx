import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../constants/constants";
import QRCode from "react-qr-code";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LOGO from "../assets/rricura-logo.png";
import {
  faPhone,
  faClock,
  faLocationDot,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { optimizeImage } from "../utils/optimizeImage"

const CLIENT_ID = "anahuac";
const RESTAURANT_SLUG = "rricura-tamales";

function Menu() {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState(null);

  // Fetch menu
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/${CLIENT_ID}/public-menu/${RESTAURANT_SLUG}`
        );

        const data = await res.json();

        setMenu(data);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

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
           
<img className="logo" src={LOGO}/>
<div className="restaurant-info">
<div className="left-box">
 
  <p>
    <FontAwesomeIcon icon={faClock} /> Mon–Sat 7AM–9PM
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
                        {openSection === sectionName
                          ? "−"
                          : "+"}
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
                              {/* ONE PRICE */}
                              {item.basePrice != null ? (
                                <>
                                  <div className="price-name">
                                    $
                                    {Number(
                                      item.basePrice
                                    ).toFixed(2)}{" "}
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
                                  {/* MULTIPLE PRICES */}
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
                                          modifier.type ===
                                          "variant"
                                      )
                                      .map((variant) => (
                                        <div
                                          key={variant.id}
                                          className="variant-row"
                                        >
                                          <span>
                                            {variant.name}
                                          </span>

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
        {menu?.slug && (
  <div className="qr-section">
   {/*<QRCode
      value={`https://rq-rricura.netlify.app/ `}
      size={220}
    /> */}
    
  </div>
)}
      </div>
  
  );
}

export default Menu;