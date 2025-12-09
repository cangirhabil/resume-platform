import stripe
import os
from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import User, CreditTransaction
from app.api.v1.endpoints.upload import get_current_user
from app.core import security

# Configure Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_placeholder") 
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_placeholder")

router = APIRouter()

@router.post("/create-checkout-session")
def create_checkout_session(current_user: User = Depends(get_current_user)):
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': '5 Resume Credits',
                        },
                        'unit_amount': 2000, # $20.00
                    },
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url='http://localhost:3000/dashboard?success=true',
            cancel_url='http://localhost:3000/dashboard?canceled=true',
            client_reference_id=str(current_user.id),
            metadata={
                "user_id": current_user.id,
                "credits": 5
            }
        )
        return {"url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def webhook(request: Request, stripe_signature: str = Header(None), db: Session = Depends(get_db)):
    payload = await request.body()
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, endpoint_secret
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_session(session, db)

    return {"status": "success"}

def handle_checkout_session(session, db: Session):
    user_id = session.get('client_reference_id')
    # Or get from metadata
    if not user_id:
        print("No user_id in session")
        return

    # Add credits
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user:
        credits_to_add = 5 # Hardcoded for now based on product
        user.credits += credits_to_add
        
        trx = CreditTransaction(
            user_id=user.id,
            amount=credits_to_add,
            description="Purchase - 5 Credits",
            stripe_payment_id=session.get('payment_intent')
        )
        db.add(trx)
        db.commit()
