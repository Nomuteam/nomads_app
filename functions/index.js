"use strict";

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
//const cors = require('cors')({origin: true});

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const paypal = require("paypal-rest-sdk");

const stripe = require("stripe")(functions.config().stripe.testkey);

//class
const Openpay = require("openpay");
//instantiation
const openpay = new Openpay(
  "mgq5juixufztsekvsfim",
  "sk_40adfdb4cb124a8683697328782764ae",
  true
);

// paypal.configure({
//   'mode': 'sandbox', //sandbox or live
//   'client_id': 'AX_ac3tIQ-Mm_3y3WT400FOtKTehvYcSlpe3bvgXUyzwmvtbfaKB3-qMhl7LY0YJ7uXKHmdqiiiD9phn',
//   'client_secret': 'EBZCrebfkicALaKdNYxxcD8cGYfzWIZyYy5vD7Eq_4xxbImO-fl7thcpQrc72_tgvTxdXHHUGUG--1qQ'
// });

paypal.configure({
  mode: "live", //sandbox or live
  client_id:
    "AcNyOAAwZWq6zHNZs79IAggaJ__fakKbBkjPdmpdqJJrcVN1SgPUkcXasyQ9IY9RYtoNCpYtu8WGLsj5",
  client_secret:
    "EJ_r71J9yTKIFnoeZlOKAnVq3W-oC8odV0j8DwseiSadgP0ThGFDn3egfcz7i-4wJOp67OHISBJmxEq-"
});

//Con el routing de Express defino la función
app.post("/createPayment", function(req, res) {
  //Se crea el objeto de pago de paypal
  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: {
      return_url: `${req.protocol}://${req.get("host")}/process/executePayment`,
      cancel_url: `${req.protocol}://${req.get("host")}/cancel`
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "item",
              sku: "item",
              price: req.body.amount,
              currency: "MXN",
              quantity: 1
            }
          ]
        },
        amount: {
          currency: "MXN",
          total: req.body.amount
        },
        description: "Tiene que jalar ptm pf u.u"
      }
    ]
  };

  //Se hace el cargo a paypal
  paypal.payment.create(create_payment_json, function(error, payment) {
    if (error) {
      res.send(error);
    } else {
      //Se guarda en la bd la cantidad, usuario y transaccion actual
      let aux = {
        amount: req.body.amount,
        userID: req.body.uid,
        transactionID: req.body.t_id
      };
      admin
        .database()
        .ref(`/paypal/current`)
        .set(aux);
      console.log("Create Payment Response");
      console.log(payment);
      res.send(payment);
    }
  });
});

//Funcion cloud que ejecuta las acciones
exports.pay = functions.https.onRequest(app);

//SEGUNDO PASO PARA HACER EL PAGO
app.get("/executePayment/", function(req, res) {
  var payment_Id = req.query.paymentId;
  var payer_id = req.query.PayerID;

  //Obtener los datos del actual
  return admin
    .database()
    .ref(`/paypal/current`)
    .once("value")
    .then(snapshot => {
      return snapshot.val();
    })
    .then(customer => {
      var execute_payment_json = {
        payer_id: payer_id,
        transactions: [
          {
            amount: {
              currency: "MXN",
              total: parseInt(customer.amount)
            }
          }
        ]
      };

      var paymentId = payment_Id;

      //Hacer el cargo a la persona y si todo salio bien redirigirlo
      paypal.payment.execute(paymentId, execute_payment_json, function(
        error,
        payment
      ) {
        if (payment.state === "approved") {
          res.redirect(
            "https://www.cardpaymentoptions.com/wp-content/uploads/2015/10/Payment-Approved-Logo.png"
          );
          const date = Date.now();
          //Guardar en la base de datos que si se pudo la operación
          const ref = admin.database().ref("Fundings/currentProcess");
          ref.push({
            paid: true,
            user: customer.userID,
            amount: customer.amount,
            date: date
          });
        } else {
          res.send(error);
          throw error;
        }
      });

      return true;
    });
});

//Función cloud que ejecuta el proceso
exports.process = functions.https.onRequest(app);

