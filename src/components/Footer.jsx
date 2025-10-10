const Footer = () => {
  return (
    <footer className="bg-base-200 py-10 mt-10">
      <div className="align-element grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {/* Visit Us */}
        <div className="card bg-base-100 shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
          <p className="text-sm">
            No.12A, Sundarajapuram, HH Road, Madurai, Tamil Nadu - 625011
          </p>
        </div>

        {/* Contact Us */}
        <div className="card bg-base-100 shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p className="text-sm">
            📞 +91 97514 55300 <br />
            ☎️ 0452 - 4355300 <br />
            ✉️ manager.bakerskart@gmail.com
          </p>
        </div>

        {/* Working Hours */}
        <div className="card bg-base-100 shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-2">Working Hours</h3>
          <p className="text-sm">
            Mon – Sat: 9:00 AM – 9:00 PM <br />
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-8 text-sm opacity-70">
        © {new Date().getFullYear().toString()} <span className="font-semibold">Bakerskart</span> – All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
