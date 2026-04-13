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
              <Phone size={14} /> Phone: +91-9033347201
            </li>
            <li>Email: info@fetc.in</li>
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
