from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import uuid
import midtransclient

snap = midtransclient.Snap(
    is_production=False,
    server_key="ISI_SERVER_KEY_KAMU"
)


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:rynnn28@localhost/homestay_db'

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
    
    
def is_available(room_id, check_in, check_out):
    conflict = Booking.query.filter(
        Booking.room_id == room_id,
        Booking.status != "cancel",
        Booking.check_out > check_in,
        Booking.check_in < check_out
    ).first()

    return conflict is None

# API ENDPOINTS
@app.route("/api/booking", methods=["POST"])
def booking():
    data = request.json

    check_in = datetime.strptime(data['check_in'], "%Y-%m-%d")
    check_out = datetime.strptime(data['check_out'], "%Y-%m-%d")

    if not is_available(data['room_id'], check_in, check_out):
        return {"error": "Tanggal sudah dibooking"}, 400

    order_id = str(uuid.uuid4())

    new_booking = Booking(
        room_id=data['room_id'],
        check_in=check_in,
        check_out=check_out,
        status="pending",
        order_id=order_id
    )

    db.session.add(new_booking)
    db.session.commit()

    return {"order_id": order_id}

@app.route("/api/pay", methods=["POST"])
def pay():
    data = request.json

    transaction = snap.create_transaction({
        "transaction_details": {
            "order_id": data["order_id"],
            "gross_amount": data["amount"]
        }
    })

    return {"token": transaction["token"]}

@app.route("/api/booked/<room_id>", methods=["GET"])
def booked(room_id):
    bookings = Booking.query.filter_by(room_id=room_id).all()

    result = []
    for b in bookings:
        result.append({
            "from": b.check_in.strftime("%Y-%m-%d"),
            "to": b.check_out.strftime("%Y-%m-%d")
        })

    return jsonify(result)

@app.route('/payment/notification', methods=['POST'])
def payment_notification():
    data = request.json

    booking = Booking.query.filter_by(order_id=data['order_id']).first()

    if not booking:
        return "Not Found", 404

    status = data['transaction_status']

    if status == "settlement":
        booking.status = "paid"
    elif status in ["expire", "cancel"]:
        booking.status = "cancel"

    db.session.commit()

    return "OK"
    
    
    
    
# MAIN
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
    
   