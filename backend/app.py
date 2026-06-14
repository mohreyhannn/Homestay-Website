from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import render_template
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import uuid
import midtransclient
import os

snap = midtransclient.Snap(
    is_production=False,
    server_key="ISI_SERVER_KEY_KAMU"
)

load_dotenv()

app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static"
)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")

db = SQLAlchemy(app)
CORS(app)



# MODEL BOOKING
class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.String(50))
    check_in = db.Column(db.Date)
    check_out = db.Column(db.Date)
    status = db.Column(db.String(20))
    order_id = db.Column(db.String(100))
    total = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

# MODEL KAMAR
class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nama_kamar = db.Column(db.String(100), nullable=False)
    harga = db.Column(db.Integer, nullable=False)
    deskripsi = db.Column(db.Text)
    gambar = db.Column(db.String(255))
    status = db.Column(db.String(20), default="active")
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
# MODEL REVIEW / TANGGAPAN
class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(100), nullable=False)
    isi = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
def clear_expired():
    expired_time = datetime.now(timezone.utc) - timedelta(hours=1)

    expired = Booking.query.filter(
        Booking.status == "pending",
        Booking.created_at < expired_time
    ).all()

    for b in expired:
        b.status = "expired"

    db.session.commit()
    
def is_available(room_id, check_in, check_out):
    conflict = Booking.query.filter(
        Booking.room_id == room_id,
        Booking.status.in_(["pending", "paid"]),
        Booking.check_out > check_in,
        Booking.check_in < check_out
    ).first()

    return conflict is None

class RoomReview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.String(50), nullable=False)
    nama = db.Column(db.String(100), nullable=False)
    isi = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

# API ENDPOINTS
@app.route("/api/booking", methods=["POST"])
def booking():
    clear_expired()
    data = request.json

    check_in = datetime.strptime(data['check_in'], "%Y-%m-%d")
    check_out = datetime.strptime(data['check_out'], "%Y-%m-%d")
    
    if check_in < datetime.today():
        return {"error": "Tanggal tidak valid"}, 400

    if check_out <= check_in:
        return {"error": "Tanggal tidak valid"}, 400


    if not is_available(data['room_id'], check_in, check_out):
        return {"error": "Tanggal sudah dibooking"}, 400

    order_id = str(uuid.uuid4())

    new_booking = Booking(
        room_id=data['room_id'],
        check_in=check_in,
        check_out=check_out,
        status="pending",
        order_id=order_id,
        total=data.get("total", 0),
    )

    db.session.add(new_booking)
    db.session.commit()

    return {"order_id": order_id}

@app.route("/api/booked/<room_id>", methods=["GET"])
def booked(room_id):
    clear_expired()
    
    bookings = Booking.query.filter(
        Booking.room_id == room_id,
        Booking.status.in_(["pending", "paid"])
    ).all()

    result = []
    for b in bookings:
        result.append({
            "from": b.check_in.strftime("%Y-%m-%d"),
            "to": b.check_out.strftime("%Y-%m-%d")
        })

    return jsonify(result)

@app.route("/api/admin/bookings", methods=["GET"])
def get_bookings():
    bookings = Booking.query.order_by(Booking.created_at.desc()).all()

    result = []
    for b in bookings:
        result.append({
            "id": b.id,
            "room_id": b.room_id,
            "check_in": b.check_in.strftime("%Y-%m-%d"),
            "check_out": b.check_out.strftime("%Y-%m-%d"),
            "status": b.status,
            "total": b.total,
            "created_at": b.created_at.strftime("%Y-%m-%d %H:%M")
        })

    return jsonify(result)

@app.route("/api/admin/rooms", methods=["GET"])
def get_rooms():
    rooms = Room.query.order_by(Room.id.asc()).all()

    result = []
    for r in rooms:
        result.append({
            "id": r.id,
            "nama_kamar": r.nama_kamar,
            "harga": r.harga,
            "deskripsi": r.deskripsi,
            "gambar": r.gambar,
            "status": r.status,
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M")
        })

    return jsonify(result)


@app.route("/api/admin/rooms", methods=["POST"])
def add_room():
    data = request.json

    room = Room(
        nama_kamar=data["nama_kamar"],
        harga=data["harga"],
        deskripsi=data.get("deskripsi", ""),
        gambar=data.get("gambar", ""),
        status=data.get("status", "active")
    )

    db.session.add(room)
    db.session.commit()

    return jsonify({"message": "Room berhasil ditambahkan"})


