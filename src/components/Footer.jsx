import { Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="mt-16 bg-brand-800 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <h3 className="text-lg font-semibold">FETC</h3>
          <p className="mt-2 text-sm text-slate-200">
            Helping students achieve global education dreams through expert
            guidance and quality training.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            <li>Address: Surat, Gujarat</li>
            <li className="flex items-center gap-2">
              <Phone size={14} /> Phone: +91-XXXXXXXXXX
            </li>
            <li>Email: info@fetc.example</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Follow Us</h4>
          <div className="mt-3 flex gap-2">
            {["FB", "IG", "LI"].map((item) => (
              <a
                key={item}
                href="/"
                onClick={(e) => e.preventDefault()}
                className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-white/20"
                aria-label={`${item} social link`}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
