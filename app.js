import express, { request, response } from "express";
import session from "express-session";


const app = express();

app.use(
    session({
        secret: 'p03-CPD#seiyakoulovers',
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: 24 * 60 * 1000}
    })
)

//? Ruta para inicializar la sesion
app.get('/iniciar-sesion', (request, response) => {
    if (!request.session.inicio) {
        request.session.inicio = new Date();
        request.session.ultimoAcceso = new Date();
        response.send('Sesión Iniciada.');
    } else {
        response.send('La sesión ya está activada.')
    }
});

//? Ruta para actualizar la fecha de ultima consulta
app.get('/actualizar', (request, response) => {
    if (request.session.inicio) {
        request.session.ultimoAcceso = new Date();
        response.send('Fecha de última consulta actualizada');
    } else {
        response.send('No hay ninguna sesión activa.');
    }
});


//? Ruta para ver el estado de la sesión
app.get('/estado-sesion', (request, response) => {
    if (request.session.inicio) {
        const inicio = new Date(request.session.inicio);  // Convertir a objeto Date si no lo es
        const ultimoAcceso = new Date(request.session.ultimoAcceso);  // Convertir a objeto Date si no lo es
        const ahora = new Date();

        // Calcular la antigüedad de la sesión
        const antiguedadMs = ahora - inicio;
        const horas = Math.floor(antiguedadMs / (1000 * 60 * 60));
        const minutos = Math.floor((antiguedadMs % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((antiguedadMs % (1000 * 60)) / 1000);

        //Covertimos las fechas al huso horario CDMX
        const inicioCDMX = moment(inicio).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        const ultimoCDMX = moment(ultimoAcceso).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');

        // Convertimos la fecha al formato ISO para su visualización
        response.json({
            mensaje: 'Estado de la Sesión',
            sesionID: request.sessionID,
            inicio: inicioCDMX,
            ultimoAcceso: ultimoCDMX,
            antiguedad: `${horas} horas, ${minutos} minutos, ${segundos} segundos`
        });
    } else {
        response.send('No hay una sesión activa.');
    }
});


//? Ruta para cerrar sesión
app.get('/cerrar-sesion', (request,response)=>{
    if(request.session.inicio){
        request.session.destroy((err) =>{
            if(err){
                return response.status(500).send('Error al cerrar la sesión')
            }
            response.send('Sesión cerrada correctamente')
        })
    }else{
        response.send('No hay una sesión activa para cerrar.')
    }
});

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost: ${PORT}`)
})