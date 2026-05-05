import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Phone } from "lucide-react";
import IASBadge from "./IASBadge";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [dynamicPages, setDynamicPages] = useState([]);

  useEffect(() => {
    const fetchDynamicPages = async () => {
      try {
        const response = await fetch((window.API_BASE||'') + '/api/nav-pages?target=footer');
        const data = await response.json();
        if (data.success) {
          setDynamicPages(data.pages);
        }
      } catch (err) {
        console.error('Failed to fetch footer pages:', err);
      }
    };
    fetchDynamicPages();
  }, []);

  return (
    <footer className="bg-brand-800 text-white border-none">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 lg:grid-cols-6 md:px-6">
        <div>
          <h3 className="text-lg font-semibold">FETC</h3>
          <p className="mt-2 text-sm text-slate-200">
            Helping students achieve global education dreams through expert
            guidance and quality training.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
          <ul className="mt-2 space-y-4 text-sm text-slate-200">
            <li className="flex flex-col gap-1">
              <span className="font-medium text-white">Vesu Branch:</span>
              <a
                href="https://maps.app.goo.gl/jBgo56XBAkux5twC6?g_st=iw"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-50 transition-colors"
              >
                2nd floor, 239, Roongta Signature, Nr. Shyam Mandir Vesu, Surat - 395007
              </a>
            </li>
            {/* <li className="flex flex-col gap-1">
              <span className="font-medium text-white">Varachha Branch:</span>
              <a
                href="https://maps.app.goo.gl/se2DsLDEUgS7W8EM6?g_st=iw"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-50 transition-colors"
              >
                Radhika Optima, 328-329, opp. YAMUNA CHOWK, River Heaven, Mota Varachha, Surat, Gujarat 394101
              </a>
            </li> */}
            <li className="flex items-center gap-2 pt-2">
              <Phone size={14} /> Phone: +91-8854347201
            </li>
            <li>Email: consult@fetc.in</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            <li>
              <a href="/contact" className="hover:text-slate-50 transition-colors">Contact Us</a>
            </li>
            <li>
              <a href="/about" className="hover:text-slate-50 transition-colors">About Us</a>
            </li>
            <li>
              <a href="/faq" className="hover:text-slate-50 transition-colors">FAQs</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Policies</h4>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            <li>
              <a href="/terms" className="hover:text-slate-50 transition-colors">Terms &amp; Conditions</a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-slate-50 transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="/refund" className="hover:text-slate-50 transition-colors">Refund Policy</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Follow Us</h4>
          <div className="mt-3 flex gap-2">
            {[
              {
                id: "FB",
                Icon: FaFacebook,
                url: "https://www.facebook.com/profile.php?id=61561283426412",
              },
              {
                id: "IG",
                Icon: FaInstagram,
                url: "https://www.instagram.com/fetc_trainingcentre?igsh=MXNlc3JweDg2M215dg==",
              },
              {
                id: "LI",
                Icon: FaLinkedin,
                url: "https://www.linkedin.com/company/foreign-english-testing-capital/",
              },
            ].map(({ id, Icon, url }) => (
              <a
                key={id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-100 transition hover:bg-white/20"
                aria-label={`${id} social link`}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Accreditations</h4>
          <div className="mt-3">
            <IASBadge />
          </div>
        </div>


      </div>
    </footer>
  );
}

export default Footer;
