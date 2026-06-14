import { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const API_URL = "http://127.0.0.1:5000";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    nama_kamar: "",
    harga: "",
    deskripsi: "",
    gambar: "",
    status: "active",
  });

  const fetchRooms = useCallback(async () => {
  const res = await fetch(`${API_URL}/api/admin/rooms`);
  const data = await res.json();
  setRooms(data);
}, []);

  useEffect(() => {
  setTimeout(() => {
    fetchRooms();
  }, 0);
}, [fetchRooms]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API_URL}/api/admin/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        harga: Number(form.harga),
      }),
    });

    setForm({
      nama_kamar: "",
      harga: "",
      deskripsi: "",
      gambar: "",
      status: "active",
    });

    fetchRooms();
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus kamar ini?")) return;

    await fetch(`${API_URL}/api/admin/rooms/${id}`, {
      method: "DELETE",
    });

    fetchRooms();
  };

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 space-y-6">
        <Topbar />

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Room Management
          </h1>
          <p className="text-slate-500">
            Kelola data kamar homestay dari dashboard admin.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Nama kamar"
            value={form.nama_kamar}
            onChange={(e) =>
              setForm({ ...form, nama_kamar: e.target.value })
            }
            className="border rounded-xl px-4 py-2"
            required
          />

          <input
            type="number"
            placeholder="Harga"
            value={form.harga}
            onChange={(e) => setForm({ ...form, harga: e.target.value })}
            className="border rounded-xl px-4 py-2"
            required
          />

          <input
            type="text"
            placeholder="Nama file gambar, contoh: kamar1.jpeg"
            value={form.gambar}
            onChange={(e) => setForm({ ...form, gambar: e.target.value })}
            className="border rounded-xl px-4 py-2"
          />

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border rounded-xl px-4 py-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <textarea
            placeholder="Deskripsi kamar"
            value={form.deskripsi}
            onChange={(e) =>
              setForm({ ...form, deskripsi: e.target.value })
            }
            className="border rounded-xl px-4 py-2 md:col-span-2"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl md:col-span-2"
          >
            + Tambah Kamar
          </button>
        </form>

        <div className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Daftar Kamar</h2>

          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="text-left border-b text-slate-500 bg-slate-50">
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Nama Kamar</th>
                <th className="py-3 px-3">Harga</th>
                <th className="py-3 px-3">Gambar</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-500">
                    Belum ada data kamar.
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id} className="border-b hover:bg-slate-50">
                    <td className="py-4 px-3">#{room.id}</td>
                    <td className="py-4 px-3 font-medium">
                      {room.nama_kamar}
                    </td>
                    <td className="py-4 px-3">
                      Rp {Number(room.harga).toLocaleString("id-ID")}
                    </td>
                    <td className="py-4 px-3">{room.gambar || "-"}</td>
                    <td className="py-4 px-3 capitalize">{room.status}</td>
                    <td className="py-4 px-3">
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}