exports.opcharge = functions.database
  .ref("/Fundings/{userId}/{paymentId}")
  .onCreate((snapshot, context) => {
    const values = snapshot.val();

    const userId = context.params.userId;
    const paymentId = context.params.paymentId;

    return admin
      .database()
      .ref(`/Users/${userId}`)
      .once("value")
      .then(snapshot => {
        return snapshot.val();
      })
      .then(customer => {
        const amount = values.amount;
        const idempotency_key = paymentId; // prevent duplicate charges
        const source = values.token;
        const session = values.session;

        var newCustomer = {
          name: customer.first_name.split(" ")[0],
          email: customer.email,
          last_name: customer.first_name.split(" ")[1],
          requires_account: false,
          address: {
            city: "Queretaro",
            state: "Queretaro",
            line1: "Calle Morelos no 10",
            line2: "col. san pablo",
            postal_code: "76000",
            country_code: "MX"
          },
          phone_number: customer.phone
        };

        openpay.customers.create(newCustomer, function(error, body) {
          // admin.database()
          //      .ref(`/testing/${customer.index}/datos`)
          //      .set(body);

          var newCharge = {
            source_id: source,
            method: "card",
            amount: amount,
            description: "Fondeo de Nomu",
            device_session_id: session
          };

          openpay.customers.charges.create(body.id, newCharge, function(
            error,
            charge
          ) {
            if (error)
              admin
                .database()
                .ref(`/Fundings/${userId}/${paymentId}/errors`)
                .set(error);
            else
              admin
                .database()
                .ref(`/Fundings/${userId}/${paymentId}/charge`)
                .set(charge);
          });
        });

        //  var newCharge = {
        //    'source_id' : source,
        //    'method' : 'card',
        //    'amount' : amount,
        //    'description' : 'Fondeo de Movix',
        //    'device_session_id' : session,
        //    'customer' : {
        //         'name' : customer.name.split(' ')[0],
        //         'last_name' : customer.name.split(' ')[1],
        //         'phone_number' : customer.phone,
        //         'email' : customer.email
        //   }
        //
        //   };
        //
        //     admin.database()
        //          .ref(`/testing/${customer.index}`)
        //          .set(newCharge);
        //
        //
        //
        // openpay.customers.charges.create(newCharge, function(error, charge) {
        //   if (error) throw error;
        //   console.log(charge);
        //  });
        // if (error) throw error;
        // console.log(charge);
        // if(error){
        //   admin.database()
        //        .ref(`/testing/${customer.index}`)
        //        .set(error.description);
        // }
        // else{
        //   admin.database()
        //        .ref(`/testing/${customer.index}`)
        //        .set(charge);
        // }

        return true;
      });
    //
    // .then(charge => {
    //
    //   admin.database()
    //        .ref(`/Fundings/${userId}/${paymentId}/charge`)
    //        .set(charge);
    //
    //          return true;
    //    })
  });

exports.stripeCharge = functions.database
  .ref("/Payments2/{userId}/{paymentId}")
  .onWrite((change, context) => {
    const payment = change.after.val();
    const userId = context.params.userId;
    const paymentId = context.params.paymentId;

    // checks if payment exists or if it has already been charged
    if (!payment || payment.charge) return;

    return admin
      .database()
      .ref(`/Users/${userId}`)
      .once("value")
      .then(snapshot => {
        return snapshot.val();
      })
      .then(customer => {
        const amount = payment.amount;
        const idempotency_key = paymentId; // prevent duplicate charges
        const source = payment.token.id;
        const currency = "usd";
        const charge = { amount, currency, source };

        return stripe.charges.create(charge, { idempotency_key });
      })

      .then(charge => {
        admin
          .database()
          .ref(`/Payments/${userId}/${paymentId}/charge`)
          .set(charge);

        return true;
      });
  });

//Funcion para mandar correo

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'hola@nomu.fit',
      pass: 'Soccer272727.'
  }
});

exports.sendMail = functions.https.onRequest((request, responde) => {
    // getting dest email by query string
    const dest = request.body.dest;
    //const tipoCorreo = request.query.tipoCorreo;
    

    let html = request.body.texto;
    let subject = request.body.titulo;
    //correo para nuevo usuario
    /*
    if(Number(tipoCorreo) === 1){
      subject = 'BIENVENIDO A NOMU!'
      html = '<p>\
      Hola, bienvenido a Nomu! <br/><br/>\
      Gracias por unirte a Nomu! Te invitamos a que explores toda la oferta que hay cerca de ti! <br/><br/>\
      1. Explora las mejores clases, studios, gyms, eventos, instructores, actividades y mucho mas!<br/><br/>\
      2. Reserva lo que quieras!<br/><br/>\
      3. Paga lo que usas. Ve a tu perfil, entra en tu ‘wallet’ y compra NOMS! Aceptamos Tarjeta o Paypal<br/><br/>\
      4. Asiste! Diviértete y cualquier cosa has no lo saber!<br/><br/>\
      Nomu Team<br/><br/>\
      hola@nomu.fit</p>'
    }

    if(Number(tipoCorreo) === 2){
      const noms = request.query.noms;
      subject = 'Compra de noms exitosa!'
      html = '<p>\
      Hola! <br/><br/>\
      Gracias por comprar '+noms.toString()+' noms. Usalos donde mas quieras!<br/><br/>\
      Recuerda que se expiran dentro de 3 meses!<br/><br/>\
      Nomu Team<br/><br/>\
      hola@nomu.fit</p>'
    }

    //*(Nombre de clase), Nombre de negocio, el día XXX a XXX hora.
    if(Number(tipoCorreo) === 3){
      const servicio = request.query.servicio;
      subject = 'Reservación exitosa!'
      html = '<p>\
      Hola! <br/><br/>\
      Has reservado en '+servicio+' <br/><br/>\
      Politica de cancelación ‘X’ horas<br/><br/>\
      Nomu Team<br/><br/>\
      hola@nomu.fit</p>'
    }
    */
    console.log('destinatario', dest);
    const mailOptions = {
      from: "Nomu <Hola@nomu.fit>", // Something like: Jane Doe <janedoe@gmail.com>
      to: dest,
      subject: subject, // email subject
      html: html
    };

    // returning result
    return transporter.sendMail(mailOptions, (erro, info) => {
      if (erro) {
        return responde.send(erro.toString());
      }
      return responde.send("Sended");
    });
});
