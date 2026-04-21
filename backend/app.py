from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
from dotenv import load_dotenv
import uuid
import midtransclient
import os

snap = midtransclient.Snap(
    is_production=False,
    server_key="ISI_SERVER_KEY_KAMU"
)

load_dotenv()

app = Flask(__name__)
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
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
def clear_expired():
    expired_time = datetime.utcnow() - timedelta(hours=1)

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
    
# MAIN
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
    
   