@app.route("/api/admin/rooms/<int:id>", methods=["PUT"])
def update_room(id):
    data = request.json
    room = db.session.get(Room, id)

    if not room:
        return jsonify({"error": "Room tidak ditemukan"}), 404

    room.nama_kamar = data.get("nama_kamar", room.nama_kamar)
    room.harga = data.get("harga", room.harga)
    room.deskripsi = data.get("deskripsi", room.deskripsi)
    room.gambar = data.get("gambar", room.gambar)
    room.status = data.get("status", room.status)

    db.session.commit()

    return jsonify({"message": "Room berhasil diupdate"})


@app.route("/api/admin/rooms/<int:id>", methods=["DELETE"])
def delete_room(id):
    room = db.session.get(Room, id)

    if not room:
        return jsonify({"error": "Room tidak ditemukan"}), 404

    db.session.delete(room)
    db.session.commit()

    return jsonify({"message": "Room berhasil dihapus"})

@app.route("/api/admin/update-status", methods=["POST"])
def update_status():
    data = request.json

    booking = db.session.get(Booking, data["id"])

    if not booking:
        return {"error": "Booking tidak ditemukan"}, 404

    booking.status = data["status"]
    db.session.commit()

    return {"message": "Status berhasil diupdate"}

@app.route("/api/admin/reset", methods=["POST"])
def reset():
    Booking.query.delete()
    db.session.commit()
    return {"message": "Database direset"}

@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

@app.route("/booking", methods=["GET"])
def booking_page():   # ← beda nama
    return render_template("booking.html")

@app.route("/admin", methods=["GET"])
def admin_page():
    return render_template("admin.html")

@app.route("/detail-kamar", methods=["GET"])
def detail_kamar():
    return render_template("detail-kamar.html")

@app.route("/api/reviews", methods=["GET"])
def get_reviews():
    global_reviews = Review.query.all()
    room_reviews = RoomReview.query.all()

    result = []

    # global
    for r in global_reviews:
        result.append({
            "nama": r.nama,
            "isi": r.isi,
            "rating": r.rating,
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M")
        })

    # room review
    for r in room_reviews:
        result.append({
            "nama": r.nama,
            "isi": r.isi,
            "rating": r.rating,
            "room_id": r.room_id,
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M")
        })

    result.sort(key=lambda x: x["created_at"], reverse=True)

    return jsonify(result)

@app.route("/api/reviews", methods=["POST"])
def add_review():
    data = request.json

    nama = data.get("nama")
    isi = data.get("isi")
    rating = data.get("rating")

    if not nama or not isi or not rating:
        return {"error": "Nama, tanggapan, dan rating wajib diisi"}, 400

    rating = int(rating)

    if rating < 1 or rating > 5:
        return {"error": "Rating harus 1 sampai 5"}, 400

    new_review = Review(
        nama=nama,
        isi=isi,
        rating=rating
    )

    db.session.add(new_review)
    db.session.commit()

    return {"message": "Review berhasil dikirim"}, 201
    
@app.route("/api/room-reviews/<room_id>", methods=["GET"])
def get_room_reviews(room_id):
    reviews = RoomReview.query.filter_by(room_id=room_id).order_by(RoomReview.created_at.desc()).all()

    return jsonify([
        {
            "id": r.id,
            "room_id": r.room_id,
            "nama": r.nama,
            "isi": r.isi,
            "rating": r.rating,
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M")
        }
        for r in reviews
    ])
    
@app.route("/api/room-reviews", methods=["POST"])
def add_room_review():
    data = request.json

    room_id = data.get("room_id")
    nama = data.get("nama")
    isi = data.get("isi")
    rating = data.get("rating")

    if not room_id or not nama or not isi or not rating:
        return {"error": "Semua field wajib diisi"}, 400

    rating = int(rating)

    if rating < 1 or rating > 5:
        return {"error": "Rating harus 1 sampai 5"}, 400

    review = RoomReview(
        room_id=room_id,
        nama=nama,
        isi=isi,
        rating=rating
    )

    db.session.add(review)
    db.session.commit()

    return {"message": "Review kamar berhasil dikirim"}, 201
# MAIN
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
    
   