const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const sha1 = require('sha1');
const https =require('https');
const fs =require('fs');
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.middlewares();
        this.routes();
    }
    createServer() {
        https.createServer({
            key: fs.readFileSync('rsaprivkey.pem'),
            cert:fs.readFileSync('dsacert.pem')
        }, this.app).listen(this.port,() => {
            console.log("https://127.0.0.1:" + this.port) ;
        });
    }

    middlewares() {
        this.app.use(express.static('public'));
        this.app.set('view engine', 'ejs');

        this.app.use(cookieParser());

        this.app.use(session({
            secret: "amar",
            saveUninitialized: true,
            resave: true
        }));
    }

    routes() {
        this.app.get('/hola', (req, res) => {
            if (res.session.user) {
                res.send("iniciasre secion " + req.session.user.nam);
            } else {
                res.send("NO has inisado secion");
            }
        });

        this.app.get('/login', (req, res) => {

            let email = req.query.email;
            let password = req.query.password;
            console.log(password);

            password= sha1(password);
            console.log(password);
            // conexión bd
            let mysql = require('mysql');

            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "appweb"
            });

            con.connect((err) => {
                if (err) {
                    console.error("Error al conectar a la base de datos: ", err);
                    res.status(500).send("Error interno del servidor");
                    return;
                }

                console.log("¡Conectado a la base de datos!");

                let sql = "SELECT * FROM ialumnos WHERE email = '" + email + "'";
                
                // SQL y usar parámetros para evitar SQL injection
                console.log("Consulta enviada:" + sql);
                
                con.query(sql, (err, result) => {
                    if (err) throw err;
            
                    // Revisar si existe el usuario
                    if (result.length > 0) {
                        // Comparar la contraseña ingresada con la almacenada en la base de datos
                        if (result[0].password === password) {
                            console.log(result);
                            let user ={
                                nam: email,
                                rol: result[0].rol
                            };
                            console.log(result.password)
                            req.session.email = email;
                            req.session.save();
                            res.render("quinielas",{email: email});
                        } else {
                            res.send("Contraseña incorrecta");
                        }
                    } else {
                        res.send("Usuario no existe");
                    }
                });
            });

        });


        this.app.get('/registrardo', (req, res) => {
            let idStudent = req.query.idStudent;
            let firstname = req.query.firstname;
            let lname = req.query.lname;
            let lastname = req.query.lastname;
            let age = req.query.age;
            let country = req.query.country;
            let password = req.query.password;
            console.log(password);
            let email = req.query.email;
            let phone = req.query.phone;
            
            password= sha1(password);
            console.log(password);

            let mysql = require('mysql');

            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "appweb"
            });

            con.connect((err) => {
                if (err) throw err;
                console.log("Connected!");

                let sql = "INSERT INTO ialumnos (`firstname`, `lastname`, `edad`, `country`, `password`, `email`, `phone`) VALUES ('" + firstname + "','" + lastname + "', " + age + " , '" + country + "','" + password + "','" + email + "','" + phone + "')";

                con.query(sql, (err, result) => {
                    if (err) throw err;

                    console.log("1 record inserted");

                    // Obtener el idStudent del resultado de la inserción
                    let insertedId = result.insertId;

                    res.render('registrado', {
                        idStudent: insertedId,
                        Nombre: firstname,
                        country: country
                    });
                });
            });
        });
        this.app.get('/quinielas', (req, res) => {
            let id_pronostico = req.query.id_pronostico;
            let pronostico1 = req.query.partido1;
            let pronostico2 = req.query.partido2;
            let pronostico3 = req.query.partido3;
            let pronostico4 = req.query.partido4;
            let pronostico5 = req.query.partido5;
            let nombre_partido = req.query.nombre_partido;
            let phone = req.query.phone;

            let mysql = require('mysql');

            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "appweb"
            });

            con.connect((err) => {
                if (err) throw err;
                console.log("Connected!");

                let sql = "INSERT INTO pronostico (`pronostico`) VALUES ('" + pronostico1 + "') , ('" + pronostico2 + "') , ('" + pronostico3 + "') , ('" + pronostico4 + "') , ('" + pronostico5 + "')";
                
                //UPDATE `ialumnos` SET `password` =     'lenel nuevo' WHERE `ialumnos`.`idStudent` = 21;
                con.query(sql, (err, result) => {
                    if (err) throw err;

                    console.log("1 record inserted");
                    let insertedId = result.insertId;

                    res.render('quinielasresult', {
                        pronostico1: pronostico1,
                        pronostico2: pronostico2,
                        pronostico3: pronostico3,
                        pronostico4: pronostico4,
                        pronostico5: pronostico5,
                    });
                });
            });
        });


        this.app.get('/actualizado', (req, res) => {
            let idStudent = req.query.idStudent;
            let firstname = req.query.firstname;
            let lastname = req.query.lastname;
            let country = req.query.country;
            let password = req.query.password;
            let email = req.query.email;
            let phone = req.query.phone;

            let mysql = require('mysql');

            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "appweb"
            });

            con.connect((err) => {
                if (err) throw err;
                console.log("Connected!");

                let sql = "UPDATE ialumnos SET password  = '" + password + "' WHERE idStudent =" + idStudent + " AND firstname = '"+ firstname +"' ";
                        //UPDATE `ialumnos` SET `password` =     'lenel nuevo' WHERE `ialumnos`.`idStudent` = 21;
                con.query(sql, (err, result) => {
                    if (err) throw err;

                    console.log("1 record inserted");

                    // Obtener el idStudent del resultado de la inserción
                    let insertedId = result.insertId;

                    res.render('actualizado', {
                        idStudent: idStudent,
                        Nombre: firstname,
                        country: country
                    });
                });
            });
        });
        

        this.app.get('/insertarequipo', (req, res) => {
            if (req,session.user)
            {
                if (req.session.user && req.session.user.rol == 'admin') {

            let id_equipo = req.query.id_equipo;
            let nombre_equipo = req.query.nombre_equipo;


            let mysql = require('mysql');

            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "appweb"
            });

            con.connect((err) => {
                if (err) throw err;
                console.log("Connected!");

                let sql = "INSERT INTO equipo (nombre) VALUES ('" + nombre_equipo + "')";

                con.query(sql, (err, result) => {
                    if (err) throw err;

                    console.log("1 record inserted");

                    // Obtener el idStudent del resultado de la inserción
                    let insertedId = result.insertId;

                    res.render('insertarequiporesult', {

                        nombre_equipo: nombre_equipo
                    });
                });
            });
            }
        }
        });
        
        
        this.app.get('/insertarpartidos', (req, res) => {
            let id_partido = req.query.id_partido   ;
            let equipo_local = req.query.equipo_local;
            let equipo_visitante = req.query.equipo_visitante;
            let nombre_partido = req.query.nombre_partido;

            let mysql = require('mysql');

            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "appweb"
            });

            con.connect((err) => {
                if (err) throw err;
                console.log("Connected!");

                let sql = "INSERT INTO partido (equipo_local, equipo_visitante, nombre_partido) VALUES ('" + equipo_local + "', '" + equipo_visitante + "' , '" + nombre_partido + "')";

                con.query(sql, (err, result) => {
                    if (err) throw err;

                    console.log("1 record inserted");

                    // Obtener el idStudent del resultado de la inserción
                    let insertedId = result.insertId;

                    res.render('insertarpartidoresult', {

                        nombre_partido: nombre_partido
                    });
                });
            });
        });


        this.app.get('/consultar', (req, res) => {
            let mysql = require('mysql');

            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "appweb"
            });

            con.connect((err) => {
                if (err) throw err;
                console.log("¡Conectado a la base de datos!");
                let sql = "SELECT * FROM ialumnos ";

                con.query(sql, (err, result) => {
                    if (err) throw err;
                    console.log(result);
                    res.render("consultar", { ialumnos: result });
                });
            });
        });
    }

    // listen() {
    //     this.app.listen(this.port, () => {
    //         console.log("http://127.0.0.1:" + this.port);
    //     });
    // }
}

module.exports = Server;
