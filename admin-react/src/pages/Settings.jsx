import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Settings() {
  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 space-y-6">
        <Topbar />

        <div>
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-500">Atur informasi sistem dashboard.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">General Settings</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="hotelName" className="block text-sm font-medium">
                Nama Hotel
              </label>

              <input
                id="hotelName"
                type="text"
                className="w-full border rounded-xl px-4 py-2"
              />
            </div>

            <div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Email Admin
                </label>

                <input
                  id="email"
                  type="email"
                  defaultValue="admin@algamas.com"
                  className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                Mata Uang
              </label>

              <select
                id="currency"
                className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="IDR">Rupiah Indonesia (IDR)</option>
                <option value="USD">Dollar Amerika (USD)</option>
              </select>
            </div>

            <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl">
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
