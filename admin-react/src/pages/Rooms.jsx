import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const API_URL = "http://127.0.0.1:5000";

const initialForm = {
  nama_kamar: "",
  harga: "",
  deskripsi: "",
  gambar: "",
  status: "active",
};

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [previewImage, setPreviewImage] = useState("");

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/rooms`);

      if (!res.ok) {
        throw new Error("Gagal mengambil data rooms");
      }

      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error("ERROR FETCH ROOMS:", error);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      void fetchRooms();
    }, 0);
  }, [fetchRooms]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingRoom(null);
    setPreviewImage("");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${API_URL}/api/admin/upload-room-image`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal upload gambar");
      }

      setForm((prev) => ({
        ...prev,
        gambar: data.filename,
      }));

      setPreviewImage(`${API_URL}/static/images/${data.filename}`);
    } catch (error) {
      console.error("ERROR UPLOAD IMAGE:", error);
      alert(error.message || "Gagal upload gambar");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      harga: Number(form.harga),
    };

    try {
      const url = editingRoom
        ? `${API_URL}/api/admin/rooms/${editingRoom.id}`
        : `${API_URL}/api/admin/rooms`;

      const method = editingRoom ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan data kamar");
      }

      resetForm();
      await fetchRooms();
    } catch (error) {
      console.error("ERROR SAVE ROOM:", error);
      alert("Gagal menyimpan data kamar");
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);

    setForm({
      nama_kamar: room.nama_kamar || "",
      harga: room.harga || "",
      deskripsi: room.deskripsi || "",
      gambar: room.gambar || "",
      status: room.status || "active",
    });

    setPreviewImage(
      room.gambar ? `${API_URL}/static/images/${room.gambar}` : "",
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Kamar?",
      text: "Data tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/rooms/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus kamar");
      }

      await fetchRooms();
    } catch (error) {
      console.error("ERROR DELETE ROOM:", error);
      alert("Gagal menghapus kamar");
    }
  };

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 space-y-6">
        <Topbar />

        <div>
          <h1 className="text-2xl font-bold text-slate-800">Room Management</h1>
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
            onChange={(e) => setForm({ ...form, nama_kamar: e.target.value })}
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

          <div className="space-y-2">
            <input
              type="file"
              accept="image/png,image/jpg,image/jpeg,image/webp"
              onChange={handleImageUpload}
              className="border rounded-xl px-4 py-2 w-full"
            />

            {form.gambar && (
              <p className="text-xs text-slate-500">File: {form.gambar}</p>
            )}

            {previewImage && (
              <img
                src={previewImage}
                alt="Preview kamar"
                className="w-full h-32 object-cover rounded-xl border"
              />
            )}
          </div>

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
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            className="border rounded-xl px-4 py-2 md:col-span-2"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl md:col-span-2"
          >
            {editingRoom ? "💾 Update Kamar" : "+ Tambah Kamar"}
          </button>

          {editingRoom && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded-xl md:col-span-2"
            >
              Batal Edit
            </button>
          )}
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

                    <td className="py-4 px-3 font-medium">{room.nama_kamar}</td>

                    <td className="py-4 px-3">
                      Rp {Number(room.harga || 0).toLocaleString("id-ID")}
                    </td>

                    <td className="py-4 px-3">
                      {room.gambar ? (
                        <img
                          src={`${API_URL}/static/images/${room.gambar}`}
                          alt={room.nama_kamar}
                          className="w-20 h-14 object-cover rounded-lg border"
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="py-4 px-3 capitalize">{room.status}</td>

                    <td className="py-4 px-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(room)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(room.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                        >
                          Hapus
                        </button>
                      </div>
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
